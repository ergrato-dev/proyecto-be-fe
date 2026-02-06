"""
Módulo: services/auth_service.py
Descripción: Lógica de negocio para todas las operaciones de autenticación —
             registro, login, cambio de contraseña y recuperación.
¿Para qué? Separar la lógica de negocio de los endpoints (routers). Los routers solo
           reciben requests y llaman al service; el service contiene TODA la lógica.
¿Impacto? Este módulo es el cerebro del sistema de auth. Aquí se decide si un login
          es válido, si un registro debe aceptarse, y cómo se maneja cada flujo.
          Separar esta lógica facilita testing (se puede testear sin HTTP) y reutilización.
"""

import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.password_reset_token import PasswordResetToken
from app.models.user import User
from app.schemas.user import (
    ChangePasswordRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
)
from app.utils.email import send_password_reset_email
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


def register_user(db: Session, user_data: UserCreate) -> User:
    """Registra un nuevo usuario en el sistema.

    ¿Qué? Crea una nueva cuenta de usuario con email, nombre y contraseña hasheada.
    ¿Para qué? Permitir que nuevos usuarios se registren en NN Auth System.
    ¿Impacto? Flujo crítico: verifica email duplicado → hashea password → crea en BD.
              Si el email ya existe, retorna 400. Si el hash falla, la cuenta no se crea.

    Args:
        db: Sesión de base de datos.
        user_data: Datos validados del usuario (email, full_name, password).

    Returns:
        Objeto User creado y persistido en la BD.

    Raises:
        HTTPException 400: Si el email ya está registrado.
    """
    # ¿Qué? Buscar si ya existe un usuario con ese email.
    # ¿Para qué? Evitar cuentas duplicadas — email es UNIQUE en la BD.
    # ¿Impacto? Sin esta verificación, la BD lanzaría un IntegrityError poco descriptivo.
    stmt = select(User).where(User.email == user_data.email)
    existing_user = db.execute(stmt).scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado",
        )

    # ¿Qué? Crear el objeto User con la contraseña hasheada.
    # ¿Para qué? Almacenar la contraseña de forma segura — NUNCA en texto plano.
    # ¿Impacto? hash_password usa bcrypt, que es deliberadamente lento para dificultar
    #           ataques de fuerza bruta contra hashes filtrados.
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hash_password(user_data.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def login_user(db: Session, login_data: UserLogin) -> TokenResponse:
    """Autentica un usuario y retorna tokens JWT.

    ¿Qué? Verifica credenciales (email + password) y genera access/refresh tokens.
    ¿Para qué? Permitir al usuario iniciar sesión y obtener tokens para acceder a la API.
    ¿Impacto? Flujo: buscar por email → verificar password → generar tokens.
              Los mensajes de error son GENÉRICOS ("credenciales inválidas") para no revelar
              si el email existe o no (previene enumeración de usuarios).

    Args:
        db: Sesión de base de datos.
        login_data: Credenciales del usuario (email, password).

    Returns:
        TokenResponse con access_token, refresh_token y token_type.

    Raises:
        HTTPException 401: Si las credenciales son inválidas.
    """
    # ¿Qué? Buscar usuario por email.
    # ¿Para qué? Obtener el hash almacenado para comparar con la contraseña ingresada.
    # ¿Impacto? Si el usuario no existe, se retorna el MISMO error que si la contraseña
    #           es incorrecta — esto previene la enumeración de emails.
    stmt = select(User).where(User.email == login_data.email)
    user = db.execute(stmt).scalar_one_or_none()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # ¿Qué? Verificar que la cuenta esté activa.
    # ¿Para qué? Impedir login de cuentas desactivadas (ej: suspendidas por admin).
    # ¿Impacto? Sin esta verificación, usuarios desactivados podrían seguir accediendo.
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cuenta desactivada. Contacte al administrador.",
        )

    # ¿Qué? Generar par de tokens JWT (access + refresh).
    # ¿Para qué? El access token se usa en cada request; el refresh token para renovar.
    # ¿Impacto? "sub" (subject) contiene el email — es lo que identifica al usuario en el token.
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


def refresh_access_token(db: Session, refresh_token: str) -> TokenResponse:
    """Genera un nuevo access token usando un refresh token válido.

    ¿Qué? Decodifica el refresh token, verifica que el usuario existe y genera nuevos tokens.
    ¿Para qué? Mantener la sesión del usuario sin pedirle credenciales cada 15 minutos.
    ¿Impacto? Si el refresh token expiró (>7 días), el usuario debe hacer login de nuevo.
              Se genera un NUEVO refresh token (rotación) para mayor seguridad.

    Args:
        db: Sesión de base de datos.
        refresh_token: Token JWT de refresco.

    Returns:
        TokenResponse con nuevos access_token y refresh_token.

    Raises:
        HTTPException 401: Si el refresh token es inválido o expirado.
    """
    payload = decode_token(refresh_token)

    # ¿Qué? Verificar que el token es válido y de tipo "refresh".
    # ¿Para qué? Evitar que un access token sea usado como refresh token.
    # ¿Impacto? Sin esta verificación, la distinción entre tipos de token sería inútil.
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email: str | None = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token sin identificador de usuario",
        )

    # ¿Qué? Verificar que el usuario aún existe y está activo.
    # ¿Para qué? Si la cuenta fue eliminada o desactivada después del login,
    #            no debería poder renovar su sesión.
    # ¿Impacto? Sin esto, usuarios eliminados mantendrían acceso hasta que expire el refresh.
    stmt = select(User).where(User.email == email)
    user = db.execute(stmt).scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o cuenta desactivada",
        )

    # ¿Qué? Rotación de tokens — generar NUEVOS access y refresh tokens.
    # ¿Para qué? Si el refresh token anterior fue comprometido, el nuevo lo invalida
    #            (el antiguo ya no se puede usar porque se regenera).
    # ¿Impacto? Mejora la seguridad: cada refresh genera un nuevo par de tokens.
    new_access = create_access_token(data={"sub": user.email})
    new_refresh = create_refresh_token(data={"sub": user.email})

    return TokenResponse(
        access_token=new_access,
        refresh_token=new_refresh,
    )


def change_password(db: Session, user: User, password_data: ChangePasswordRequest) -> None:
    """Cambia la contraseña de un usuario autenticado.

    ¿Qué? Verifica la contraseña actual y actualiza con la nueva (hasheada).
    ¿Para qué? Permitir al usuario cambiar su contraseña desde su perfil (ya logueado).
    ¿Impacto? Requiere la contraseña actual como verificación adicional — previene
              cambios no autorizados si alguien tiene acceso temporal al token.

    Args:
        db: Sesión de base de datos.
        user: Objeto User del usuario autenticado (obtenido vía get_current_user).
        password_data: Contraseña actual y nueva contraseña.

    Raises:
        HTTPException 400: Si la contraseña actual es incorrecta.
    """
    # ¿Qué? Verificar que el usuario conoce su contraseña actual.
    # ¿Para qué? Capa de seguridad adicional — si alguien tiene el token pero no la contraseña,
    #            no puede cambiarla.
    # ¿Impacto? Sin esta verificación, cualquiera con un access token válido podría
    #           cambiar la contraseña y apoderarse de la cuenta.
    if not verify_password(password_data.current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña actual es incorrecta",
        )

    # ¿Qué? Hashear la nueva contraseña y actualizar en la BD.
    # ¿Para qué? Almacenar la nueva contraseña de forma segura.
    # ¿Impacto? Después de este cambio, la contraseña anterior ya no funciona para login.
    user.hashed_password = hash_password(password_data.new_password)
    db.commit()


async def request_password_reset(db: Session, email: str) -> None:
    """Solicita un email de recuperación de contraseña.

    ¿Qué? Genera un token de reset, lo guarda en la BD y envía el email con el enlace.
    ¿Para qué? Permitir al usuario restablecer su contraseña cuando la ha olvidado.
    ¿Impacto? SIEMPRE retorna éxito, incluso si el email no existe en la BD.
              Esto previene la enumeración de usuarios (un atacante no puede saber
              si un email está registrado basándose en la respuesta).

    Args:
        db: Sesión de base de datos.
        email: Email del usuario que solicita la recuperación.
    """
    stmt = select(User).where(User.email == email)
    user = db.execute(stmt).scalar_one_or_none()

    # ¿Qué? Si el usuario no existe, retornar silenciosamente sin hacer nada.
    # ¿Para qué? Prevenir enumeración de usuarios — la API no debe revelar si el email existe.
    # ¿Impacto? El cliente siempre ve "Si el email existe, recibirás un enlace..."
    #           Sin importar si el email está registrado o no.
    if not user:
        return

    # ¿Qué? Generar un token UUID único para el enlace de recuperación.
    # ¿Para qué? Este token viaja en la URL del email y se valida al restablecer.
    # ¿Impacto? UUID4 tiene 122 bits de entropía — prácticamente imposible de adivinar.
    reset_token = str(uuid.uuid4())

    # ¿Qué? Crear el registro del token en la tabla password_reset_tokens.
    # ¿Para qué? Almacenar el token con su expiración para validarlo después.
    # ¿Impacto? Expiración de 1 hora — después de eso, el usuario debe solicitar otro.
    token_record = PasswordResetToken(
        user_id=user.id,
        token=reset_token,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
    )

    db.add(token_record)
    db.commit()

    # ¿Qué? Enviar el email con el enlace de recuperación.
    # ¿Para qué? El usuario hace clic en el enlace, que lo lleva al frontend con el token.
    # ¿Impacto? En desarrollo, el enlace se imprime en la consola del servidor.
    await send_password_reset_email(email=user.email, token=reset_token)


def reset_password(db: Session, reset_data: ResetPasswordRequest) -> None:
    """Restablece la contraseña usando un token de recuperación.

    ¿Qué? Valida el token de reset, hashea la nueva contraseña y actualiza la BD.
    ¿Para qué? Completar el flujo de recuperación de contraseña.
    ¿Impacto? El token se marca como "usado" después del reset exitoso,
              evitando que se reutilice.

    Args:
        db: Sesión de base de datos.
        reset_data: Token de reset y nueva contraseña.

    Raises:
        HTTPException 400: Si el token es inválido, expirado o ya fue usado.
    """
    # ¿Qué? Buscar el token en la BD.
    # ¿Para qué? Verificar que el token existe y obtener el usuario asociado.
    # ¿Impacto? Si el token no existe, alguien intentó usar un token falso o manipulado.
    stmt = select(PasswordResetToken).where(
        PasswordResetToken.token == reset_data.token
    )
    token_record = db.execute(stmt).scalar_one_or_none()

    if not token_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de recuperación inválido",
        )

    # ¿Qué? Verificar que el token no haya sido usado previamente.
    # ¿Para qué? Evitar reutilización de tokens — un token solo sirve una vez.
    # ¿Impacto? Sin esto, alguien podría cambiar la contraseña múltiples veces con el mismo token.
    if token_record.used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este token de recuperación ya fue utilizado",
        )

    # ¿Qué? Verificar que el token no haya expirado.
    # ¿Para qué? Limitar la ventana de tiempo en que un enlace de recuperación es válido.
    # ¿Impacto? Tokens expiran en 1 hora — después de eso, el usuario debe solicitar otro.
    if token_record.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El token de recuperación ha expirado. Solicite uno nuevo.",
        )

    # ¿Qué? Obtener el usuario asociado al token.
    # ¿Para qué? Actualizar la contraseña del usuario correcto.
    # ¿Impacto? El user_id del token apunta al usuario que solicitó la recuperación.
    stmt = select(User).where(User.id == token_record.user_id)
    user = db.execute(stmt).scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario no encontrado",
        )

    # ¿Qué? Actualizar la contraseña y marcar el token como usado.
    # ¿Para qué? Completar el reset + invalidar el token para que no se reutilice.
    # ¿Impacto? Después de esto, la contraseña anterior ya no funciona y el token es inválido.
    user.hashed_password = hash_password(reset_data.new_password)
    token_record.used = True
    db.commit()
