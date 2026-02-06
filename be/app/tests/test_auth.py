"""
Módulo: tests/test_auth.py
Descripción: Tests de integración para todos los endpoints de autenticación y usuario.
¿Para qué? Verificar que cada endpoint funciona correctamente con datos válidos
           y que maneja errores apropiadamente con datos inválidos.
¿Impacto? Sin tests, los bugs se descubren en producción — con tests, se descubren
          antes de hacer deploy. Cada test simula un escenario real de uso de la API.
"""

from fastapi.testclient import TestClient

from app.tests.conftest import (
    TEST_USER_EMAIL,
    TEST_USER_FULL_NAME,
    TEST_USER_PASSWORD,
)


# ════════════════════════════════════════════════════════════
# 📝 TESTS DE REGISTRO — POST /api/v1/auth/register
# ════════════════════════════════════════════════════════════


class TestRegister:
    """Tests para el endpoint de registro de usuarios.

    ¿Qué? Verifica el flujo de creación de cuentas.
    ¿Para qué? Asegurar que el registro funciona con datos válidos y rechaza datos inválidos.
    ¿Impacto? Si el registro falla, nadie puede crear cuentas en el sistema.
    """

    URL = "/api/v1/auth/register"

    def test_register_success(self, client: TestClient) -> None:
        """Registro exitoso con datos válidos → 201 + datos del usuario sin password.

        ¿Qué? Envía datos válidos y verifica que el usuario se crea correctamente.
        ¿Para qué? Confirmar el flujo principal (happy path) del registro.
        ¿Impacto? Si este test falla, el registro básico está roto.
        """
        response = client.post(
            self.URL,
            json={
                "email": "new@nn-company.com",
                "full_name": "New User",
                "password": "NewPass123",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "new@nn-company.com"
        assert data["full_name"] == "New User"
        assert data["is_active"] is True
        # ¿Qué? Verificar que la contraseña NUNCA se retorna en la respuesta.
        # ¿Para qué? Seguridad — el hash no debe exponerse al cliente.
        # ¿Impacto? Si "hashed_password" aparece en la respuesta, hay una fuga de datos.
        assert "hashed_password" not in data
        assert "password" not in data
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data

    def test_register_duplicate_email(
        self, client: TestClient, test_user: object
    ) -> None:
        """Registro con email duplicado → 400.

        ¿Qué? Intenta registrar un usuario con un email que ya existe.
        ¿Para qué? Verificar que el sistema rechaza emails duplicados.
        ¿Impacto? Sin esta validación, habría cuentas duplicadas en la BD.
        """
        response = client.post(
            self.URL,
            json={
                "email": TEST_USER_EMAIL,
                "full_name": "Duplicate User",
                "password": "TestPass123",
            },
        )

        assert response.status_code == 400
        assert "ya está registrado" in response.json()["detail"]

    def test_register_weak_password_too_short(self, client: TestClient) -> None:
        """Registro con contraseña muy corta → 422.

        ¿Qué? Envía una contraseña de menos de 8 caracteres.
        ¿Para qué? Verificar la validación de fortaleza mínima.
        ¿Impacto? Contraseñas cortas son fáciles de adivinar con fuerza bruta.
        """
        response = client.post(
            self.URL,
            json={
                "email": "weak@nn-company.com",
                "full_name": "Weak User",
                "password": "Ab1",
            },
        )

        assert response.status_code == 422

    def test_register_password_no_uppercase(self, client: TestClient) -> None:
        """Registro con contraseña sin mayúsculas → 422."""
        response = client.post(
            self.URL,
            json={
                "email": "weak@nn-company.com",
                "full_name": "Weak User",
                "password": "testpass123",
            },
        )

        assert response.status_code == 422

    def test_register_password_no_lowercase(self, client: TestClient) -> None:
        """Registro con contraseña sin minúsculas → 422."""
        response = client.post(
            self.URL,
            json={
                "email": "weak@nn-company.com",
                "full_name": "Weak User",
                "password": "TESTPASS123",
            },
        )

        assert response.status_code == 422

    def test_register_password_no_digit(self, client: TestClient) -> None:
        """Registro con contraseña sin números → 422."""
        response = client.post(
            self.URL,
            json={
                "email": "weak@nn-company.com",
                "full_name": "Weak User",
                "password": "TestPassword",
            },
        )

        assert response.status_code == 422

    def test_register_invalid_email(self, client: TestClient) -> None:
        """Registro con email inválido → 422.

        ¿Qué? Envía un email sin formato válido.
        ¿Para qué? Verificar que Pydantic EmailStr rechaza emails mal formados.
        ¿Impacto? Emails inválidos causarían problemas en el flujo de recuperación de contraseña.
        """
        response = client.post(
            self.URL,
            json={
                "email": "not-an-email",
                "full_name": "Bad Email",
                "password": "TestPass123",
            },
        )

        assert response.status_code == 422

    def test_register_empty_name(self, client: TestClient) -> None:
        """Registro con nombre vacío → 422."""
        response = client.post(
            self.URL,
            json={
                "email": "empty@nn-company.com",
                "full_name": " ",
                "password": "TestPass123",
            },
        )

        assert response.status_code == 422

    def test_register_missing_fields(self, client: TestClient) -> None:
        """Registro sin campos requeridos → 422.

        ¿Qué? Envía un JSON incompleto (sin password).
        ¿Para qué? Verificar que Pydantic exige todos los campos requeridos.
        ¿Impacto? Sin validación, el backend podría crashear con un KeyError.
        """
        response = client.post(
            self.URL,
            json={
                "email": "partial@nn-company.com",
                "full_name": "Partial User",
            },
        )

        assert response.status_code == 422


# ════════════════════════════════════════════════════════════
# 🔑 TESTS DE LOGIN — POST /api/v1/auth/login
# ════════════════════════════════════════════════════════════


class TestLogin:
    """Tests para el endpoint de inicio de sesión.

    ¿Qué? Verifica el flujo de autenticación con credenciales.
    ¿Para qué? Asegurar que el login retorna tokens válidos con credenciales correctas
              y rechaza credenciales incorrectas.
    ¿Impacto? Si el login falla, nadie puede acceder al sistema.
    """

    URL = "/api/v1/auth/login"

    def test_login_success(self, client: TestClient, test_user: object) -> None:
        """Login exitoso → 200 + tokens JWT.

        ¿Qué? Envía credenciales válidas y verifica que retorna access y refresh tokens.
        ¿Para qué? Confirmar el flujo principal del login.
        ¿Impacto? Si este test falla, la autenticación básica está rota.
        """
        response = client.post(
            self.URL,
            json={
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        # ¿Qué? Verificar que los tokens no están vacíos.
        # ¿Para qué? Un token vacío causaría errores en los endpoints protegidos.
        # ¿Impacto? Bug silencioso si se retorna un string vacío.
        assert len(data["access_token"]) > 0
        assert len(data["refresh_token"]) > 0

    def test_login_wrong_password(
        self, client: TestClient, test_user: object
    ) -> None:
        """Login con contraseña incorrecta → 401.

        ¿Qué? Envía email válido con contraseña incorrecta.
        ¿Para qué? Verificar que el sistema rechaza contraseñas incorrectas.
        ¿Impacto? Sin esta validación, cualquiera podría acceder con cualquier contraseña.
        """
        response = client.post(
            self.URL,
            json={
                "email": TEST_USER_EMAIL,
                "password": "WrongPassword123",
            },
        )

        assert response.status_code == 401
        assert "inválidas" in response.json()["detail"]

    def test_login_nonexistent_email(self, client: TestClient) -> None:
        """Login con email que no existe → 401.

        ¿Qué? Envía un email no registrado.
        ¿Para qué? Verificar que no se revela si el email existe (previene enumeración).
        ¿Impacto? El MISMO mensaje de error que password incorrecta = seguridad.
        """
        response = client.post(
            self.URL,
            json={
                "email": "ghost@nn-company.com",
                "password": "TestPass123",
            },
        )

        assert response.status_code == 401
        assert "inválidas" in response.json()["detail"]

    def test_login_inactive_user(self, client: TestClient, test_user: object, db: object) -> None:
        """Login con usuario desactivado → 403.

        ¿Qué? Desactiva el usuario de prueba e intenta hacer login.
        ¿Para qué? Verificar que cuentas desactivadas no pueden acceder.
        ¿Impacto? Sin esto, usuarios suspendidos podrían seguir accediendo al sistema.
        """
        from app.models.user import User

        test_user.is_active = False  # type: ignore[attr-defined]
        db.commit()  # type: ignore[attr-defined]

        response = client.post(
            self.URL,
            json={
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
            },
        )

        assert response.status_code == 403
        assert "desactivada" in response.json()["detail"].lower()


# ════════════════════════════════════════════════════════════
# 🔄 TESTS DE REFRESH — POST /api/v1/auth/refresh
# ════════════════════════════════════════════════════════════


class TestRefresh:
    """Tests para el endpoint de renovación de tokens.

    ¿Qué? Verifica el flujo de refresh de access tokens.
    ¿Para qué? Asegurar que el usuario puede mantener su sesión sin re-ingresar credenciales.
    ¿Impacto? Si el refresh falla, los usuarios deben hacer login cada 15 minutos.
    """

    URL = "/api/v1/auth/refresh"

    def test_refresh_success(self, client: TestClient, test_user: object) -> None:
        """Refresh con token válido → 200 + nuevos tokens.

        ¿Qué? Obtiene tokens vía login y usa el refresh token para obtener nuevos.
        ¿Para qué? Confirmar el flujo principal de renovación de sesión.
        ¿Impacto? Si falla, el sistema obliga a re-login cada 15 min.
        """
        # Primero hacer login para obtener refresh token
        login_response = client.post(
            "/api/v1/auth/login",
            json={
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
            },
        )
        refresh_token = login_response.json()["refresh_token"]

        # Usar el refresh token
        response = client.post(
            self.URL,
            json={"refresh_token": refresh_token},
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_refresh_invalid_token(self, client: TestClient) -> None:
        """Refresh con token inválido → 401.

        ¿Qué? Envía un token JWT inventado.
        ¿Para qué? Verificar que tokens manipulados son rechazados.
        ¿Impacto? Sin esta validación, un atacante podría generar tokens falsos.
        """
        response = client.post(
            self.URL,
            json={"refresh_token": "token.invalido.falso"},
        )

        assert response.status_code == 401

    def test_refresh_with_access_token(
        self, client: TestClient, test_user: object
    ) -> None:
        """Refresh usando un access token (en vez de refresh) → 401.

        ¿Qué? Intenta usar un access token como refresh token.
        ¿Para qué? Verificar que la distinción entre tipos de token funciona.
        ¿Impacto? Si se permite usar access como refresh, un access token robado
                  podría renovarse indefinidamente, anulando la expiración de 15 min.
        """
        # Obtener access token vía login
        login_response = client.post(
            "/api/v1/auth/login",
            json={
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
            },
        )
        access_token = login_response.json()["access_token"]

        # Intentar usar access token como refresh
        response = client.post(
            self.URL,
            json={"refresh_token": access_token},
        )

        assert response.status_code == 401


# ════════════════════════════════════════════════════════════
# 🔒 TESTS DE CAMBIO DE CONTRASEÑA — POST /api/v1/auth/change-password
# ════════════════════════════════════════════════════════════


class TestChangePassword:
    """Tests para el endpoint de cambio de contraseña (usuario autenticado).

    ¿Qué? Verifica el flujo de cambio de contraseña desde el perfil.
    ¿Para qué? Asegurar que solo el usuario autenticado puede cambiar SU contraseña,
              y que debe conocer la contraseña actual.
    ¿Impacto? Si falla, los usuarios no pueden rotar sus credenciales.
    """

    URL = "/api/v1/auth/change-password"

    def test_change_password_success(
        self, client: TestClient, auth_headers: dict[str, str]
    ) -> None:
        """Cambio exitoso → 200 + login funciona con nueva contraseña.

        ¿Qué? Cambia la contraseña y verifica que el nuevo login funciona.
        ¿Para qué? Confirmar el flujo completo: cambio + verificación.
        ¿Impacto? Si falla, el usuario queda bloqueado tras cambiar su contraseña.
        """
        new_password = "NewSecure456"

        response = client.post(
            self.URL,
            json={
                "current_password": TEST_USER_PASSWORD,
                "new_password": new_password,
            },
            headers=auth_headers,
        )

        assert response.status_code == 200
        assert "actualizada" in response.json()["message"].lower()

        # ¿Qué? Verificar que la nueva contraseña funciona para login.
        # ¿Para qué? Confirmar que el cambio se persistió correctamente en la BD.
        # ¿Impacto? Si el login falla con la nueva contraseña, el usuario queda bloqueado.
        login_response = client.post(
            "/api/v1/auth/login",
            json={
                "email": TEST_USER_EMAIL,
                "password": new_password,
            },
        )
        assert login_response.status_code == 200

    def test_change_password_wrong_current(
        self, client: TestClient, auth_headers: dict[str, str]
    ) -> None:
        """Cambio con contraseña actual incorrecta → 400.

        ¿Qué? Envía una contraseña actual que no coincide con la almacenada.
        ¿Para qué? Verificar la capa de seguridad adicional.
        ¿Impacto? Sin esto, alguien con un token robado podría cambiar la contraseña.
        """
        response = client.post(
            self.URL,
            json={
                "current_password": "WrongCurrent123",
                "new_password": "NewPass456",
            },
            headers=auth_headers,
        )

        assert response.status_code == 400
        assert "incorrecta" in response.json()["detail"].lower()

    def test_change_password_no_auth(self, client: TestClient) -> None:
        """Cambio sin autenticación → 401.

        ¿Qué? Intenta cambiar la contraseña sin enviar token.
        ¿Para qué? Verificar que el endpoint es protegido.
        ¿Impacto? Sin protección, cualquiera podría cambiar contraseñas ajenas.
        """
        response = client.post(
            self.URL,
            json={
                "current_password": TEST_USER_PASSWORD,
                "new_password": "NewPass456",
            },
        )

        assert response.status_code == 401

    def test_change_password_weak_new_password(
        self, client: TestClient, auth_headers: dict[str, str]
    ) -> None:
        """Cambio con nueva contraseña débil → 422.

        ¿Qué? Intenta cambiar a una contraseña que no cumple los requisitos.
        ¿Para qué? Verificar que la validación de fortaleza aplica también al cambio.
        ¿Impacto? Sin validación, un usuario podría debilitar su contraseña a "123".
        """
        response = client.post(
            self.URL,
            json={
                "current_password": TEST_USER_PASSWORD,
                "new_password": "weak",
            },
            headers=auth_headers,
        )

        assert response.status_code == 422


# ════════════════════════════════════════════════════════════
# 📧 TESTS DE FORGOT PASSWORD — POST /api/v1/auth/forgot-password
# ════════════════════════════════════════════════════════════


class TestForgotPassword:
    """Tests para el endpoint de solicitud de recuperación de contraseña.

    ¿Qué? Verifica que la solicitud de recuperación funciona y no revela información.
    ¿Para qué? Asegurar que el flujo de "olvidé mi contraseña" es seguro.
    ¿Impacto? Endpoint crítico para seguridad: no debe revelar si un email existe.
    """

    URL = "/api/v1/auth/forgot-password"

    def test_forgot_password_existing_email(
        self, client: TestClient, test_user: object
    ) -> None:
        """Forgot con email existente → 200 + mensaje genérico.

        ¿Qué? Solicita recuperación para un email registrado.
        ¿Para qué? Confirmar que el flujo se inicia correctamente.
        ¿Impacto? El token se genera en la BD y el "email" se envía (en dev, se imprime).
        """
        response = client.post(
            self.URL,
            json={"email": TEST_USER_EMAIL},
        )

        assert response.status_code == 200
        assert "enlace de recuperación" in response.json()["message"].lower()

    def test_forgot_password_nonexistent_email(self, client: TestClient) -> None:
        """Forgot con email no registrado → 200 + MISMO mensaje genérico.

        ¿Qué? Solicita recuperación para un email que no existe en la BD.
        ¿Para qué? Verificar que la respuesta es idéntica al caso exitoso.
        ¿Impacto? Si los mensajes fueran diferentes, un atacante podría
                  determinar qué emails están registrados (enumeración de usuarios).
        """
        response = client.post(
            self.URL,
            json={"email": "ghost@nn-company.com"},
        )

        assert response.status_code == 200
        assert "enlace de recuperación" in response.json()["message"].lower()

    def test_forgot_password_invalid_email(self, client: TestClient) -> None:
        """Forgot con email inválido → 422."""
        response = client.post(
            self.URL,
            json={"email": "not-an-email"},
        )

        assert response.status_code == 422


# ════════════════════════════════════════════════════════════
# 🔓 TESTS DE RESET PASSWORD — POST /api/v1/auth/reset-password
# ════════════════════════════════════════════════════════════


class TestResetPassword:
    """Tests para el endpoint de restablecimiento de contraseña.

    ¿Qué? Verifica el flujo completo de reset-password con token.
    ¿Para qué? Asegurar que solo tokens válidos, vigentes y no usados permiten el reset.
    ¿Impacto? Endpoint crítico: si falla, los usuarios no pueden recuperar cuentas perdidas.
    """

    URL = "/api/v1/auth/reset-password"

    def test_reset_password_success(
        self, client: TestClient, valid_reset_token: str
    ) -> None:
        """Reset exitoso → 200 + login funciona con nueva contraseña.

        ¿Qué? Usa un token válido para restablecer la contraseña.
        ¿Para qué? Confirmar el flujo completo de recuperación.
        ¿Impacto? Si falla, los usuarios que olvidan su contraseña quedan bloqueados.
        """
        new_password = "ResetPass789"

        response = client.post(
            self.URL,
            json={
                "token": valid_reset_token,
                "new_password": new_password,
            },
        )

        assert response.status_code == 200
        assert "restablecida" in response.json()["message"].lower()

        # ¿Qué? Verificar que la nueva contraseña funciona para login.
        # ¿Para qué? Confirmar que el reset se completó exitosamente.
        # ¿Impacto? Si el login falla, el reset no actualizó la BD correctamente.
        login_response = client.post(
            "/api/v1/auth/login",
            json={
                "email": TEST_USER_EMAIL,
                "password": new_password,
            },
        )
        assert login_response.status_code == 200

    def test_reset_password_invalid_token(self, client: TestClient) -> None:
        """Reset con token inexistente → 400.

        ¿Qué? Envía un UUID inventado como token.
        ¿Para qué? Verificar que tokens falsos son rechazados.
        ¿Impacto? Sin esta validación, cualquiera podría resetear contraseñas ajenas.
        """
        response = client.post(
            self.URL,
            json={
                "token": "00000000-0000-0000-0000-000000000000",
                "new_password": "NewPass456",
            },
        )

        assert response.status_code == 400
        assert "inválido" in response.json()["detail"].lower()

    def test_reset_password_expired_token(
        self, client: TestClient, expired_reset_token: str
    ) -> None:
        """Reset con token expirado → 400.

        ¿Qué? Usa un token cuya fecha de expiración ya pasó.
        ¿Para qué? Verificar que tokens caducados no pueden usarse.
        ¿Impacto? Sin expiración, un enlace de recovery viejo sería válido para siempre.
        """
        response = client.post(
            self.URL,
            json={
                "token": expired_reset_token,
                "new_password": "NewPass456",
            },
        )

        assert response.status_code == 400
        assert "expirado" in response.json()["detail"].lower()

    def test_reset_password_used_token(
        self, client: TestClient, used_reset_token: str
    ) -> None:
        """Reset con token ya utilizado → 400.

        ¿Qué? Intenta usar un token que ya fue consumido.
        ¿Para qué? Verificar que un token solo se puede usar una vez.
        ¿Impacto? Sin esto, un atacante podría reusar el enlace del email para
                  cambiar la contraseña repetidamente.
        """
        response = client.post(
            self.URL,
            json={
                "token": used_reset_token,
                "new_password": "NewPass456",
            },
        )

        assert response.status_code == 400
        assert "utilizado" in response.json()["detail"].lower()

    def test_reset_password_weak_new_password(
        self, client: TestClient, valid_reset_token: str
    ) -> None:
        """Reset con nueva contraseña débil → 422."""
        response = client.post(
            self.URL,
            json={
                "token": valid_reset_token,
                "new_password": "123",
            },
        )

        assert response.status_code == 422


# ════════════════════════════════════════════════════════════
# 👤 TESTS DE PERFIL — GET /api/v1/users/me
# ════════════════════════════════════════════════════════════


class TestGetMe:
    """Tests para el endpoint de perfil de usuario.

    ¿Qué? Verifica que el endpoint protegido GET /me funciona correctamente.
    ¿Para qué? Asegurar que usuarios autenticados pueden ver su perfil
              y que usuarios no autenticados son rechazados.
    ¿Impacto? Si falla, el frontend no puede mostrar los datos del usuario logueado.
    """

    URL = "/api/v1/users/me"

    def test_get_me_success(
        self, client: TestClient, auth_headers: dict[str, str], test_user: object
    ) -> None:
        """GET /me con token válido → 200 + datos del usuario.

        ¿Qué? Consulta el perfil con un access token válido.
        ¿Para qué? Confirmar que el endpoint retorna los datos correctos del usuario.
        ¿Impacto? Si falla, el dashboard del frontend no puede mostrar info del usuario.
        """
        response = client.get(self.URL, headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["email"] == TEST_USER_EMAIL
        assert data["full_name"] == TEST_USER_FULL_NAME
        assert data["is_active"] is True
        assert "hashed_password" not in data
        assert "password" not in data

    def test_get_me_no_auth(self, client: TestClient) -> None:
        """GET /me sin token → 401.

        ¿Qué? Intenta acceder al perfil sin enviar token de autenticación.
        ¿Para qué? Verificar que el endpoint es protegido.
        ¿Impacto? Sin protección, cualquiera podría acceder a perfiles ajenos.
        """
        response = client.get(self.URL)

        assert response.status_code == 401

    def test_get_me_invalid_token(self, client: TestClient) -> None:
        """GET /me con token inválido → 401."""
        response = client.get(
            self.URL,
            headers={"Authorization": "Bearer token.invalido.falso"},
        )

        assert response.status_code == 401


# ════════════════════════════════════════════════════════════
# ❤️ TESTS DE HEALTH CHECK — GET /api/v1/health
# ════════════════════════════════════════════════════════════


class TestHealthCheck:
    """Tests para el endpoint de verificación de salud del servidor.

    ¿Qué? Verifica que el health check responde correctamente.
    ¿Para qué? Asegurar que el endpoint de monitoreo funciona.
    ¿Impacto? Si falla, herramientas de monitoreo no pueden verificar el servidor.
    """

    URL = "/api/v1/health"

    def test_health_check(self, client: TestClient) -> None:
        """Health check → 200 + status healthy."""
        response = client.get(self.URL)

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["project"] == "NN Auth System"
