"""
Módulo: routers/auth.py
Descripción: Endpoints de autenticación — registro, login, refresh, cambio y recuperación
             de contraseña.
¿Para qué? Definir las rutas HTTP (POST /register, POST /login, etc.) que el frontend
           consume para todas las operaciones de autenticación.
¿Impacto? Este router es la "puerta de entrada" al sistema de auth. Cada endpoint
          recibe datos del cliente, los valida con schemas de Pydantic, y delega
          la lógica de negocio al auth_service.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.user import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    MessageResponse,
    RefreshTokenRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.services import auth_service

# ¿Qué? Router de FastAPI que agrupa todos los endpoints de autenticación.
# ¿Para qué? Organizar endpoints por dominio — todos los de auth van bajo /api/v1/auth.
# ¿Impacto? El prefix y tags hacen que Swagger UI los agrupe y documente automáticamente.
router = APIRouter(
    prefix="/api/v1/auth",
    tags=["auth"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar nuevo usuario",
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
) -> UserResponse:
    """Registra un nuevo usuario en el sistema.

    ¿Qué? Endpoint que recibe email, nombre y contraseña, y crea una nueva cuenta.
    ¿Para qué? Permitir que nuevos usuarios se registren en NN Auth System.
    ¿Impacto? status_code=201 indica "recurso creado". response_model=UserResponse
              garantiza que NUNCA se retorne el hash de la contraseña.

    Args:
        user_data: Datos del nuevo usuario (validados por Pydantic).
        db: Sesión de BD (inyectada por FastAPI).

    Returns:
        Datos del usuario creado (sin contraseña).
    """
    user = auth_service.register_user(db=db, user_data=user_data)
    return UserResponse.model_validate(user)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Iniciar sesión",
)
def login(
    login_data: UserLogin,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Autentica un usuario y retorna tokens JWT.

    ¿Qué? Endpoint que recibe email y contraseña, valida credenciales y retorna tokens.
    ¿Para qué? Permitir al usuario iniciar sesión y obtener tokens para acceder a la API.
    ¿Impacto? Retorna access_token (15 min) + refresh_token (7 días).
              El frontend debe almacenar estos tokens y enviar el access_token
              en el header Authorization de cada petición protegida.

    Args:
        login_data: Credenciales del usuario (email + password).
        db: Sesión de BD (inyectada por FastAPI).

    Returns:
        Par de tokens (access + refresh) y tipo "bearer".
    """
    return auth_service.login_user(db=db, login_data=login_data)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Renovar access token",
)
def refresh_token(
    token_data: RefreshTokenRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Genera nuevos tokens usando un refresh token válido.

    ¿Qué? Endpoint que recibe un refresh token y genera un nuevo par de tokens.
    ¿Para qué? Mantener la sesión del usuario sin pedirle credenciales cada 15 minutos.
              Cuando el access_token expira, el frontend envía el refresh_token aquí
              para obtener uno nuevo.
    ¿Impacto? Si el refresh token expiró (>7 días), el usuario debe hacer login de nuevo.
              Se implementa rotación de tokens: el refresh token anterior queda invalidado.

    Args:
        token_data: Contiene el refresh_token a validar.
        db: Sesión de BD (inyectada por FastAPI).

    Returns:
        Nuevos tokens (access + refresh).
    """
    return auth_service.refresh_access_token(
        db=db,
        refresh_token=token_data.refresh_token,
    )


@router.post(
    "/change-password",
    response_model=MessageResponse,
    summary="Cambiar contraseña (usuario autenticado)",
)
def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MessageResponse:
    """Cambia la contraseña del usuario autenticado.

    ¿Qué? Endpoint que requiere la contraseña actual y la nueva contraseña.
    ¿Para qué? Permitir al usuario actualizar su contraseña estando logueado.
    ¿Impacto? Requires Depends(get_current_user) = endpoint protegido.
              Solo funciona con un access_token válido en el header Authorization.
              Verifica la contraseña actual como capa extra de seguridad.

    Args:
        password_data: Contraseña actual + nueva contraseña.
        current_user: Usuario autenticado (inyectado por get_current_user).
        db: Sesión de BD (inyectada por FastAPI).

    Returns:
        Mensaje de confirmación.
    """
    auth_service.change_password(
        db=db,
        user=current_user,
        password_data=password_data,
    )
    return MessageResponse(message="Contraseña actualizada exitosamente")


@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    summary="Solicitar recuperación de contraseña",
)
async def forgot_password(
    request_data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
) -> MessageResponse:
    """Solicita un email de recuperación de contraseña.

    ¿Qué? Endpoint que recibe un email y envía un enlace de recuperación (si el email existe).
    ¿Para qué? Iniciar el flujo de "olvidé mi contraseña".
    ¿Impacto? SIEMPRE retorna el mismo mensaje de éxito, sin importar si el email está
              registrado o no. Esto es intencional: previene la enumeración de usuarios.
              Un atacante no puede saber si un email está registrado basándose en la respuesta.

    Args:
        request_data: Email del usuario.
        db: Sesión de BD (inyectada por FastAPI).

    Returns:
        Mensaje genérico de confirmación.
    """
    await auth_service.request_password_reset(db=db, email=request_data.email)
    return MessageResponse(
        message="Si el email está registrado, recibirás un enlace de recuperación"
    )


@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="Restablecer contraseña con token",
)
def reset_password(
    reset_data: ResetPasswordRequest,
    db: Session = Depends(get_db),
) -> MessageResponse:
    """Restablece la contraseña usando un token de recuperación.

    ¿Qué? Endpoint que recibe un token (del email) y la nueva contraseña.
    ¿Para qué? Completar el flujo de recuperación de contraseña.
    ¿Impacto? El token se valida (existencia, expiración, uso previo) y luego se marca
              como usado. La nueva contraseña se hashea antes de guardar.

    Args:
        reset_data: Token de recuperación + nueva contraseña.
        db: Sesión de BD (inyectada por FastAPI).

    Returns:
        Mensaje de confirmación.
    """
    auth_service.reset_password(db=db, reset_data=reset_data)
    return MessageResponse(message="Contraseña restablecida exitosamente")
