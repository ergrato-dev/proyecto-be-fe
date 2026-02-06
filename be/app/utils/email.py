"""
Módulo: utils/email.py
Descripción: Utilidades para envío de emails — recuperación de contraseña.
¿Para qué? Proveer funciones para enviar emails de recuperación de contraseña al usuario,
           incluyendo el enlace con el token de reset.
¿Impacto? Sin este módulo, la funcionalidad de "olvidé mi contraseña" no puede enviar
          el enlace de recuperación al email del usuario.
"""

import logging

from app.config import settings

# ¿Qué? Logger para registrar eventos de envío de email.
# ¿Para qué? En desarrollo, loggear los emails en lugar de enviarlos realmente
#            (útil cuando no hay servidor SMTP configurado).
# ¿Impacto? Permite depurar el flujo de recuperación sin configurar un servidor de correo.
logger = logging.getLogger(__name__)


async def send_password_reset_email(email: str, token: str) -> None:
    """Envía un email con el enlace de recuperación de contraseña.

    ¿Qué? Construye y envía un email con un enlace que contiene el token de reset.
    ¿Para qué? Permitir al usuario restablecer su contraseña cuando la ha olvidado.
              El enlace lleva al frontend con el token como query parameter.
    ¿Impacto? Si el email no se envía, el usuario no puede recuperar su cuenta.
              En desarrollo, el enlace se muestra en la consola del servidor.

    Args:
        email: Dirección de email del usuario que solicitó el reset.
        token: Token único de recuperación (UUID) generado por el sistema.
    """
    # ¿Qué? URL completa que el usuario recibirá en su email.
    # ¿Para qué? Al hacer clic, el frontend captura el token y muestra el formulario de reset.
    # ¿Impacto? FRONTEND_URL debe coincidir con la URL real del frontend, de lo contrario
    #           el enlace no funcionará.
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    # ────────────────────────────
    # 📧 Modo desarrollo — Log en consola
    # ────────────────────────────
    # ¿Qué? En desarrollo, imprimimos el enlace en la consola en lugar de enviar email real.
    # ¿Para qué? Facilitar el testing sin necesidad de configurar un servidor SMTP.
    # ¿Impacto? En producción, esto debe reemplazarse por envío SMTP real con aiosmtplib.
    #           TODO: Implementar envío SMTP real para producción.
    logger.info(
        "📧 Email de recuperación de contraseña:\n"
        f"   Para: {email}\n"
        f"   Enlace: {reset_url}\n"
        f"   Token: {token}"
    )

    # ────────────────────────────
    # 📧 Modo producción — Envío SMTP real (descomentado cuando el SMTP esté configurado)
    # ────────────────────────────
    # ¿Qué? Envío de email usando aiosmtplib (cliente SMTP asíncrono).
    # ¿Para qué? Enviar el email de recuperación de forma no bloqueante.
    # ¿Impacto? Si el SMTP falla, el usuario no recibe el email pero el token sí se crea
    #           en la BD. Se debería manejar el error y notificar al usuario.
    #
    # from email.mime.text import MIMEText
    # from email.mime.multipart import MIMEMultipart
    # import aiosmtplib
    #
    # message = MIMEMultipart("alternative")
    # message["From"] = f"{settings.MAIL_FROM_NAME} <{settings.MAIL_FROM}>"
    # message["To"] = email
    # message["Subject"] = "NN Auth System — Recuperación de contraseña"
    #
    # html_content = f"""
    # <html>
    # <body>
    #     <h2>Recuperación de contraseña</h2>
    #     <p>Has solicitado restablecer tu contraseña en NN Auth System.</p>
    #     <p>Haz clic en el siguiente enlace (válido por 1 hora):</p>
    #     <p><a href="{reset_url}">Restablecer contraseña</a></p>
    #     <p>Si no solicitaste este cambio, ignora este email.</p>
    # </body>
    # </html>
    # """
    # message.attach(MIMEText(html_content, "html"))
    #
    # try:
    #     await aiosmtplib.send(
    #         message,
    #         hostname=settings.MAIL_SERVER,
    #         port=settings.MAIL_PORT,
    #         username=settings.MAIL_USERNAME,
    #         password=settings.MAIL_PASSWORD,
    #         use_tls=True,
    #     )
    # except Exception as e:
    #     logger.error(f"Error enviando email a {email}: {e}")
    #     raise

    # ¿Qué? Print adicional para desarrollo — visible directamente en la terminal.
    # ¿Para qué? Garantizar que el enlace sea visible incluso si el logging no está configurado.
    # ¿Impacto? Facilita copiar/pegar el enlace durante el desarrollo.
    print(f"\n{'='*60}")
    print(f"📧 EMAIL DE RECUPERACIÓN (modo desarrollo)")
    print(f"   Para: {email}")
    print(f"   Enlace: {reset_url}")
    print(f"{'='*60}\n")
