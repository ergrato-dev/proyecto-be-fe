"""
Módulo: models/user.py
Descripción: Modelo ORM que representa la tabla `users` en PostgreSQL.
¿Para qué? Definir la estructura de la tabla de usuarios — columnas, tipos, restricciones
           e índices — usando Python en lugar de SQL directo.
¿Impacto? Este modelo es el corazón del sistema de autenticación. Cada registro en esta tabla
          representa un usuario del sistema. Sin este modelo, no hay usuarios.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

# ¿Qué? Imports condicionales que solo se ejecutan durante el análisis estático (mypy/pyright).
# ¿Para qué? Romper la importación circular entre User ↔ PasswordResetToken ↔
#            EmailVerificationToken sin afectar el runtime.
# ¿Impacto? Sin TYPE_CHECKING los imports circulares causarían ImportError al arrancar.
if TYPE_CHECKING:
    from app.models.email_verification_token import EmailVerificationToken
    from app.models.password_reset_token import PasswordResetToken


class User(Base):
    """Modelo ORM para la tabla `users`.

    ¿Qué? Clase Python que mapea a la tabla `users` en PostgreSQL.
    ¿Para qué? Cada instancia de User representa una fila en la tabla.
              SQLAlchemy traduce operaciones Python (crear User, query, update)
              a sentencias SQL automáticamente.
    ¿Impacto? Almacena las credenciales y datos de perfil de cada usuario.
              La contraseña se guarda como hash bcrypt (columna hashed_password),
              NUNCA en texto plano.
    """

    # ¿Qué? Nombre de la tabla en PostgreSQL.
    # ¿Para qué? SQLAlchemy usa esto para crear/referenciar la tabla.
    # ¿Impacto? Convención: plural, snake_case (users, no User ni usuario).
    __tablename__ = "users"

    # ────────────────────────────
    # 📌 Columnas
    # ────────────────────────────

    # ¿Qué? Identificador único universal del usuario.
    # ¿Para qué? Identificar cada usuario de forma única e inmutable.
    # ¿Impacto? UUID es mejor que autoincremental para seguridad — no revela
    #           cuántos usuarios hay ni permite adivinar IDs secuenciales.
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # ¿Qué? Dirección de email del usuario.
    # ¿Para qué? Sirve como identificador de login (credencial) y para enviar
    #            emails de recuperación de contraseña.
    # ¿Impacto? UNIQUE evita cuentas duplicadas. INDEX acelera las búsquedas
    #           por email (operación muy frecuente en login).
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    # ¿Qué? Nombres del usuario (primer nombre, nombres de pila).
    # ¿Para qué? Mostrar y tratar los nombres de forma independiente a los apellidos.
    # ¿Impacto? Campo requerido — separa los nombres del usuario para mayor flexibilidad en UI.
    first_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # ¿Qué? Apellidos del usuario.
    # ¿Para qué? Tratar apellidos de forma independiente — útil para ordenamiento y saludos formales.
    # ¿Impacto? Campo requerido junto con first_name para identificar completamente al usuario.
    last_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # ¿Qué? Hash bcrypt de la contraseña del usuario.
    # ¿Para qué? Almacenar la contraseña de forma segura — el hash es irreversible,
    #            por lo que incluso si la BD es comprometida, las contraseñas no se exponen.
    # ¿Impacto? NUNCA almacenar la contraseña en texto plano aquí.
    #           El hash bcrypt tiene ~60 caracteres, pero usamos 255 por seguridad futura.
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # ¿Qué? Indicador de si la cuenta del usuario está activa.
    # ¿Para qué? Permitir desactivar cuentas sin borrar datos (soft delete).
    #            Un usuario inactivo no puede hacer login ni acceder a la API.
    # ¿Impacto? Default True = los usuarios están activos al registrarse.
    #           Un admin podría desactivar cuentas sospechosas sin perder datos.
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # ¿Qué? Indicador de si el usuario verificó su dirección de email.
    # ¿Para qué? Confirmar que el email ingresado en el registro pertenece realmente al usuario.
    #            Sin verificación, cualquiera podría registrarse con el email de otra persona.
    # ¿Impacto? Default False = al registrarse, el usuario NO puede iniciar sesión hasta
    #           hacer clic en el enlace de verificación enviado a su email.
    is_email_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # ¿Qué? Fecha y hora de creación del registro.
    # ¿Para qué? Trazabilidad — saber cuándo se registró cada usuario.
    # ¿Impacto? server_default=func.now() hace que PostgreSQL genere la fecha,
    #           no Python, garantizando consistencia incluso si los relojes difieren.
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # ¿Qué? Fecha y hora de la última actualización del registro.
    # ¿Para qué? Saber cuándo se modificó por última vez (ej: cambio de contraseña).
    # ¿Impacto? server_default + onupdate: se establece al crear y se actualiza
    #           automáticamente en cada UPDATE de SQLAlchemy.
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # ────────────────────────────
    # 🔗 Relaciones (1:N — Un User tiene muchos tokens)
    # ────────────────────────────

    # ¿Qué? Lista de todos los tokens de reset de contraseña que pertenecen a este usuario.
    # ¿Para qué? Navegar desde un User a sus tokens directamente: user.password_reset_tokens
    #            SQLAlchemy ejecuta el JOIN por nosotros, sin SQL manual.
    # ¿Impacto? back_populates="user" le dice a SQLAlchemy que el atributo opuesto en
    #            PasswordResetToken se llama "user" — ambos lados deben declararse.
    #            Relación 1:N → 1 usuario puede tener MUCHOS tokens de reset.
    password_reset_tokens: Mapped[list[PasswordResetToken]] = relationship(
        "PasswordResetToken",
        back_populates="user",
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    # ¿Qué? Lista de todos los tokens de verificación de email de este usuario.
    # ¿Para qué? Navegar desde un User a sus tokens de verificación: user.email_verification_tokens
    # ¿Impacto? cascade="all, delete-orphan" garantiza que si se elimina el usuario,
    #            SQLAlchemy borra los tokens huérfanos automáticamente (sin depender solo del
    #            ondelete=CASCADE de la FK a nivel de BD).
    #            Relación 1:N → 1 usuario puede tener MUCHOS tokens de verificación.
    email_verification_tokens: Mapped[list[EmailVerificationToken]] = relationship(
        "EmailVerificationToken",
        back_populates="user",
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        """Representación legible del usuario para debugging.

        ¿Qué? Retorna una cadena descriptiva al imprimir el objeto User.
        ¿Para qué? Facilitar el debugging — en lugar de ver <User object at 0x...>,
                   se ve User(id=..., email=...).
        ¿Impacto? NUNCA incluir hashed_password en __repr__ por seguridad.
        """
        return f"User(id={self.id}, email={self.email}, is_active={self.is_active})"
