"""add locale to users table

¿Qué? Migración que agrega la columna `locale` a la tabla `users`.
¿Para qué? Almacenar la preferencia de idioma de cada usuario (Fase 9 — i18n).
           El locale indica en qué idioma se mostrará la interfaz al usuario
           cuando inicie sesión desde cualquier dispositivo.
¿Impacto? Todos los usuarios existentes quedan con `locale='es'` (español — valor por defecto).
          La columna es NOT NULL con DEFAULT 'es', por lo que no hay datos inconsistentes.

Revision ID: e5f7a9b1c3d5
Revises: d4e6f8a0b2c4
Create Date: 2026-04-02 00:00:00.000000
"""

from collections.abc import Sequence
from typing import Union

import sqlalchemy as sa
from alembic import op

# ¿Qué? Identificadores de esta migración para que Alembic lleve el historial.
# ¿Para qué? Alembic encadena migraciones usando estos IDs — down_revision apunta
#            a la migración anterior (split_full_name).
# ¿Impacto? Si se alteran estos valores, Alembic no podrá reconstruir el historial.
revision: str = "e5f7a9b1c3d5"
down_revision: Union[str, Sequence[str], None] = "d4e6f8a0b2c4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Agrega la columna locale a la tabla users.

    ¿Qué? Una sola operación: agregar columna `locale` con default 'es'.
    ¿Para qué? Soportar internacionalización — cada usuario tiene su idioma preferido.
    ¿Impacto? Todos los usuarios existentes quedan con locale='es'.
              server_default garantiza que nuevos usuarios sin locale explícito
              también tengan 'es' como valor inicial.
    """
    # ¿Qué? Agregar columna locale con valor por defecto 'es' para todos los registros.
    # ¿Para qué? NOT NULL + server_default="es" permite agregar la columna sin fallar
    #            aunque ya existan filas en la tabla (PostgreSQL rellena el valor automáticamente).
    # ¿Impacto? Sin server_default, PostgreSQL rechazaría la operación si hay filas existentes
    #            porque no sabría qué valor asignar a NOT NULL.
    op.add_column(
        "users",
        sa.Column(
            "locale",
            sa.String(10),
            nullable=False,
            server_default="es",
        ),
    )


def downgrade() -> None:
    """Revierte la migración: elimina la columna locale de users.

    ¿Qué? Elimina la columna `locale` si se necesita revertir la migración.
    ¿Para qué? Permitir rollback al estado anterior (sin columna locale).
    ¿Impacto? Se pierden todas las preferencias de idioma de los usuarios.
              Solo usar en desarrollo — en producción, una migración nunca debería revertirse.
    """
    # ¿Qué? Eliminar la columna locale de la tabla users.
    # ¿Para qué? Revertir al esquema de la migración anterior.
    # ¿Impacto? Pérdida de datos — las preferencias de locale de todos los usuarios desaparecen.
    op.drop_column("users", "locale")
