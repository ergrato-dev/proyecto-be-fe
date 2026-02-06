"""
Módulo: models/__init__.py
Descripción: Paquete de modelos ORM — exporta todos los modelos para facilitar imports.
¿Para qué? Permitir importar todos los modelos desde un solo lugar (from app.models import User)
           y asegurar que Alembic los detecte al generar migraciones.
¿Impacto? Sin este archivo, Alembic no detectaría los modelos automáticamente y las migraciones
          generadas estarían vacías (uno de los errores más comunes al configurar Alembic).
"""

# ¿Qué? Importaciones explícitas de todos los modelos ORM del proyecto.
# ¿Para qué? Al importar este paquete, Python ejecuta estos imports y SQLAlchemy
#            registra los modelos en Base.metadata (el registro central de tablas).
# ¿Impacto? Si se agrega un nuevo modelo y NO se importa aquí, Alembic no lo verá
#           y no generará la migración correspondiente.
from app.models.user import User
from app.models.password_reset_token import PasswordResetToken

__all__ = ["User", "PasswordResetToken"]
