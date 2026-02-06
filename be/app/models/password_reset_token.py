"""
Módulo: models/password_reset_token.py
Descripción: Modelo ORM que representa la tabla `password_reset_tokens` en PostgreSQL.
¿Para qué? Almacenar tokens temporales de un solo uso que permiten restablecer
           la contraseña de un usuario que olvidó sus credenciales.
¿Impacto? Sin esta tabla, el flujo de "forgot password" no puede funcionar,
          ya que no habría forma de verificar que el enlace de reset es legítimo y vigente.
"""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PasswordResetToken(Base):
    """Modelo ORM para la tabla `password_reset_tokens`.

    ¿Qué? Clase Python que mapea a la tabla de tokens de recuperación de contraseña.
    ¿Para qué? Cada vez que un usuario solicita recuperar su contraseña, se crea un
              registro aquí con un token único y una fecha de expiración.
    ¿Impacto? El token se envía por email como parte de un enlace. Cuando el usuario
              hace clic y envía su nueva contraseña, se verifica contra esta tabla
              que el token sea válido, no haya expirado y no haya sido usado.
    """

    __tablename__ = "password_reset_tokens"

    # ────────────────────────────
    # 📌 Columnas
    # ────────────────────────────

    # ¿Qué? Identificador único del registro de token.
    # ¿Para qué? Clave primaria de la tabla.
    # ¿Impacto? UUID evita colisiones y no revela información secuencial.
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # ¿Qué? Referencia al usuario que solicitó el reset de contraseña.
    # ¿Para qué? Vincular el token con el usuario cuya contraseña se va a cambiar.
    # ¿Impacto? ForeignKey garantiza integridad referencial — no se puede crear un token
    #           para un usuario que no existe. ondelete="CASCADE" borra los tokens
    #           automáticamente si se elimina el usuario.
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    # ¿Qué? Token único que se envía en el email de recuperación.
    # ¿Para qué? Actuar como "contraseña temporal" de un solo uso para verificar
    #            que quien solicita el cambio tiene acceso al email del usuario.
    # ¿Impacto? UNIQUE + INDEX: cada token es irrepetible y las búsquedas son rápidas.
    #           Se genera como UUID aleatorio — prácticamente imposible de adivinar.
    token: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    # ¿Qué? Fecha y hora en que el token deja de ser válido.
    # ¿Para qué? Limitar la ventana de tiempo en que el token puede usarse (1 hora).
    # ¿Impacto? Sin expiración, un token comprometido podría usarse indefinidamente,
    #           lo cual es un riesgo de seguridad grave.
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    # ¿Qué? Flag que indica si el token ya fue utilizado.
    # ¿Para qué? Evitar que un mismo token se use más de una vez.
    # ¿Impacto? Sin este campo, un atacante que intercepte el enlace podría cambiar
    #           la contraseña múltiples veces. Con used=True, el token se invalida
    #           después del primer uso.
    used: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # ¿Qué? Fecha y hora de creación del token.
    # ¿Para qué? Auditoría — saber cuándo se solicitó la recuperación.
    # ¿Impacto? Útil para detectar patrones sospechosos (ej: muchos resets en poco tiempo).
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # ────────────────────────────
    # 🔗 Relaciones
    # ────────────────────────────

    # ¿Qué? Relación ORM que vincula el token con su usuario propietario.
    # ¿Para qué? Acceder al objeto User directamente desde el token sin hacer
    #            una query manual (ej: token.user.email en lugar de query por user_id).
    # ¿Impacto? lazy="selectin" carga el usuario automáticamente al consultar el token,
    #           evitando el problema de N+1 queries.
    user = relationship("User", lazy="selectin")

    def __repr__(self) -> str:
        """Representación legible del token para debugging.

        ¿Qué? Cadena descriptiva del token — NUNCA mostrar el token completo por seguridad.
        ¿Para qué? Debugging seguro sin exponer información sensible.
        ¿Impacto? Mostrar solo los primeros 8 caracteres del token es suficiente para identificación.
        """
        token_preview = self.token[:8] if self.token else "N/A"
        return (
            f"PasswordResetToken(id={self.id}, user_id={self.user_id}, "
            f"token={token_preview}..., used={self.used})"
        )
