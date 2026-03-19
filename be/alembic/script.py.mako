"""${message}

¿Qué? [Describir brevemente qué estructuras crea o modifica esta migración.]
¿Para qué? [Explicar por qué este cambio en el esquema es necesario.]
¿Impacto? [Indicar si la operación es destructiva, reversible o tiene efectos en datos existentes.]

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
${imports if imports else ""}

# ¿Qué? Identificadores que Alembic usa para construir el grafo de migraciones.
# ¿Para qué? down_revision apunta a la migración anterior; None indica que es la raíz.
# ¿Impacto? Alterar estos valores rompe el historial y puede causar errores al migrar.
revision: str = ${repr(up_revision)}
down_revision: Union[str, Sequence[str], None] = ${repr(down_revision)}
branch_labels: Union[str, Sequence[str], None] = ${repr(branch_labels)}
depends_on: Union[str, Sequence[str], None] = ${repr(depends_on)}


def upgrade() -> None:
    """Aplica los cambios al esquema de la base de datos.

    ¿Qué? [Describir qué tablas/columnas/índices se crean o modifican.]
    ¿Para qué? [Explicar el motivo del cambio.]
    ¿Impacto? [Indicar si afecta datos existentes o si es seguro en producción.]
    """
    ${upgrades if upgrades else "pass"}


def downgrade() -> None:
    """Revierte los cambios aplicados por upgrade().

    ¿Qué? [Describir qué se elimina o restaura.]
    ¿Para qué? [Permitir deshacer esta migración si algo falla.]
    ¿Impacto? ¡VERIFICAR si la operación es DESTRUCTIVA antes de ejecutar en producción!
              El orden de las operaciones es inverso al de upgrade().
    """
    ${downgrades if downgrades else "pass"}
