"""
Módulo: tests/conftest.py
Descripción: Fixtures compartidos para todos los tests del backend.
¿Para qué? Configurar una base de datos de testing aislada, un cliente HTTP de pruebas
           y datos de prueba reutilizables que se comparten entre todos los archivos de test.
¿Impacto? Sin estos fixtures, cada test tendría que configurar su propia BD y cliente,
          causando código repetido, tests lentos y riesgo de contaminar datos entre tests.
          La BD de testing se crea y destruye en cada sesión de pytest, garantizando
          que los tests NUNCA afecten la BD de desarrollo/producción.
"""

import uuid
from collections.abc import Generator
from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings
from app.database import Base
from app.dependencies import get_db
from app.main import app
from app.models.password_reset_token import PasswordResetToken
from app.models.user import User
from app.utils.security import create_access_token, hash_password

# ────────────────────────────
# 🗄️ Configuración de BD de testing
# ────────────────────────────

# ¿Qué? URL de la BD de testing — usa la misma BD pero con un esquema limpio.
# ¿Para qué? Aislar los tests de los datos de desarrollo.
# ¿Impacto? Se usa la misma BD de desarrollo (nn_auth_db) pero las tablas se
#           crean y destruyen en cada sesión de tests. En un proyecto más grande,
#           se usaría una BD separada (nn_auth_test_db).
TEST_DATABASE_URL = settings.DATABASE_URL

# ¿Qué? Engine de SQLAlchemy exclusivo para tests.
# ¿Para qué? Crear conexiones independientes a la BD de testing.
# ¿Impacto? Separar el engine de testing del de la app evita interferencias.
test_engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)

# ¿Qué? Fábrica de sesiones para tests.
# ¿Para qué? Cada test obtiene una sesión de BD limpia y aislada.
# ¿Impacto? autocommit=False y autoflush=False dan control total sobre las transacciones.
TestSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
)


# ────────────────────────────
# 📦 Fixtures de base de datos
# ────────────────────────────


@pytest.fixture(scope="session", autouse=True)
def setup_database() -> Generator[None, None, None]:
    """Crea y destruye las tablas de la BD al inicio y fin de la sesión de tests.

    ¿Qué? Fixture que se ejecuta UNA vez por sesión de pytest.
    ¿Para qué? Crear todas las tablas antes de que corran los tests y limpiarlas al terminar.
    ¿Impacto? scope="session" significa que las tablas se crean una sola vez (eficiente),
              no por cada test individual.
    """
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture()
def db() -> Generator[Session, None, None]:
    """Provee una sesión de BD aislada para cada test con rollback automático.

    ¿Qué? Fixture que crea una sesión de BD con transacción que se revierte al final del test.
    ¿Para qué? Cada test comienza con una BD "limpia" — los datos creados en un test
              NO afectan a otros tests (isolation).
    ¿Impacto? Sin rollback, los datos de un test contaminarían al siguiente,
              causando resultados inconsistentes y tests que fallan aleatoriamente.
    """
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestSessionLocal(bind=connection)

    # ¿Qué? Configurar el savepoint para nested transactions.
    # ¿Para qué? Si el código de la app hace commit, el savepoint permite
    #            revertir igualmente al final del test.
    # ¿Impacto? Sin esto, un db.commit() en el service haría permanentes los datos
    #           y romperían el aislamiento entre tests.
    nested = connection.begin_nested()

    @event.listens_for(session, "after_transaction_end")
    def end_savepoint(session: Session, transaction_state: object) -> None:
        """Recrea el savepoint después de cada commit dentro del test."""
        nonlocal nested
        if not nested.is_active:
            nested = connection.begin_nested()

    yield session

    session.close()
    transaction.rollback()
    connection.close()


# ────────────────────────────
# 🌐 Fixture del cliente HTTP
# ────────────────────────────


@pytest.fixture()
def client(db: Session) -> Generator[TestClient, None, None]:
    """Provee un cliente HTTP de testing que usa la sesión de BD aislada.

    ¿Qué? TestClient de FastAPI que envía peticiones HTTP sin necesidad de un servidor real.
    ¿Para qué? Simular peticiones HTTP (POST, GET, etc.) en los tests sin levantar uvicorn.
    ¿Impacto? La clave es el dependency_overrides: reemplaza get_db de la app
              por una función que retorna la sesión de testing. Así, los endpoints
              usan la BD de testing con rollback automático.
    """

    def override_get_db() -> Generator[Session, None, None]:
        """Reemplaza la dependencia get_db para usar la sesión de testing."""
        yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


# ────────────────────────────
# 👤 Fixtures de datos de prueba
# ────────────────────────────

# ¿Qué? Datos constantes para crear usuarios de prueba.
# ¿Para qué? Reutilizar los mismos datos en múltiples tests sin duplicación.
# ¿Impacto? Centralizar datos de prueba facilita cambiarlos si los requisitos cambian.
TEST_USER_EMAIL = "test@nn-company.com"
TEST_USER_FULL_NAME = "Test User"
TEST_USER_PASSWORD = "TestPass123"


@pytest.fixture()
def test_user(db: Session) -> User:
    """Crea un usuario de prueba en la BD y lo retorna.

    ¿Qué? Fixture que inserta un usuario con datos conocidos en la BD de testing.
    ¿Para qué? Muchos tests necesitan un usuario existente (login, change password, etc.).
              Este fixture evita repetir la lógica de creación en cada test.
    ¿Impacto? El usuario se crea con contraseña hasheada (como lo haría la app real).
              Se revierte automáticamente al final del test gracias al fixture `db`.
    """
    user = User(
        email=TEST_USER_EMAIL,
        full_name=TEST_USER_FULL_NAME,
        hashed_password=hash_password(TEST_USER_PASSWORD),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture()
def auth_headers(test_user: User) -> dict[str, str]:
    """Genera headers de autenticación con un access token válido.

    ¿Qué? Fixture que crea un token JWT para el usuario de prueba y lo formatea como header.
    ¿Para qué? Reutilizar en cualquier test que necesite autenticación.
    ¿Impacto? Sin esto, cada test protegido tendría que generar su propio token manualmente.
    """
    access_token = create_access_token(data={"sub": test_user.email})
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture()
def expired_reset_token(db: Session, test_user: User) -> str:
    """Crea un token de reset de contraseña ya expirado.

    ¿Qué? Fixture que inserta un token de reset con fecha de expiración en el pasado.
    ¿Para qué? Probar que el endpoint reset-password rechaza tokens expirados.
    ¿Impacto? Verifica una validación de seguridad crítica del sistema.
    """
    token = str(uuid.uuid4())
    token_record = PasswordResetToken(
        user_id=test_user.id,
        token=token,
        expires_at=datetime.now(timezone.utc) - timedelta(hours=1),
    )
    db.add(token_record)
    db.commit()
    return token


@pytest.fixture()
def used_reset_token(db: Session, test_user: User) -> str:
    """Crea un token de reset de contraseña ya utilizado.

    ¿Qué? Fixture que inserta un token de reset marcado como usado (used=True).
    ¿Para qué? Probar que el endpoint reset-password rechaza tokens ya utilizados.
    ¿Impacto? Verifica que un token no pueda reutilizarse para cambiar la contraseña múltiples veces.
    """
    token = str(uuid.uuid4())
    token_record = PasswordResetToken(
        user_id=test_user.id,
        token=token,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        used=True,
    )
    db.add(token_record)
    db.commit()
    return token


@pytest.fixture()
def valid_reset_token(db: Session, test_user: User) -> str:
    """Crea un token de reset de contraseña válido (no expirado, no usado).

    ¿Qué? Fixture que inserta un token de reset listo para ser consumido.
    ¿Para qué? Probar el flujo exitoso de reset-password.
    ¿Impacto? Simula el token que el usuario recibiría por email tras forgot-password.
    """
    token = str(uuid.uuid4())
    token_record = PasswordResetToken(
        user_id=test_user.id,
        token=token,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
    )
    db.add(token_record)
    db.commit()
    return token
