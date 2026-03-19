"""create users and password_reset_tokens tables

¿Qué? Migración inicial que crea la estructura base del sistema de autenticación.
¿Para qué? Establecer las tablas fundamentales: users (cuentas de usuario) y
           password_reset_tokens (tokens para recuperación de contraseña).
¿Impacto? Esta es la migración raíz — todas las demás dependen de ella.
          Sin estas tablas, el sistema no puede registrar ni autenticar usuarios.

Revision ID: a7c03fd8169f
Revises:
Create Date: 2026-02-06 07:19:21.541215

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# ¿Qué? Identificadores que Alembic usa para construir el grafo de migraciones.
# ¿Para qué? down_revision=None indica que esta es la primera migración (raíz).
# ¿Impacto? Alterar estos valores rompe el historial y hace que alembic upgrade
#           o downgrade fallen con errores de "can't locate revision".
revision: str = "a7c03fd8169f"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Crea las tablas users y password_reset_tokens en la base de datos.

    ¿Qué? Genera las dos tablas iniciales del sistema de autenticación.
    ¿Para qué? Sin estas tablas, ningún endpoint de auth puede funcionar.
    ¿Impacto? Es seguro ejecutar por primera vez en una BD vacía. En una BD
              existente fallará si las tablas ya existen.
    """
    # ¿Qué? Tabla principal de usuarios del sistema.
    # ¿Para qué? Almacenar credenciales (hasheadas), nombre y estado de cada cuenta.
    # ¿Impacto? Es la tabla central — todas las demás tablas referencian 'users' vía FK.
    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        # ¿Qué? Bandera para deshabilitar cuentas sin eliminarlas.
        # ¿Para qué? Permite suspender usuarios sin perder su historial.
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ¿Qué? Índice UNIQUE en email para búsquedas rápidas y unicidad garantizada.
    # ¿Para qué? El login busca usuarios por email — sin índice, cada login haría
    #            un full table scan. unique=True también previene emails duplicados.
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    # ¿Qué? Tabla para almacenar tokens temporales de recuperación de contraseña.
    # ¿Para qué? Cuando el usuario solicita "olvidé mi contraseña", se genera un
    #            token UUID aquí. El enlace en el email lo referencia para validarlo.
    # ¿Impacto? Separar los tokens en su propia tabla evita contaminar la tabla users
    #           y permite tener múltiples tokens pendientes por usuario.
    op.create_table(
        "password_reset_tokens",
        sa.Column("id", sa.UUID(), nullable=False),
        # ¿Qué? Referencia al usuario dueño del token.
        # ¿Para qué? Saber qué contraseña actualizar cuando se valide el token.
        # ¿Impacto? ondelete=CASCADE elimina los tokens si se borra el usuario.
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("token", sa.String(length=255), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        # ¿Qué? Marca si el token ya fue consumido.
        # ¿Para qué? Prevenir que el mismo enlace se use dos veces.
        sa.Column("used", sa.Boolean(), nullable=False),
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
        op.f("ix_password_reset_tokens_token"),
        "password_reset_tokens",
        ["token"],
        unique=True,
    )


def downgrade() -> None:
    """Elimina las tablas users y password_reset_tokens.

    ¿Qué? Revierte esta migración dejando la BD como estaba antes.
    ¿Para qué? Permitir deshacer la migración si algo sale mal.
    ¿Impacto? ¡DESTRUCTIVO! Se pierden TODOS los datos de usuarios y tokens.
              Nunca ejecutar en producción sin backup previo.
              Orden importa: hay que borrar password_reset_tokens ANTES que users
              porque password_reset_tokens tiene una FK que apunta a users.
    """
    op.drop_index(op.f("ix_password_reset_tokens_token"), table_name="password_reset_tokens")
    op.drop_table("password_reset_tokens")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
