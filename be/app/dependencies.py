"""
Módulo: dependencies.py
Descripción: Dependencias inyectables de FastAPI — funciones reutilizables que se
             inyectan en los endpoints usando Depends().
¿Para qué? Centralizar lógica que se repite en muchos endpoints (obtener sesión de BD,
           obtener usuario autenticado, etc.) para evitar duplicación.
¿Impacto? Sin este módulo, cada endpoint tendría que crear su propia sesión de BD
          y validar el token JWT manualmente, causando código repetido y propenso a errores.
"""

from collections.abc import Generator

from sqlalchemy.orm import Session

from app.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """Provee una sesión de base de datos para cada request.

    ¿Qué? Generador que crea una sesión de BD, la entrega al endpoint, y la cierra al terminar.
    ¿Para qué? Garantizar que cada request tenga su propia sesión aislada y que siempre
              se cierre correctamente, incluso si ocurre un error.
    ¿Impacto? El patrón try/finally asegura que la conexión se devuelve al pool SIEMPRE.
              Sin esto, las conexiones se agotarían y la app dejaría de responder.

    Yields:
        Session: Sesión de SQLAlchemy lista para hacer queries.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
