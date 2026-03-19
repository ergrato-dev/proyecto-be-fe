# Esquema de Base de Datos — NN Auth System

<!--
  ¿Qué? Documentación del esquema relacional de la base de datos PostgreSQL.
  ¿Para qué? Que cualquier desarrollador entienda la estructura de datos del sistema
             sin necesidad de leer los modelos ORM ni conectarse a la base de datos.
  ¿Impacto? El esquema es el contrato entre el backend y la base de datos.
             Entender las relaciones, restricciones e índices es fundamental para
             escribir queries eficientes y migraciones sin errores.
-->

> **Motor**: PostgreSQL 17+
> **ORM**: SQLAlchemy 2.0 con tipos declarativos (Mapped + mapped_column)
> **Migraciones**: Alembic — nunca se modifica la BD manualmente

---

## Diagrama Entidad-Relación (ER)

```
┌─────────────────────────────────────────┐
│                  users                  │
├─────────────────────────────────────────┤
│ PK  id               UUID               │
│     email            VARCHAR(255) UNIQUE│
│     full_name        VARCHAR(255)       │
│     hashed_password  VARCHAR(255)       │
│     is_active        BOOLEAN  = true    │
│     is_email_verified BOOLEAN = false   │
│     created_at       TIMESTAMPTZ        │
│     updated_at       TIMESTAMPTZ        │
└────────────────┬────────────────────────┘
                 │ 1
                 │
       ┌─────────┴──────────┐
       │ N                  │ N
       ▼                    ▼
┌────────────────────┐  ┌──────────────────────────┐
│ password_reset_    │  │  email_verification_     │
│ tokens             │  │  tokens                  │
├────────────────────┤  ├──────────────────────────┤
│PK id    UUID       │  │PK id    UUID             │
│FK user_id → users  │  │FK user_id → users        │
│   token  VARCHAR   │  │   token  VARCHAR         │
│   expires_at TSTZ  │  │   expires_at TSTZ        │
│   used   BOOLEAN   │  │   used   BOOLEAN         │
│   created_at TSTZ  │  │   created_at TSTZ        │
└────────────────────┘  └──────────────────────────┘
```

**Relaciones**:

- Un `User` puede tener **muchos** `PasswordResetToken` (uno por cada solicitud de recuperación)
- Un `User` puede tener **muchos** `EmailVerificationToken` (uno por cada registro/reenvío)
- Ambas tablas de tokens tienen `ondelete="CASCADE"` — si se elimina el usuario, sus tokens se borran automáticamente

---

## Tabla: `users`

Almacena los datos de todos los usuarios registrados en el sistema.

```sql
CREATE TABLE users (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email               VARCHAR(255) NOT NULL UNIQUE,
    full_name           VARCHAR(255) NOT NULL,
    hashed_password     VARCHAR(255) NOT NULL,
    is_active           BOOLEAN     NOT NULL DEFAULT TRUE,
    is_email_verified   BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_users_email ON users (email);
```

### Columnas

| Columna             | Tipo         | Nulo | Default | Descripción                                                   |
| ------------------- | ------------ | ---- | ------- | ------------------------------------------------------------- |
| `id`                | UUID         | No   | uuid4() | Identificador único — UUID evita predicción secuencial        |
| `email`             | VARCHAR(255) | No   | —       | Credencial de login. UNIQUE + INDEX para búsquedas rápidas    |
| `full_name`         | VARCHAR(255) | No   | —       | Nombre completo para mostrar en la interfaz                   |
| `hashed_password`   | VARCHAR(255) | No   | —       | Hash bcrypt de la contraseña. **Nunca texto plano**           |
| `is_active`         | BOOLEAN      | No   | `true`  | Permite desactivar cuentas sin borrar datos (soft delete)     |
| `is_email_verified` | BOOLEAN      | No   | `false` | `false` al registrarse → no puede hacer login hasta verificar |
| `created_at`        | TIMESTAMPTZ  | No   | `now()` | Fecha de registro del usuario (generada por PostgreSQL)       |
| `updated_at`        | TIMESTAMPTZ  | No   | `now()` | Fecha de última modificación — se actualiza en cada UPDATE    |

### Índices

| Índice           | Columna | Tipo   | Razón                                                  |
| ---------------- | ------- | ------ | ------------------------------------------------------ |
| `pk_users`       | `id`    | PK     | Búsquedas por ID (relaciones con tokens)               |
| `ix_users_email` | `email` | UNIQUE | Login frecuente por email — O(log n) con índice B-tree |

### Notas de seguridad

- `hashed_password` almacena el hash bcrypt (formato `$2b$12$...`) — ~60 caracteres estándar, 255 como margen futuro.
- `is_email_verified` implementa verificación de email obligatoria — los nuevos usuarios no pueden autenticarse hasta confirmar su email (OWASP A07).
- `is_active` permite bloquear cuentas sospechosas sin perder datos históricos.

---

## Tabla: `password_reset_tokens`

Almacena tokens temporales para el flujo de recuperación de contraseña.

```sql
CREATE TABLE password_reset_tokens (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    used        BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_password_reset_tokens_token ON password_reset_tokens (token);
```

### Columnas

| Columna      | Tipo         | Nulo | Default | Descripción                                                |
| ------------ | ------------ | ---- | ------- | ---------------------------------------------------------- |
| `id`         | UUID         | No   | uuid4() | Identificador único del registro de token                  |
| `user_id`    | UUID         | No   | —       | FK → `users.id`. CASCADE: si borra el user, borra el token |
| `token`      | VARCHAR(255) | No   | —       | UUID aleatorio enviado en el email de recuperación         |
| `expires_at` | TIMESTAMPTZ  | No   | —       | Expiración: **1 hora** desde la creación                   |
| `used`       | BOOLEAN      | No   | `false` | `true` una vez utilizado — previene reúso del enlace       |
| `created_at` | TIMESTAMPTZ  | No   | `now()` | Fecha de emisión del token                                 |

### Índices

| Índice                           | Columna | Tipo   | Razón                                           |
| -------------------------------- | ------- | ------ | ----------------------------------------------- |
| `pk_password_reset_tokens`       | `id`    | PK     | —                                               |
| `ix_password_reset_tokens_token` | `token` | UNIQUE | Reset password busca por token — requiere INDEX |

### Ciclo de vida de un token de reset

```
1. Usuario solicita reset → se crea registro (used=false, expires_at = now + 1h)
2. Usuario hace clic en el enlace → backend valida token:
   - ¿Existe? → OK
   - ¿expires_at > now()? → OK (no expirado)
   - ¿used == false? → OK (no reutilizado)
3. Se actualiza contraseña + se marca used=true
4. Cualquier intento posterior con el mismo token → rechazado (400)
```

---

## Tabla: `email_verification_tokens`

Almacena tokens temporales para el flujo de verificación de email al registrarse.

```sql
CREATE TABLE email_verification_tokens (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    used        BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_email_verification_tokens_token ON email_verification_tokens (token);
```

### Columnas

| Columna      | Tipo         | Nulo | Default | Descripción                                                |
| ------------ | ------------ | ---- | ------- | ---------------------------------------------------------- |
| `id`         | UUID         | No   | uuid4() | Identificador único del registro de token                  |
| `user_id`    | UUID         | No   | —       | FK → `users.id`. CASCADE: si borra el user, borra el token |
| `token`      | VARCHAR(255) | No   | —       | UUID aleatorio enviado en el email de verificación         |
| `expires_at` | TIMESTAMPTZ  | No   | —       | Expiración: **24 horas** desde la creación                 |
| `used`       | BOOLEAN      | No   | `false` | `true` una vez utilizado — previene reúso del enlace       |
| `created_at` | TIMESTAMPTZ  | No   | `now()` | Fecha de emisión del token                                 |

### Ciclo de vida de un token de verificación

```
1. Usuario se registra → se crea User(is_email_verified=false) + EmailVerificationToken
2. Se envía email con enlace: /verify-email?token=<uuid>
3. Usuario hace clic → backend valida token:
   - ¿Existe? → OK
   - ¿expires_at > now()? → OK (no expirado — válido 24h)
   - ¿used == false? → OK
4. Se actualiza User.is_email_verified = true + se marca token used=true
5. Usuario ya puede hacer login
```

---

## Migraciones con Alembic

El historial de migraciones vive en `be/alembic/versions/`. **Nunca se modifica la BD directamente** — todo cambio va a través de Alembic.

```bash
# Ver estado actual de las migraciones
cd be && alembic current

# Ver historial de migraciones
alembic history --verbose

# Aplicar todas las migraciones pendientes
alembic upgrade head

# Revertir la última migración (solo en desarrollo)
alembic downgrade -1

# Crear nueva migración (detecta cambios en los modelos automáticamente)
alembic revision --autogenerate -m "descripcion del cambio"
```

### Migraciones existentes

| Revisión     | Descripción                                   |
| ------------ | --------------------------------------------- |
| `a7c03fd8`   | Create users and password_reset_tokens tables |
| `c3d5e7f9` ¹ | Add email_verification_tokens table           |

> ¹ El hash exacto puede variar según la instalación — verificar con `alembic history`.

---

## Convenciones de Nomenclatura en la BD

| Aspecto          | Convención                  | Ejemplo                               |
| ---------------- | --------------------------- | ------------------------------------- |
| Tablas           | `snake_case`, plural        | `users`, `password_reset_tokens`      |
| Columnas         | `snake_case`                | `hashed_password`, `created_at`       |
| Primary Keys     | `id` con tipo UUID          | `id UUID PK`                          |
| Foreign Keys     | `<tabla_singular>_id`       | `user_id` → `users.id`                |
| Timestamps       | `created_at` / `updated_at` | Todas las tablas tienen `created_at`  |
| Índices          | `ix_<tabla>_<columna>`      | `ix_users_email`                      |
| Primary Key Name | `pk_<tabla>`                | PostgreSQL los genera automáticamente |

---

## ¿Por qué UUID como Primary Key?

En lugar de integers autoincrementales (1, 2, 3...), este proyecto usa **UUID v4** como PK:

```
# UUID v4 — completamente aleatorio:
550e8400-e29b-41d4-a716-446655440000

# vs Integer autoincremental:
1, 2, 3, 4...
```

**Ventajas del UUID:**

- **Seguridad**: No revela cuántos usuarios hay (`/users/1000` expone que hay al menos 1000 usuarios)
- **No predecible**: No se pueden adivinar IDs de otros usuarios para intentar accesos
- **Distribuido**: Permite generar IDs sin coordinación central (útil en arquitecturas multi-servicio)

**Desventaja**: Los UUIDs son más grandes (16 bytes vs 4 bytes de int) — impacto mínimo en este proyecto educativo.
