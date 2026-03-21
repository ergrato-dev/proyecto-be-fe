"""split full_name into first_name and last_name in users table

¿Qué? Migración que divide la columna full_name en dos columnas separadas:
      first_name (nombres) y last_name (apellidos).
¿Para qué? Permitir tratar nombres y apellidos de forma independiente,
           facilitando ordenamiento, búsqueda y personalización de mensajes.
¿Impacto? Los datos existentes en full_name se migran: la primera palabra va a
          first_name y el resto a last_name. La columna full_name se elimina.

Revision ID: d4e6f8a0b2c4
Revises: c3d5e7f9a1b2
Create Date: 2026-03-21 00:00:00.000000
"""

from collections.abc import Sequence
from typing import Union

import sqlalchemy as sa
from alembic import op

# ¿Qué? Identificadores de esta migración para que Alembic lleve el historial.
# ¿Para qué? Alembic encadena migraciones usando estos IDs — down_revision apunta
#            a la migración anterior (add_email_verification).
# ¿Impacto? Si se alteran estos valores, Alembic no podrá reconstruir el historial.
revision: str = "d4e6f8a0b2c4"
down_revision: Union[str, Sequence[str], None] = "c3d5e7f9a1b2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Aplica los cambios: agrega first_name y last_name, migra datos, elimina full_name.

    ¿Qué? Tres pasos: (1) agregar columnas nuevas como nullable, (2) migrar datos
          existentes de full_name, (3) hacer NOT NULL y eliminar full_name.
    ¿Para qué? Separar el nombre completo en partes para mayor flexibilidad.
    ¿Impacto? Los usuarios existentes conservan sus datos — no hay pérdida de información.
    """
    # ¿Qué? Paso 1 — agregar las columnas nuevas como nullable temporalmente.
    # ¿Para qué? No podemos hacer NOT NULL si la columna está vacía. Se llena primero.
    # ¿Impacto? Sin nullable=True aquí, la migración fallaría si hay filas existentes.
    op.add_column("users", sa.Column("first_name", sa.String(255), nullable=True))
    op.add_column("users", sa.Column("last_name", sa.String(255), nullable=True))

    # ¿Qué? Paso 2 — migrar datos: dividir full_name en first_name y last_name.
    # ¿Para qué? Preservar la información existente de los usuarios registrados.
    # ¿Impacto? La primera palabra de full_name → first_name; el resto → last_name.
    #           Si full_name es una sola palabra, last_name queda como string vacío.
    op.execute("""
        UPDATE users
        SET
            first_name = split_part(full_name, ' ', 1),
            last_name  = TRIM(SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1))
    """)

    # ¿Qué? Paso 3 — hacer las columnas NOT NULL ahora que tienen datos.
    # ¿Para qué? Garantizar integridad — ningún usuario puede quedar sin nombre o apellido.
    # ¿Impacto? A partir de aquí, INSERT sin first_name o last_name fallará en la BD.
    op.alter_column("users", "first_name", nullable=False)
    op.alter_column("users", "last_name", nullable=False)

    # ¿Qué? Paso 4 — eliminar la columna full_name ya obsoleta.
    # ¿Para qué? Limpiar el esquema — los datos ya están en las nuevas columnas.
    # ¿Impacto? IRREVERSIBLE sin el método downgrade(). Asegurarse de que los datos
    #           se migraron correctamente antes de ejecutar esta migración en producción.
    op.drop_column("users", "full_name")


def downgrade() -> None:
    """Revierte los cambios: restaura full_name, elimina first_name y last_name.

    ¿Qué? Reconstruye full_name concatenando first_name + ' ' + last_name.
    ¿Para qué? Permitir revertir la migración si es necesario.
    ¿Impacto? La información no se pierde gracias a la concatenación, aunque
              la separación exacta de nombres compuestos puede diferir levemente.
    """
    # ¿Qué? Paso 1 — restaurar la columna full_name como nullable temporalmente.
    op.add_column("users", sa.Column("full_name", sa.String(255), nullable=True))

    # ¿Qué? Paso 2 — reconstruir full_name concatenando los campos separados.
    op.execute("""
        UPDATE users
        SET full_name = TRIM(first_name || ' ' || last_name)
    """)

    # ¿Qué? Paso 3 — hacer NOT NULL y eliminar las columnas nuevas.
    op.alter_column("users", "full_name", nullable=False)
    op.drop_column("users", "last_name")
    op.drop_column("users", "first_name")
