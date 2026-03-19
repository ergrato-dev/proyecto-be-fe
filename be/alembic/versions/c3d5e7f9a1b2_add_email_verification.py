"""add email verification: is_email_verified column and email_verification_tokens table

¿Qué? Migración que implementa la verificación de email en el registro de usuarios.
¿Para qué? Agregar el campo is_email_verified a users y crear la tabla
           email_verification_tokens para almacenar los tokens de activación.
¿Impacto? Después de esta migración, los usuarios recién registrados tendrán
          is_email_verified=False y no podrán iniciar sesión hasta verificar su email.

Revision ID: c3d5e7f9a1b2
Revises: a7c03fd8169f
Create Date: 2026-03-19 00:00:00.000000
"""

from collections.abc import Sequence
from typing import Union

import sqlalchemy as sa
from alembic import op

# ¿Qué? Identificadores de esta migración para que Alembic lleve el historial.
# ¿Para qué? Alembic encadena migraciones usando estos IDs — down_revision apunta
#            a la migración anterior.
# ¿Impacto? Si se alteran estos valores, Alembic no podrá reconstruir el historial.
revision: str = "c3d5e7f9a1b2"
down_revision: Union[str, Sequence[str], None] = "a7c03fd8169f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Aplica los cambios de verificación de email a la base de datos.

    ¿Qué? Agrega is_email_verified a users y crea email_verification_tokens.
    ¿Para qué? Habilitar el flujo completo de verificación al registrar una cuenta.
    ¿Impacto? Los usuarios existentes quedan con is_email_verified=False (server_default).
              En un sistema en producción, se podría marcar a los existentes como verified
              para no interrumpir el acceso de cuentas ya creadas.
    """
    # ¿Qué? Agrega la columna is_email_verified a la tabla users.
    # ¿Para qué? Registrar si el usuario ha confirmado su dirección de email.
    # ¿Impacto? server_default='false' asegura que los registros existentes queden
    #           sin verificar (no se puede poner nullable=False sin un default para filas previas).
    op.add_column(
        "users",
        sa.Column(
            "is_email_verified",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )

    # ¿Qué? Crea la tabla que almacena los tokens de verificación de email.
    # ¿Para qué? Asociar un token único (enviado por email) con un usuario para activar su cuenta.
    # ¿Impacto? Sin esta tabla, la API no puede validar si el enlace de verificación es legítimo.
    op.create_table(
        "email_verification_tokens",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("token", sa.String(length=255), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "used",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_email_verification_tokens_token"),
        "email_verification_tokens",
        ["token"],
        unique=True,
    )


def downgrade() -> None:
    """Revierte los cambios de verificación de email.

    ¿Qué? Elimina la tabla email_verification_tokens y la columna is_email_verified.
    ¿Para qué? Permitir volver a la versión anterior si esta migración causa problemas.
    ¿Impacto? ¡DESTRUCTIVO! Se pierden todos los tokens de verificación pendientes.
    """
    op.drop_index(
        op.f("ix_email_verification_tokens_token"),
        table_name="email_verification_tokens",
    )
    op.drop_table("email_verification_tokens")
    op.drop_column("users", "is_email_verified")
