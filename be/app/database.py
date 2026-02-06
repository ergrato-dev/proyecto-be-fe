"""
Módulo: database.py
Descripción: Configuración de la conexión a PostgreSQL con SQLAlchemy 2.0.
¿Para qué? Proveer el engine (motor de conexión), la sesión (SessionLocal) y la
           clase base (Base) que todos los modelos ORM heredan.
¿Impacto? Este módulo es el puente entre Python y PostgreSQL. Sin él, ningún modelo
          puede crear tablas ni hacer consultas a la base de datos.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

# ¿Qué? Motor de conexión SQLAlchemy que gestiona el pool de conexiones a PostgreSQL.
# ¿Para qué? Crear y reutilizar conexiones a la BD de forma eficiente, evitando abrir
#            una conexión nueva por cada consulta (lo cual sería muy lento).
# ¿Impacto? El pool_pre_ping=True verifica que la conexión siga viva antes de usarla,
#           evitando errores por conexiones cerradas tras inactividad prolongada.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=False,  # Cambiar a True para ver las queries SQL en la consola (útil para depuración)
)

# ¿Qué? Fábrica de sesiones — cada llamada a SessionLocal() crea una nueva sesión de BD.
# ¿Para qué? Una sesión es el "contexto de trabajo" con la BD: permite hacer queries,
#            inserts, updates, y controlar transacciones (commit/rollback).
# ¿Impacto? autocommit=False: los cambios NO se guardan automáticamente — se debe hacer
#           session.commit() explícitamente. Esto da control total sobre las transacciones.
#           autoflush=False: evita que SQLAlchemy envíe cambios parciales a la BD antes
#           de que estemos listos (previene estados inconsistentes).
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


class Base(DeclarativeBase):
    """Clase base para todos los modelos ORM del proyecto.

    ¿Qué? Clase abstracta de la que heredan todos los modelos (User, PasswordResetToken, etc.).
    ¿Para qué? SQLAlchemy usa esta clase para llevar el registro de todos los modelos definidos
               y poder crear/migrar sus tablas automáticamente.
    ¿Impacto? Cada modelo que herede de Base se convierte automáticamente en una tabla de la BD.
              Sin esta clase, SQLAlchemy no sabría qué tablas crear.
    """

    pass
