"""
Módulo: utils/email.py
Descripción: Utilidades para el envío de emails transaccionales usando la API de Resend.
¿Para qué? Proveer funciones reutilizables para:
           1. Verificación de email al registrarse (nuevo usuario).
           2. Recuperación de contraseña (enlace de reset).
¿Impacto? Sin este módulo, los flujos de verificación y recuperación no pueden notificar
          al usuario. Si RESEND_API_KEY no está configurada, los emails se simulan en logs.

Resend — capa gratuita: 3,000 emails/mes, 100/día.
Documentación: https://resend.com/docs/send-with-python
"""

import asyncio
import logging

import resend

from app.config import settings

# ¿Qué? Logger para registrar eventos de envío (éxito, error, modo simulado).
# ¿Para qué? Depurar problemas de envío sin exponer el contenido del email en logs.
# ¿Impacto? En desarrollo, el enlace de verificación aparece aquí si no hay API key.
logger = logging.getLogger(__name__)


def _send_email_sync(params: resend.Emails.SendParams) -> None:
    """Ejecuta el envío de email de forma síncrona usando el SDK de Resend.

    ¿Qué? Función auxiliar que configura la API key y llama a resend.Emails.send().
    ¿Para qué? Centralizar la configuración de Resend y separar el envío real de la lógica.
              Se usa internamente desde las funciones async vía asyncio.to_thread().
    ¿Impacto? resend.Emails.send() es síncrono — correrlo directo en un async endpoint
              bloquearía el event loop. asyncio.to_thread() lo ejecuta en un thread pool.

    Args:
        params: Parámetros del email (from, to, subject, html).
    """
    # ¿Qué? Establece la API key de Resend antes de cada envío.
    # ¿Para qué? El SDK de Resend requiere que resend.api_key esté configurada.
    # ¿Impacto? Es seguro hacerlo aquí ya que settings.RESEND_API_KEY es inmutable en runtime.
    resend.api_key = settings.RESEND_API_KEY
    resend.Emails.send(params)


async def send_verification_email(email: str, token: str) -> None:
    """Envía el email de verificación de cuenta al nuevo usuario.

    ¿Qué? Construye un email HTML con el enlace de activación y lo envía vía Resend.
    ¿Para qué? Confirmar que el correo proporcionado en el registro existe y le pertenece
              al usuario. Sin verificar, la cuenta queda bloqueada (is_email_verified=False).
    ¿Impacto? Si RESEND_API_KEY no está configurada, el enlace se imprime en los logs
              del servidor (modo desarrollo). El usuario igual se registra en la BD.
              El enlace expira en 24 horas.

    Args:
        email: Dirección de email del usuario recién registrado.
        token: Token único de verificación (UUID) generado al registrar.
    """
    # ¿Qué? URL que el usuario recibirá para verificar su cuenta.
    # ¿Para qué? Al hacer clic, el frontend captura el token y llama a POST /verify-email.
    # ¿Impacto? FRONTEND_URL debe coincidir con la URL real del frontend (localhost:5173 en dev).
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    # ¿Qué? Si no hay API key configurada, simular el envío en los logs.
    # ¿Para qué? Permitir desarrollo y testing sin necesitar una cuenta de Resend.
    # ¿Impacto? El desarrollador puede copiar el enlace del log y probarlo manualmente.
    if not settings.RESEND_API_KEY:
        logger.info(
            "\n%s\n"
            "📧 EMAIL DE VERIFICACIÓN (modo desarrollo — sin API key)\n"
            "   Para: %s\n"
            "   Enlace: %s\n"
            "%s",
            "=" * 60,
            email,
            verification_url,
            "=" * 60,
        )
        return

    html_content = f"""
    <html>
    <body style="font-family: system-ui, -apple-system, sans-serif;
                 max-width: 600px; margin: 0 auto; padding: 24px; color: #111827;">
        <h2 style="color: #1d4ed8; margin-bottom: 8px;">
            Verifica tu cuenta — NN Auth System
        </h2>
        <p style="color: #374151;">
            ¡Bienvenido! Para activar tu cuenta y poder iniciar sesión,
            haz clic en el botón de abajo.
        </p>
        <p style="color: #6b7280; font-size: 14px;">
            El enlace es válido por <strong>24 horas</strong>.
        </p>
        <p style="margin: 32px 0;">
            <a href="{verification_url}"
               style="background-color: #1d4ed8; color: white; padding: 12px 28px;
                      text-decoration: none; border-radius: 6px; font-weight: 500;
                      font-size: 15px;">
                Verificar mi cuenta
            </a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="color: #6b7280; font-size: 13px;">
            Si no creaste esta cuenta, puedes ignorar este email sin problema.<br><br>
            Si el botón no funciona, copia este enlace en tu navegador:<br>
            <a href="{verification_url}" style="color: #1d4ed8;">{verification_url}</a>
        </p>
    </body>
    </html>
    """

    params: resend.Emails.SendParams = {
        "from": f"{settings.RESEND_FROM_NAME} <{settings.RESEND_FROM_EMAIL}>",
        "to": [email],
        "subject": "NN Auth System — Verifica tu cuenta",
        "html": html_content,
    }

    try:
        # ¿Qué? Ejecuta el envío síncrono de Resend en un thread separado.
        # ¿Para qué? No bloquear el event loop de FastAPI mientras se hace la llamada HTTP a Resend.
        # ¿Impacto? Sin to_thread(), un email lento congelaría la API para todas las peticiones.
        await asyncio.to_thread(_send_email_sync, params)
        logger.info("✅ Email de verificación enviado a %s", email)
    except Exception as exc:
        # ¿Qué? Loggear el error pero no propagarlo — el registro ya fue exitoso en la BD.
        # ¿Para qué? Un fallo de Resend no debe impedir que el usuario se registre.
        # ¿Impacto? El usuario puede solicitar reenvío del email (funcionalidad futura).
        logger.error("❌ Error enviando email de verificación a %s: %s", email, exc)
        # ¿Qué? Si Resend falla (ej: dominio no verificado, límite de envío), mostrar el enlace en logs.
        # ¿Para qué? Permitir verificación manual durante desarrollo sin un dominio configurado en Resend.
        # ¿Impacto? El desarrollador puede copiar el enlace del log y abrirlo manualmente.
        logger.info(
            "\n%s\n"
            "📧 ENLACE DE VERIFICACIÓN (fallback — Resend falló)\n"
            "   Para: %s\n"
            "   Enlace: %s\n"
            "%s",
            "=" * 60,
            email,
            verification_url,
            "=" * 60,
        )


async def send_password_reset_email(email: str, token: str) -> None:
    """Envía el email con el enlace de recuperación de contraseña.

    ¿Qué? Construye un email HTML con el enlace de reset y lo envía vía Resend.
    ¿Para qué? Permitir al usuario restablecer su contraseña cuando la ha olvidado.
    ¿Impacto? Si el email no se envía, el usuario no puede recuperar su cuenta.
              El enlace expira en 1 hora.

    Args:
        email: Dirección de email del usuario que solicitó el reset.
        token: Token único de recuperación (UUID) generado por el sistema.
    """
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    if not settings.RESEND_API_KEY:
        logger.info(
            "\n%s\n"
            "📧 EMAIL DE RECUPERACIÓN (modo desarrollo — sin API key)\n"
            "   Para: %s\n"
            "   Enlace: %s\n"
            "%s",
            "=" * 60,
            email,
            reset_url,
            "=" * 60,
        )
        return

    html_content = f"""
    <html>
    <body style="font-family: system-ui, -apple-system, sans-serif;
                 max-width: 600px; margin: 0 auto; padding: 24px; color: #111827;">
        <h2 style="color: #1d4ed8; margin-bottom: 8px;">
            Recuperación de contraseña — NN Auth System
        </h2>
        <p style="color: #374151;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta.
        </p>
        <p style="color: #6b7280; font-size: 14px;">
            El enlace es válido por <strong>1 hora</strong>.
            Si no lo solicitaste, ignora este email.
        </p>
        <p style="margin: 32px 0;">
            <a href="{reset_url}"
               style="background-color: #1d4ed8; color: white; padding: 12px 28px;
                      text-decoration: none; border-radius: 6px; font-weight: 500;
                      font-size: 15px;">
                Restablecer contraseña
            </a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="color: #6b7280; font-size: 13px;">
            Si el botón no funciona, copia este enlace en tu navegador:<br>
            <a href="{reset_url}" style="color: #1d4ed8;">{reset_url}</a>
        </p>
    </body>
    </html>
    """

    params: resend.Emails.SendParams = {
        "from": f"{settings.RESEND_FROM_NAME} <{settings.RESEND_FROM_EMAIL}>",
        "to": [email],
        "subject": "NN Auth System — Recuperación de contraseña",
        "html": html_content,
    }

    try:
        await asyncio.to_thread(_send_email_sync, params)
        logger.info("✅ Email de recuperación enviado a %s", email)
    except Exception as exc:
        logger.error("❌ Error enviando email de recuperación a %s: %s", email, exc)
        # ¿Qué? Fallback: mostrar el enlace en logs cuando Resend falla.
        # ¿Para qué? Permitir recuperación manual durante desarrollo sin dominio verificado.
        # ¿Impacto? El desarrollador puede copiar el enlace del log y usarlo manualmente.
        logger.info(
            "\n%s\n"
            "📧 ENLACE DE RECUPERACIÓN (fallback — Resend falló)\n"
            "   Para: %s\n"
            "   Enlace: %s\n"
            "%s",
            "=" * 60,
            email,
            reset_url,
            "=" * 60,
        )

