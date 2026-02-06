"""
Módulo: routers/users.py
Descripción: Endpoints de usuario — perfil del usuario autenticado.
¿Para qué? Proveer endpoints para que el usuario autenticado consulte y gestione su perfil.
¿Impacto? Sin este router, el frontend no podría mostrar los datos del usuario logueado
          (nombre, email, fecha de registro, etc.).
"""

from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse

# ¿Qué? Router de FastAPI para endpoints de usuario.
# ¿Para qué? Agrupar endpoints relacionados con el perfil del usuario bajo /api/v1/users.
# ¿Impacto? Separar los endpoints de usuario de los de auth mantiene el código organizado
#           y facilita agregar más endpoints de usuario en el futuro (ej: update profile).
router = APIRouter(
    prefix="/api/v1/users",
    tags=["users"],
)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Obtener perfil del usuario actual",
)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Retorna los datos del perfil del usuario autenticado.

    ¿Qué? Endpoint que retorna los datos del usuario que está haciendo el request.
    ¿Para qué? El frontend lo usa para mostrar el nombre, email y datos del usuario
              en el dashboard, navbar, perfil, etc.
    ¿Impacto? Depends(get_current_user) hace que este endpoint sea PROTEGIDO:
              solo funciona con un access_token válido. Si el token es inválido o expiró,
              FastAPI retorna 401 automáticamente (gracias a la dependencia).

    Args:
        current_user: Usuario autenticado (inyectado automáticamente por FastAPI).

    Returns:
        Datos del perfil del usuario (sin contraseña).
    """
    return UserResponse.model_validate(current_user)
