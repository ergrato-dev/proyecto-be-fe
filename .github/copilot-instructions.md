# 🎓 Instrucciones del Proyecto — NN Auth System

<!--
  ¿Qué? Archivo de instrucciones para GitHub Copilot y colaboradores del proyecto.
  ¿Para qué? Define TODAS las reglas, convenciones, tecnologías y estándares que se
  deben seguir en cada archivo, commit, test y decisión técnica del proyecto.
  ¿Impacto? Garantiza consistencia, calidad y enfoque pedagógico en todo el código generado.
  Este archivo es la "ley" del proyecto — todo lo que se haga debe alinearse con estas reglas.
-->

---

## 1. Identidad del Proyecto

| Campo              | Valor                                                     |
| ------------------ | --------------------------------------------------------- |
| **Nombre**         | NN Auth System                                            |
| **Tipo**           | Proyecto educativo — SENA, Ficha 3171599                  |
| **Propósito**      | Sistema de autenticación completo (registro, login, cambio y recuperación de contraseña) para una empresa genérica "NN" |
| **Enfoque**        | Aprendizaje guiado: cada línea de código y documentación debe enseñar |
| **Fecha de inicio**| Febrero 2026                                              |

---

## 2. Stack Tecnológico

### 2.1 Backend (`be/`)

| Tecnología           | Versión   | Propósito                                      |
| -------------------- | --------- | ---------------------------------------------- |
| Python               | 3.12+     | Lenguaje principal del backend                  |
| FastAPI              | 0.115+    | Framework web async de alto rendimiento         |
| Uvicorn              | latest    | Servidor ASGI para ejecutar FastAPI             |
| SQLAlchemy           | 2.0+      | ORM para interactuar con la base de datos       |
| Alembic              | latest    | Migraciones de base de datos versionadas        |
| Pydantic             | 2.0+      | Validación de datos y schemas (request/response)|
| pydantic-settings    | latest    | Configuración desde variables de entorno        |
| python-jose[cryptography] | latest | Creación y verificación de tokens JWT      |
| passlib[bcrypt]      | latest    | Hashing seguro de contraseñas con bcrypt        |
| psycopg2-binary      | latest    | Driver PostgreSQL para Python                   |
| python-multipart     | latest    | Soporte para form data en FastAPI               |
| pytest               | latest    | Framework de testing                            |
| pytest-asyncio       | latest    | Soporte para tests async con pytest             |
| httpx                | latest    | Cliente HTTP async para tests de integración    |
| ruff                 | latest    | Linter + formatter ultrarrápido para Python     |

### 2.2 Frontend (`fe/`)

| Tecnología           | Versión   | Propósito                                      |
| -------------------- | --------- | ---------------------------------------------- |
| Node.js              | 20 LTS+   | Runtime de JavaScript                           |
| React                | 18+       | Biblioteca para interfaces de usuario           |
| Vite                 | 6+        | Bundler y dev server ultrarrápido               |
| TypeScript           | 5.0+      | Superset tipado de JavaScript                   |
| TailwindCSS          | 4+        | Framework CSS utility-first                     |
| React Router         | 7+        | Enrutamiento del lado del cliente               |
| Axios                | latest    | Cliente HTTP para comunicación con la API       |
| Vitest               | latest    | Framework de testing compatible con Vite        |
| Testing Library      | latest    | Utilidades de testing para componentes React    |
| ESLint               | latest    | Linter para TypeScript/React                    |
| Prettier             | latest    | Formateador de código                           |

### 2.3 Base de Datos

| Tecnología   | Versión | Propósito                                       |
| ------------ | ------- | ----------------------------------------------- |
| PostgreSQL   | 17+     | Base de datos relacional principal               |
| Docker Compose | latest | Orquestación de contenedores (BD en desarrollo) |

### 2.4 Autenticación

| Concepto        | Implementación                                        |
| --------------- | ----------------------------------------------------- |
| Método          | JWT (JSON Web Tokens) — stateless                     |
| Access Token    | Duración: 15 minutos                                  |
| Refresh Token   | Duración: 7 días                                      |
| Hashing         | bcrypt vía passlib                                    |
| Flujos          | Registro, Login, Cambio de contraseña, Recuperación por email |

---

## 3. Reglas de Lenguaje — OBLIGATORIAS

### 3.1 Nomenclatura técnica → INGLÉS

Todo lo que sea código debe estar en **inglés**:

- Variables, funciones, clases, métodos
- Nombres de archivos y carpetas de código
- Endpoints y rutas de la API
- Nombres de tablas y columnas en la base de datos
- Nombres de componentes React
- Mensajes de commits
- Ramas de git

```python
# ✅ CORRECTO
def get_user_by_email(email: str) -> User:
    ...

# ❌ INCORRECTO
def obtener_usuario_por_email(correo: str) -> Usuario:
    ...
```

### 3.2 Comentarios y documentación → ESPAÑOL

Todo lo que sea documentación o comentarios debe estar en **español**:

- Comentarios en el código (`#`, `//`, `/* */`)
- Docstrings de funciones y clases
- Archivos de documentación (`.md`)
- README.md
- Descripciones en archivos de configuración
- Comentarios JSDoc en TypeScript

### 3.3 Regla del comentario pedagógico — ¿QUÉ? ¿PARA QUÉ? ¿IMPACTO?

**Cada comentario significativo debe responder tres preguntas:**

```python
# ¿Qué? Función que hashea la contraseña del usuario usando bcrypt.
# ¿Para qué? Almacenar contraseñas de forma segura, nunca en texto plano.
# ¿Impacto? Si se omite el hashing, las contraseñas quedan expuestas ante una filtración de la BD.
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
```

```typescript
/**
 * ¿Qué? Hook personalizado que provee el estado de autenticación y sus acciones.
 * ¿Para qué? Centralizar la lógica de auth para que cualquier componente pueda consumirla.
 * ¿Impacto? Sin este hook, cada componente tendría que reimplementar la lógica de auth,
 * causando duplicación de código y posibles inconsistencias.
 */
export function useAuth(): AuthContextType {
  // ...
}
```

### 3.4 Cabecera de archivo obligatoria

Cada archivo nuevo debe incluir un **comentario de cabecera** al inicio:

```python
"""
Módulo: security.py
Descripción: Utilidades de seguridad — hashing de contraseñas y manejo de tokens JWT.
¿Para qué? Proveer funciones reutilizables de seguridad que se usan en todo el sistema de auth.
¿Impacto? Es la base de la seguridad del sistema. Un error aquí compromete toda la autenticación.
"""
```

```typescript
/**
 * Archivo: AuthContext.tsx
 * Descripción: Contexto de React que gestiona el estado de autenticación global.
 * ¿Para qué? Proveer a toda la aplicación acceso al usuario autenticado, tokens y acciones de auth.
 * ¿Impacto? Sin este contexto, no habría forma de saber si el usuario está logueado
 * ni de proteger rutas que requieren autenticación.
 */
```

---

## 4. Reglas de Entorno y Herramientas — OBLIGATORIAS

### 4.1 Python — SIEMPRE usar `venv`

```bash
# ✅ CORRECTO — Crear entorno virtual con venv
cd be
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# ❌ INCORRECTO — Nunca instalar en Python del sistema
pip install fastapi  # ← NO hacer esto sin .venv activado

# ❌ INCORRECTO — No usar conda, pipenv, poetry u otros (salvo aprobación explícita)
```

**NUNCA** ejecutar `pip install` sin antes verificar que el `.venv` está activo.

### 4.2 Node.js — SIEMPRE usar `pnpm`

```bash
# ✅ CORRECTO
pnpm install
pnpm add axios
pnpm add -D vitest
pnpm dev
pnpm test
pnpm build

# ❌ INCORRECTO — NUNCA usar npm
npm install        # ← PROHIBIDO
npm run dev        # ← PROHIBIDO
npx some-tool      # ← Usar pnpm dlx en su lugar

# ❌ INCORRECTO — NUNCA usar yarn
yarn install       # ← PROHIBIDO
```

Si algún tutorial o documentación sugiere `npm`, **reemplazar** por el equivalente `pnpm`.

### 4.3 Variables de entorno

- **NUNCA** hardcodear credenciales, URLs de base de datos, secrets, o configuración sensible
- Usar archivos `.env` (no versionados en git)
- Proveer **siempre** un `.env.example` con las variables necesarias y valores de ejemplo
- Validar las variables de entorno al iniciar la aplicación (Pydantic Settings en BE)

```bash
# be/.env.example
DATABASE_URL=postgresql://nn_user:nn_password@localhost:5432/nn_auth_db
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
MAIL_SERVER=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=noreply@nn-company.com
MAIL_PASSWORD=your-mail-password
FRONTEND_URL=http://localhost:5173
```

---

## 5. Estructura del Proyecto

```
proyecto/                          # Raíz del monorepo
├── .github/
│   └── copilot-instructions.md    # ← ESTE ARCHIVO — reglas del proyecto
├── .gitignore                     # Archivos ignorados por git
├── docker-compose.yml             # Servicios: PostgreSQL
├── README.md                      # Documentación principal del proyecto
│
├── _docs/                         # 📚 Documentación del proyecto
│   ├── architecture.md            # Arquitectura general y diagramas
│   ├── api-endpoints.md           # Documentación de todos los endpoints
│   └── database-schema.md         # Esquema de base de datos y ER diagram
│
├── _assets/                       # 🖼️ Recursos estáticos (imágenes, diagramas)
│
├── be/                            # 🐍 Backend — FastAPI
│   ├── .env                       # Variables de entorno (NO versionado)
│   ├── .env.example               # Plantilla de variables de entorno
│   ├── .venv/                     # Entorno virtual Python (NO versionado)
│   ├── requirements.txt           # Dependencias Python
│   ├── alembic.ini                # Configuración de Alembic
│   ├── alembic/                   # Migraciones de base de datos
│   │   ├── env.py
│   │   └── versions/
│   └── app/                       # Código fuente de la aplicación
│       ├── __init__.py
│       ├── main.py                # Punto de entrada — configura y arranca FastAPI
│       ├── config.py              # Configuración centralizada (Pydantic Settings)
│       ├── database.py            # Engine, Session y Base de SQLAlchemy
│       ├── dependencies.py        # Dependencias inyectables (get_db, get_current_user)
│       ├── models/                # Modelos ORM (tablas de la BD)
│       │   ├── __init__.py
│       │   └── user.py
│       ├── schemas/               # Schemas Pydantic (validación request/response)
│       │   ├── __init__.py
│       │   └── user.py
│       ├── routers/               # Endpoints agrupados por dominio
│       │   ├── __init__.py
│       │   ├── auth.py            # Registro, login, refresh, password flows
│       │   └── users.py           # Perfil del usuario
│       ├── services/              # Lógica de negocio
│       │   ├── __init__.py
│       │   └── auth_service.py
│       ├── utils/                 # Utilidades transversales
│       │   ├── __init__.py
│       │   ├── security.py        # Hashing, JWT
│       │   └── email.py           # Envío de emails
│       └── tests/                 # Tests
│           ├── __init__.py
│           ├── conftest.py        # Fixtures compartidos
│           └── test_auth.py       # Tests de autenticación
│
└── fe/                            # ⚛️ Frontend — React + Vite + TypeScript
    ├── .env                       # Variables de entorno (NO versionado)
    ├── .env.example               # Plantilla de variables de entorno
    ├── index.html                 # HTML base de Vite
    ├── package.json               # Dependencias y scripts
    ├── pnpm-lock.yaml             # Lockfile de pnpm
    ├── vite.config.ts             # Configuración de Vite
    ├── tsconfig.json              # Configuración de TypeScript
    ├── eslint.config.js           # Configuración de ESLint
    └── src/
        ├── main.tsx               # Punto de entrada — renderiza App en el DOM
        ├── App.tsx                # Componente raíz — define rutas
        ├── index.css              # Estilos globales + imports de Tailwind
        ├── api/                   # Clientes HTTP
        │   └── auth.ts            # Funciones para cada endpoint de auth
        ├── components/            # Componentes reutilizables
        │   ├── ui/                # Componentes UI genéricos (Button, Input, Alert)
        │   └── layout/            # Layout, Navbar, Footer
        ├── pages/                 # Páginas/vistas (una por ruta)
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── DashboardPage.tsx
        │   ├── ChangePasswordPage.tsx
        │   ├── ForgotPasswordPage.tsx
        │   └── ResetPasswordPage.tsx
        ├── hooks/                 # Custom hooks
        │   └── useAuth.ts
        ├── context/               # React Context providers
        │   └── AuthContext.tsx
        ├── types/                 # Tipos e interfaces TypeScript
        │   └── auth.ts
        ├── utils/                 # Utilidades (formateo, validación, etc.)
        └── __tests__/             # Tests
            └── auth.test.tsx
```

---

## 6. Convenciones de Código

### 6.1 Python (Backend)

| Aspecto            | Convención                                                |
| ------------------ | --------------------------------------------------------- |
| Estilo             | PEP 8, reforzado por `ruff`                               |
| Naming variables   | `snake_case`                                              |
| Naming clases      | `PascalCase`                                              |
| Naming constantes  | `UPPER_SNAKE_CASE`                                        |
| Type hints         | **Obligatorios** en parámetros y retornos de funciones    |
| Docstrings         | Formato Google, en español                                |
| Imports            | Ordenados por `ruff` (stdlib → third-party → local)       |
| Línea máxima       | 100 caracteres                                            |

```python
# ✅ Ejemplo de función bien documentada y tipada
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si una contraseña en texto plano coincide con su hash.

    ¿Qué? Compara una contraseña ingresada contra el hash almacenado en la BD.
    ¿Para qué? Validar las credenciales del usuario durante el login.
    ¿Impacto? Es el mecanismo central de verificación — si falla, nadie puede autenticarse.

    Args:
        plain_password: Contraseña en texto plano ingresada por el usuario.
        hashed_password: Hash bcrypt almacenado en la base de datos.

    Returns:
        True si la contraseña coincide, False en caso contrario.
    """
    return pwd_context.verify(plain_password, hashed_password)
```

### 6.2 TypeScript/React (Frontend)

| Aspecto            | Convención                                                |
| ------------------ | --------------------------------------------------------- |
| Estilo             | ESLint + Prettier                                         |
| Naming variables   | `camelCase`                                               |
| Naming componentes | `PascalCase`                                              |
| Naming archivos    | `PascalCase` para componentes, `camelCase` para utilidades|
| Naming tipos       | `PascalCase` con sufijo descriptivo (`UserResponse`, `LoginRequest`) |
| Componentes        | **Funcionales** con hooks — nunca clases                  |
| Interfaces vs Types| Preferir `interface` para objetos, `type` para uniones/intersecciones |
| CSS                | TailwindCSS utility classes — evitar CSS custom           |
| Strict mode        | `"strict": true` en tsconfig.json                         |

```typescript
// ✅ Ejemplo de componente bien documentado
/**
 * ¿Qué? Campo de entrada reutilizable con label, validación y mensajes de error.
 * ¿Para qué? Estandarizar todos los inputs del formulario de auth con un diseño consistente.
 * ¿Impacto? Sin este componente, cada formulario tendría su propia implementación de inputs,
 * resultando en inconsistencias visuales y duplicación de lógica de validación.
 */
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({ label, name, type = "text", error, value, onChange }: InputFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

### 6.3 SQL / Base de Datos

| Aspecto            | Convención                                                |
| ------------------ | --------------------------------------------------------- |
| Nombres de tablas  | `snake_case`, plural (`users`, `password_reset_tokens`)   |
| Nombres de columnas| `snake_case` (`created_at`, `hashed_password`)            |
| Primary Keys       | `id` (UUID o autoincremental)                             |
| Foreign Keys       | `<tabla_singular>_id` (ej: `user_id`)                     |
| Timestamps         | `created_at`, `updated_at` en toda tabla                  |
| Migraciones        | Siempre vía Alembic, nunca alterar BD manualmente         |

---

## 7. Conventional Commits — OBLIGATORIO

### 7.1 Formato

```
type(scope): short description in english

What: Detailed description of what was done
For: Why this change is needed
Impact: What effect this has on the system
```

### 7.2 Tipos permitidos

| Tipo       | Uso                                                        |
| ---------- | ---------------------------------------------------------- |
| `feat`     | Nueva funcionalidad                                        |
| `fix`      | Corrección de bug                                          |
| `docs`     | Solo documentación                                         |
| `style`    | Formato, espacios, puntos y comas (no afecta lógica)       |
| `refactor` | Reestructuración sin cambiar funcionalidad                 |
| `test`     | Agregar o corregir tests                                   |
| `chore`    | Tareas de mantenimiento, configuración, dependencias       |
| `ci`       | Cambios en CI/CD                                           |
| `perf`     | Mejoras de rendimiento                                     |

### 7.3 Scopes sugeridos

- `auth` — Autenticación y autorización
- `user` — Modelo/funcionalidad de usuario
- `db` — Base de datos y migraciones
- `api` — Endpoints y routers
- `ui` — Componentes y estilos del frontend
- `config` — Configuración y entorno
- `test` — Tests
- `deps` — Dependencias

### 7.4 Ejemplos

```bash
# ✅ Ejemplo de commit completo
git commit -m "feat(auth): add user registration endpoint

What: Creates POST /api/v1/auth/register endpoint with email validation,
password hashing, and duplicate email check
For: Allow new users to create accounts in the NN Auth System
Impact: Enables the user onboarding flow; stores hashed passwords using
bcrypt in the users table"

# ✅ Ejemplo de fix
git commit -m "fix(auth): handle expired refresh token gracefully

What: Returns 401 with clear error message when refresh token is expired
For: Prevent confusing 500 errors when users try to refresh after 7 days
Impact: Improves UX by redirecting to login instead of showing error page"

# ✅ Ejemplo de chore
git commit -m "chore(deps): upgrade fastapi to 0.115.6

What: Updates FastAPI from 0.115.0 to 0.115.6 in requirements.txt
For: Include latest security patches and bug fixes
Impact: No breaking changes; all existing tests pass"
```

---

## 8. Calidad — NO es Opcional, es OBLIGACIÓN

### 8.1 Principio fundamental

> **Código que se genera, código que se prueba.**

Cada función, endpoint, componente o utilidad que se cree **debe** tener su test correspondiente.
No se considera "terminada" una feature hasta que sus tests pasen.

### 8.2 Testing — Backend

| Herramienta      | Propósito                                         |
| ---------------- | ------------------------------------------------- |
| `pytest`         | Framework principal de testing                    |
| `pytest-asyncio` | Ejecutar tests asíncronos                         |
| `httpx`          | AsyncClient para tests de integración con FastAPI |
| `pytest-cov`     | Medir cobertura de código                         |

```bash
# Ejecutar todos los tests del backend
cd be && source .venv/bin/activate && pytest -v

# Ejecutar con cobertura
pytest --cov=app --cov-report=term-missing

# Ejecutar un test específico
pytest app/tests/test_auth.py::test_register_user -v
```

**Cobertura mínima esperada**: 80% en módulos de lógica de negocio.

### 8.3 Testing — Frontend

| Herramienta          | Propósito                                       |
| -------------------- | ----------------------------------------------- |
| `vitest`             | Test runner compatible con Vite                 |
| `@testing-library/react` | Testing de componentes React               |
| `jsdom`              | Simular el DOM en Node.js                       |

```bash
# Ejecutar todos los tests del frontend
cd fe && pnpm test

# Ejecutar en modo watch
pnpm test:watch

# Ejecutar con cobertura
pnpm test:coverage
```

### 8.4 Linting y Formateo

```bash
# Backend — ruff (linter + formatter)
cd be && ruff check app/         # Verificar errores
cd be && ruff format app/        # Formatear código

# Frontend — ESLint + Prettier
cd fe && pnpm lint               # Verificar errores
cd fe && pnpm format             # Formatear código
```

### 8.5 Checklist antes de commit

- [ ] ¿El código tiene type hints (Python) o tipos (TypeScript)?
- [ ] ¿Hay comentarios pedagógicos (¿Qué? ¿Para qué? ¿Impacto?)?
- [ ] ¿Los tests pasan? (`pytest` / `pnpm test`)
- [ ] ¿El linter no reporta errores? (`ruff check` / `pnpm lint`)
- [ ] ¿El commit sigue Conventional Commits con What/For/Impact?
- [ ] ¿Las variables sensibles están en `.env` y no hardcodeadas?
- [ ] ¿El `.env.example` se actualizó si se agregaron nuevas variables?

---

## 9. Seguridad — Mejores Prácticas

### 9.1 Contraseñas

- **SIEMPRE** hashear con bcrypt (vía `passlib`) antes de almacenar
- **NUNCA** almacenar contraseñas en texto plano
- **NUNCA** loggear contraseñas ni incluirlas en responses
- Validar fortaleza mínima: ≥8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número

### 9.2 JWT (Tokens)

- Access Token: corta duración (15 min) — se envía en header `Authorization: Bearer <token>`
- Refresh Token: larga duración (7 días) — se usa solo para obtener nuevos access tokens
- Secret key: mínimo 32 caracteres, aleatoria, en variable de entorno
- Algoritmo: HS256
- **NUNCA** almacenar tokens en `localStorage` en producción (usar httpOnly cookies o memoria)

### 9.3 CORS

- Configurar orígenes permitidos explícitamente
- En desarrollo: permitir `http://localhost:5173`
- En producción: **NUNCA** usar `allow_origins=["*"]`

### 9.4 API

- Versionamiento: `/api/v1/...`
- Rate limiting en endpoints de auth (prevenir brute force)
- Validación de inputs con Pydantic (nunca confiar en datos del cliente)
- Mensajes de error genéricos en auth (no revelar si el email existe)

### 9.5 Base de datos

- Usar siempre SQLAlchemy ORM (nunca raw SQL sin parametrizar)
- Conexiones con pool configurado
- Credenciales en variables de entorno

---

## 10. Estructura de la API

### 10.1 Prefijo base

Todos los endpoints van bajo `/api/v1/`

### 10.2 Endpoints de autenticación (`/api/v1/auth/`)

| Método | Ruta                | Descripción                          | Auth requerida |
| ------ | ------------------- | ------------------------------------ | -------------- |
| POST   | `/register`         | Registrar nuevo usuario              | No             |
| POST   | `/login`            | Iniciar sesión, obtener tokens       | No             |
| POST   | `/refresh`          | Renovar access token con refresh     | No (*)         |
| POST   | `/change-password`  | Cambiar contraseña (usuario logueado)| Sí             |
| POST   | `/forgot-password`  | Solicitar email de recuperación      | No             |
| POST   | `/reset-password`   | Restablecer contraseña con token     | No (*)         |

(*) Requiere un token válido (refresh o reset), pero no el access token estándar.

### 10.3 Endpoints de usuario (`/api/v1/users/`)

| Método | Ruta    | Descripción                     | Auth requerida |
| ------ | ------- | ------------------------------- | -------------- |
| GET    | `/me`   | Obtener perfil del usuario actual | Sí           |

---

## 11. Esquema de Base de Datos

### 11.1 Tabla `users`

| Columna           | Tipo         | Restricciones                        |
| ----------------- | ------------ | ------------------------------------ |
| `id`              | UUID         | PK, default uuid4                    |
| `email`           | VARCHAR(255) | UNIQUE, NOT NULL, INDEXED            |
| `full_name`       | VARCHAR(255) | NOT NULL                             |
| `hashed_password` | VARCHAR(255) | NOT NULL                             |
| `is_active`       | BOOLEAN      | DEFAULT TRUE                         |
| `created_at`      | TIMESTAMP    | DEFAULT NOW(), NOT NULL              |
| `updated_at`      | TIMESTAMP    | DEFAULT NOW(), ON UPDATE NOW()       |

### 11.2 Tabla `password_reset_tokens`

| Columna      | Tipo         | Restricciones                        |
| ------------ | ------------ | ------------------------------------ |
| `id`         | UUID         | PK, default uuid4                    |
| `user_id`    | UUID         | FK → users.id, NOT NULL              |
| `token`      | VARCHAR(255) | UNIQUE, NOT NULL, INDEXED            |
| `expires_at` | TIMESTAMP    | NOT NULL                             |
| `used`       | BOOLEAN      | DEFAULT FALSE                        |
| `created_at` | TIMESTAMP    | DEFAULT NOW(), NOT NULL              |

---

## 12. Flujos de Autenticación

### 12.1 Registro

```
Cliente → POST /api/v1/auth/register { email, full_name, password }
  → Validar datos (Pydantic)
  → Verificar email no duplicado
  → Hashear password (bcrypt)
  → Crear usuario en BD
  → Retornar usuario creado (sin password)
```

### 12.2 Login

```
Cliente → POST /api/v1/auth/login { email, password }
  → Buscar usuario por email
  → Verificar password contra hash
  → Generar access_token (15 min) + refresh_token (7 días)
  → Retornar { access_token, refresh_token, token_type: "bearer" }
```

### 12.3 Cambio de contraseña (usuario autenticado)

```
Cliente → POST /api/v1/auth/change-password { current_password, new_password }
  → (Requiere Authorization: Bearer <access_token>)
  → Verificar current_password contra hash
  → Hashear new_password
  → Actualizar en BD
  → Retornar confirmación
```

### 12.4 Recuperación de contraseña (forgot + reset)

```
Paso 1: Solicitar recuperación
Cliente → POST /api/v1/auth/forgot-password { email }
  → Buscar usuario por email
  → Generar token de reset (UUID + expiración 1 hora)
  → Guardar token en tabla password_reset_tokens
  → Enviar email con enlace: {FRONTEND_URL}/reset-password?token={token}
  → Retornar mensaje genérico (no revelar si el email existe)

Paso 2: Restablecer contraseña
Cliente → POST /api/v1/auth/reset-password { token, new_password }
  → Buscar token en BD
  → Verificar que no haya expirado ni sido usado
  → Hashear new_password
  → Actualizar password del usuario
  → Marcar token como usado
  → Retornar confirmación
```

---

## 13. Configuración de Docker Compose

Servicios necesarios para desarrollo:

```yaml
# Solo para desarrollo local — PostgreSQL 17
services:
  db:
    image: postgres:17-alpine
    container_name: nn_auth_db
    environment:
      POSTGRES_USER: nn_user
      POSTGRES_PASSWORD: nn_password
      POSTGRES_DB: nn_auth_db
    ports:
      - "5432:5432"
    volumes:
      - nn_auth_data:/var/lib/postgresql/data

volumes:
  nn_auth_data:
```

---

## 14. Mejores Prácticas — Resumen

### 14.1 Generales

- ✅ **DRY** (Don't Repeat Yourself) — reutilizar código
- ✅ **KISS** (Keep It Simple, Stupid) — preferir soluciones simples
- ✅ **YAGNI** (You Aren't Gonna Need It) — no agregar lo que no se necesita aún
- ✅ **Separation of Concerns** — cada módulo tiene una responsabilidad clara
- ✅ **Fail fast** — validar inputs al inicio de cada operación
- ✅ **Defensive programming** — manejar errores explícitamente

### 14.2 Backend

- ✅ Usar dependency injection de FastAPI (`Depends()`)
- ✅ Separar routers (endpoints) de services (lógica de negocio)
- ✅ Usar Pydantic para toda validación de datos
- ✅ Manejar excepciones con `HTTPException` y códigos HTTP correctos
- ✅ Usar tipos de retorno explícitos (`response_model` en endpoints)
- ✅ Documentar automáticamente con Swagger UI (`/docs`)

### 14.3 Frontend

- ✅ Componentes pequeños y reutilizables
- ✅ Estado global solo cuando es necesario (Context API para auth)
- ✅ Custom hooks para encapsular lógica reutilizable
- ✅ Rutas protegidas con componente `ProtectedRoute`
- ✅ Manejo de errores con feedback visual al usuario
- ✅ Loading states para operaciones asíncronas

---

## 15. Reglas para Copilot / IA — Al Generar Código

1. **Dividir respuestas largas** — Si la implementación es extensa, dividirla en pasos incrementales. No generar todo de golpe.
2. **Codigo generado = código probado** — Siempre incluir o sugerir tests para lo que se genere.
3. **Comentarios pedagógicos** — Cada bloque significativo debe tener comentarios con ¿Qué? ¿Para qué? ¿Impacto?
4. **Type hints y tipos obligatorios** — Nunca omitir tipado en Python ni en TypeScript.
5. **Formato correcto** — Respetar PEP 8 para Python y Prettier/ESLint para TypeScript.
6. **Usar las herramientas correctas** — `venv` para Python, `pnpm` para Node.js. Sin excepciones.
7. **Variables de entorno** — Toda configuración sensible va en `.env`, nunca hardcodeada.
8. **Conventional Commits** — Sugerir mensajes de commit con formato correcto.
9. **Seguridad primero** — Nunca almacenar passwords en texto plano, nunca exponer secrets.
10. **Legibilidad sobre cleverness** — El código debe ser entendible para un aprendiz.

---

## 16. Plan de Trabajo — Fases

> Cada fase es independiente y verificable. No avanzar a la siguiente sin completar y probar la actual.

### Fase 0 — Fundamentos y Configuración Base

- [x] Crear `.github/copilot-instructions.md` (este archivo)
- [x] Crear `.gitignore` raíz
- [x] Crear `docker-compose.yml` con PostgreSQL 17
- [x] Crear `README.md` con descripción, stack, prerrequisitos y setup

### Fase 1 — Backend Setup

- [x] Inicializar `venv` en `be/`
- [x] Crear `requirements.txt` con todas las dependencias
- [x] Instalar dependencias
- [x] Crear `app/config.py` — Pydantic Settings
- [x] Crear `app/database.py` — SQLAlchemy engine + session
- [x] Crear `app/main.py` — FastAPI app con CORS
- [x] Crear `.env.example` y `.env`
- [x] ✅ Verificar: `uvicorn app.main:app --reload` → Swagger UI en `/docs`

### Fase 2 — Modelo de Datos y Migraciones

- [x] Crear `app/models/user.py` — Modelo User
- [x] Crear `app/models/password_reset_token.py` — Modelo PasswordResetToken
- [x] Inicializar Alembic
- [x] Crear primera migración
- [x] Ejecutar migración
- [x] ✅ Verificar: tablas creadas en PostgreSQL

### Fase 3 — Autenticación Backend

- [x] Crear `app/utils/security.py` — hashing + JWT
- [x] Crear `app/schemas/user.py` — schemas Pydantic
- [x] Crear `app/services/auth_service.py` — lógica de negocio
- [x] Crear `app/utils/email.py` — envío de email de recuperación
- [x] Crear `app/dependencies.py` — get_db, get_current_user
- [x] Crear `app/routers/auth.py` — endpoints de auth
- [x] Crear `app/routers/users.py` — endpoint GET /me
- [x] ✅ Verificar: probar todos los endpoints en Swagger UI

### Fase 4 — Tests Backend

- [ ] Crear `app/tests/conftest.py` — fixtures
- [ ] Crear `app/tests/test_auth.py` — tests completos
- [ ] ✅ Verificar: `pytest -v` → todos los tests pasan

### Fase 5 — Frontend Setup

- [ ] Inicializar proyecto Vite con React + TypeScript en `fe/`
- [ ] Instalar dependencias con `pnpm`
- [ ] Configurar TailwindCSS
- [ ] Configurar TypeScript strict mode
- [ ] Crear `.env.example`
- [ ] ✅ Verificar: `pnpm dev` → app base visible en `http://localhost:5173`

### Fase 6 — Frontend Auth

- [ ] Crear tipos TypeScript (`types/auth.ts`)
- [ ] Crear cliente HTTP (`api/auth.ts`)
- [ ] Crear AuthContext + Provider
- [ ] Crear hook `useAuth`
- [ ] Crear componentes UI (InputField, Button, Alert)
- [ ] Crear ProtectedRoute
- [ ] Crear páginas: Login, Register, Dashboard, ChangePassword, ForgotPassword, ResetPassword
- [ ] Configurar rutas en App.tsx
- [ ] ✅ Verificar: flujo completo funciona contra la API

### Fase 7 — Tests Frontend

- [ ] Configurar Vitest + Testing Library
- [ ] Crear tests para componentes y flujos de auth
- [ ] ✅ Verificar: `pnpm test` → todos los tests pasan

### Fase 8 — Documentación Final

- [ ] Crear `_docs/architecture.md` — arquitectura y diagramas
- [ ] Crear `_docs/api-endpoints.md` — documentación de endpoints
- [ ] Crear `_docs/database-schema.md` — esquema ER
- [ ] Actualizar `README.md` con instrucciones finales
- [ ] ✅ Verificar: documentación completa y coherente

---

## 17. Verificación Final del Sistema

```bash
# 1. Levantar base de datos
docker compose up -d

# 2. Levantar backend
cd be && source .venv/bin/activate && uvicorn app.main:app --reload

# 3. Levantar frontend (en otra terminal)
cd fe && pnpm dev

# 4. Ejecutar tests backend
cd be && source .venv/bin/activate && pytest -v --cov=app

# 5. Ejecutar tests frontend
cd fe && pnpm test

# 6. Flujo manual completo:
#    Registro → Login → Ver perfil → Cambiar contraseña →
#    Logout → Forgot password → Reset password → Login con nueva contraseña
```

---

> **Recuerda**: La calidad no es una opción, es una obligación.
> Cada línea de código es una oportunidad de aprender y enseñar.
