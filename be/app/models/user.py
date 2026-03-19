"""
Módulo: models/user.py
Descripción: Modelo ORM que representa la tabla `users` en PostgreSQL.
¿Para qué? Definir la estructura de la tabla de usuarios — columnas, tipos, restricciones
           e índices — usando Python en lugar de SQL directo.
¿Impacto? Este modelo es el corazón del sistema de autenticación. Cada registro en esta tabla
          representa un usuario del sistema. Sin este modelo, no hay usuarios.
"""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


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

    # ¿Qué? Nombre completo del usuario.
    # ¿Para qué? Mostrar el nombre en el perfil y en la interfaz del frontend.
    # ¿Impacto? Campo requerido para personalizar la experiencia del usuario.
    full_name: Mapped[str] = mapped_column(
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

    def __repr__(self) -> str:
        """Representación legible del usuario para debugging.

        ¿Qué? Retorna una cadena descriptiva al imprimir el objeto User.
        ¿Para qué? Facilitar el debugging — en lugar de ver <User object at 0x...>,
                   se ve User(id=..., email=...).
        ¿Impacto? NUNCA incluir hashed_password en __repr__ por seguridad.
        """
        return f"User(id={self.id}, email={self.email}, is_active={self.is_active})"
