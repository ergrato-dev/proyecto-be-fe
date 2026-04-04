---
description: "Genera una migración Alembic para cambios en el esquema de la base de datos: nuevas tablas, columnas, índices o constraints. Usar cuando se modifica un modelo SQLAlchemy."
name: "Migración Alembic"
argument-hint: "Describe el cambio en la BD: qué tabla/columna se crea, modifica o elimina, y por qué"
agent: "agent"
---

# Migración Alembic — NN Auth System

Genera la migración Alembic para el cambio de esquema indicado.

## Convenciones obligatorias

- **NUNCA** modificar la base de datos manualmente — siempre vía Alembic
- **NUNCA** editar una migración ya ejecutada — crear una nueva
- Nombres de tablas: `snake_case`, plural (e.g. `users`, `password_reset_tokens`)
- Nombres de columnas: `snake_case` (e.g. `created_at`, `hashed_password`)
- Toda tabla debe tener `created_at` con `server_default=func.now()`
- Tablas que se actualizan deben tener `updated_at` con `onupdate=func.now()`

## Archivos de referencia

- Modelo User: [be/app/models/user.py](../../../be/app/models/user.py)
- Modelos existentes: [be/app/models/](../../../be/app/models/)
- Ejemplo de migración existente: [be/alembic/versions/](../../../be/alembic/versions/)
- Configuración de Alembic: [be/alembic/env.py](../../../be/alembic/env.py)

## Lo que debes generar

### 1. Actualizar el modelo SQLAlchemy (`be/app/models/`)

Si el cambio implica un nuevo modelo, crear `be/app/models/nombre_modelo.py`.
Si modifica uno existente, editar el archivo modelo correspondiente.

Ejemplo de columna bien definida:

```python
# ¿Qué? Columna que almacena el locale preferido del usuario.
# ¿Para qué? Persistir la preferencia de idioma entre sesiones.
# ¿Impacto? Sin esta columna, el idioma se resetea en cada login.
locale: Mapped[str] = mapped_column(
    String(10),
    nullable=False,
    default="es",
    server_default="es",
)
```

### 2. Generar el archivo de migración en `be/alembic/versions/`

El nombre del archivo debe seguir el patrón de Alembic:
`<hash>_<descripcion_snake_case>.py`

Estructura de la migración:

```python
"""<descripción corta del cambio>

Revision ID: <hash>
Revises: <hash_anterior>
Create Date: YYYY-MM-DD HH:MM:SS

¿Qué? Migración que...
¿Para qué? ...
¿Impacto? Sin esta migración...
"""

from alembic import op
import sqlalchemy as sa

revision = "<hash>"
down_revision = "<hash_anterior>"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ¿Qué? ...
    op.add_column("tabla", sa.Column(...))


def downgrade() -> None:
    # ¿Qué? Revierte el cambio del upgrade.
    op.drop_column("tabla", "columna")
```

**CRÍTICO**: `downgrade()` siempre debe deshacer exactamente lo que hace `upgrade()`.

### 3. Actualizar el schema Pydantic si corresponde (`be/app/schemas/`)

Si la columna nueva debe aparecer en requests o responses, actualizar los schemas
afectados en [be/app/schemas/user.py](../../../be/app/schemas/user.py) u otro archivo de schemas.

## Cómo aplicar la migración (comandos de referencia)

```bash
cd be
source .venv/bin/activate

# Aplicar la migración
alembic upgrade head

# Verificar estado actual
alembic current

# Si algo falla, revertir
alembic downgrade -1
```

## Tipos de datos comunes en este proyecto

| Python / SQLAlchemy       | PostgreSQL     | Uso                         |
| ------------------------- | -------------- | --------------------------- |
| `String(255)`             | `VARCHAR(255)` | Texto corto (email, nombre) |
| `Text`                    | `TEXT`         | Texto largo                 |
| `Boolean`                 | `BOOLEAN`      | Flags activo/inactivo       |
| `DateTime(timezone=True)` | `TIMESTAMPTZ`  | Fechas con timezone         |
| `UUID(as_uuid=True)`      | `UUID`         | Primary keys                |

## Descripción del cambio de esquema a implementar

$input
