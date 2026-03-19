"""
Módulo: utils/audit_log.py
Descripción: Registro de auditoría de seguridad para eventos críticos del sistema.
¿Para qué? Registrar intentos de login, cambios de contraseña y otros eventos sensibles
           con el fin de detectar, investigar y responder a actividades sospechosas.
¿Impacto? Corresponde al ítem A09 del OWASP Top 10 (Security Logging and Monitoring Failures).
          Sin registros de auditoría, un ataque de fuerza bruta podría pasar completamente
          desapercibido y sería imposible reconstruir qué ocurrió en una investigación
          post-incidente o auditoría de cumplimiento.
"""

import json
import logging
from datetime import datetime, timezone


# ¿Qué? Logger dedicado exclusivamente para eventos de seguridad.
# ¿Para qué? Separar los logs de seguridad del log general de la aplicación,
#            facilitando su análisis y posible envío a un SIEM especializado
#            (Security Information and Event Management).
# ¿Impacto? Al usar un logger con nombre propio ("security.audit"), se pueden
#           configurar handlers específicos en producción:
#           - Archivo separado "/var/log/app/security.log"
#           - Servicio externo (AWS CloudWatch, Datadog, Splunk)
#           - Alertas automáticas ante ciertos patrones
security_logger = logging.getLogger("security.audit")

# ¿Qué? Configura un handler básico de consola para desarrollo.
# ¿Para qué? Ver los eventos de auditoría en la terminal durante el desarrollo.
# ¿Impacto? En producción, este handler se reemplazaría por uno que escribe
#           a un archivo o servicio externo. El nivel WARNING asegura que solo
#           los eventos relevantes se muestren (no DEBUG/INFO de otros módulos).
if not security_logger.handlers:
    _handler = logging.StreamHandler()
    _handler.setFormatter(logging.Formatter("[AUDIT] %(message)s"))
    security_logger.addHandler(_handler)
    security_logger.setLevel(logging.WARNING)


# ════════════════════════════════════════════════════════════════
# 🔧 Función interna de registro
# ════════════════════════════════════════════════════════════════


def _audit(event: str, **kwargs: object) -> None:
    """Registra un evento de auditoría en formato JSON estructurado.

    ¿Qué? Función interna que formatea y escribe el evento en el log de seguridad.
    ¿Para qué? Centralizar el formato de todos los eventos para consistencia y
               facilidad de parseo automatizado.
    ¿Impacto? El formato JSON estructurado permite procesar los logs automáticamente
              con herramientas como ELK Stack, Splunk o Datadog, habilitando
              dashboards de seguridad, alertas y análisis de patrones.

    Args:
        event: Identificador del evento en UPPER_SNAKE_CASE (ej: "LOGIN_FAILED").
        **kwargs: Campos adicionales del evento (email redactado, IP, motivo, etc.).
    """
    log_entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event": event,
        **kwargs,
    }
    # ¿Qué? Se usa WARNING como nivel porque son eventos relevantes de seguridad.
    # ¿Para qué? Distinguirlos de logs de INFO (normales) y ERROR (fallos del sistema).
    # ¿Impacto? Los sistemas de monitoreo suelen filtrar logs por nivel —
    #           WARNING garantiza que estos eventos no se pierdan en el ruido.
    security_logger.warning(json.dumps(log_entry, default=str))


# ════════════════════════════════════════════════════════════════
# 📋 Eventos de auditoría — API pública del módulo
# ════════════════════════════════════════════════════════════════


def log_login_success(email: str, ip: str | None = None) -> None:
    """Registra un inicio de sesión exitoso.

    ¿Qué? Evento de auditoría para logins que completaron correctamente.
    ¿Para qué? Detectar logins desde IPs inusuales o en horarios inesperados.
               Un login legítimo a las 3am desde una IP en otra región es
               sospechoso incluso si las credenciales eran correctas.
    ¿Impacto? Permite correlacionar accesos legítimos con actividad posterior
              sospechosa (ej: login exitoso seguido de exfiltración de datos).

    Args:
        email: Email del usuario — se redacta antes de loguear.
        ip: Dirección IP del cliente (None si no está disponible).
    """
    _audit("LOGIN_SUCCESS", email=_redact_email(email), ip=ip)


def log_login_failed(email: str, reason: str, ip: str | None = None) -> None:
    """Registra un intento de login fallido.

    ¿Qué? Evento de auditoría para intentos de login que no prosperaron.
    ¿Para qué? Detectar ataques de fuerza bruta — muchos intentos fallidos
               desde la misma IP o contra el mismo email son señales de alarma.
               Sin este log, un atacante podría intentar 10,000 contraseñas
               sin dejar ningún rastro.
    ¿Impacto? NUNCA registrar la contraseña ingresada — solo el email (redactado)
              y un motivo genérico. Si el motivo diferencia "email no existe" de
              "contraseña incorrecta", estarías habilitando enumeración de usuarios
              incluso en los logs.

    Args:
        email: Email intentado — se redacta la parte local para privacidad.
        reason: Motivo genérico del fallo (nunca "email no existe" vs "password wrong").
        ip: Dirección IP del cliente si está disponible.
    """
    _audit("LOGIN_FAILED", email=_redact_email(email), reason=reason, ip=ip)


def log_password_changed(user_id: str, ip: str | None = None) -> None:
    """Registra un cambio de contraseña exitoso.

    ¿Qué? Evento de auditoría cuando un usuario autenticado cambia su contraseña.
    ¿Para qué? Alertar si hay cambios de contraseña que el usuario no reconoce,
               lo que indicaría que la cuenta fue comprometida y el atacante
               intentó bloquear al usuario legítimo.
    ¿Impacto? Se usa user_id en lugar del email — mínima exposición de PII
              (Información Personal Identificable) en los logs de seguridad.

    Args:
        user_id: ID UUID del usuario que cambió su contraseña.
        ip: Dirección IP del cliente si está disponible.
    """
    _audit("PASSWORD_CHANGED", user_id=user_id, ip=ip)


def log_password_reset_requested(ip: str | None = None) -> None:
    """Registra una solicitud de recuperación de contraseña.

    ¿Qué? Evento de auditoría cuando se solicita un reset de contraseña.
    ¿Para qué? Detectar abuso masivo del endpoint forgot-password, que podría
               usarse para spam de emails o para enumerar qué emails existen
               en el sistema (aunque el endpoint retorna respuesta genérica).
    ¿Impacto? NO se registra el email solicitado — prevenir correlación entre
              solicitudes de reset y emails válidos. El rate limiting es la
              primera línea de defensa; este log es la segunda (detección).

    Args:
        ip: Dirección IP del cliente si está disponible.
    """
    _audit("PASSWORD_RESET_REQUESTED", ip=ip)


def log_email_verified(user_id: str) -> None:
    """Registra la verificación exitosa de un email.

    ¿Qué? Evento de auditoría cuando un usuario completa la verificación de cuenta.
    ¿Para qué? Trazar el ciclo de vida completo de la activación de cuentas.
               Una verificación de email realizada mucho después del registro
               (ej: días después) podría indicar un token filtrado.
    ¿Impacto? Ayuda a detectar si alguien interceptó y usó un token de
              verificación ajeno para activar una cuenta con un email falso.

    Args:
        user_id: ID UUID del usuario cuyo email fue verificado.
    """
    _audit("EMAIL_VERIFIED", user_id=user_id)


def log_rate_limit_hit(endpoint: str, ip: str | None = None) -> None:
    """Registra cuando un cliente supera el límite de peticiones (rate limit).

    ¿Qué? Evento de seguridad crítico — posible ataque de fuerza bruta o DoS.
    ¿Para qué? Los rate limits sin logging son inefectivos: sí bloquean el ataque
               actual pero no permiten tomar acciones proactivas (bloquear la IP
               en el firewall, alertar al equipo de seguridad, reportar el incidente).
    ¿Impacto? Un evento "RATE_LIMIT_HIT" repetido desde la misma IP es señal
              de un ataque activo. En producción, este evento debería disparar:
              1. Alerta inmediata al equipo de seguridad
              2. Bloqueo temporal de la IP en el WAF (Web Application Firewall)
              3. Registro en un sistema de incidentes

    Args:
        endpoint: Ruta del endpoint que recibió el exceso de peticiones.
        ip: Dirección IP del atacante — es la información más valiosa aquí.
    """
    _audit("RATE_LIMIT_HIT", endpoint=endpoint, ip=ip)


# ════════════════════════════════════════════════════════════════
# 🔒 Utilidades internas
# ════════════════════════════════════════════════════════════════


def _redact_email(email: str) -> str:
    """Redacta un email para uso seguro en logs de auditoría.

    ¿Qué? Reemplaza la mayor parte de la parte local del email con asteriscos.
    ¿Para qué? Los logs no deben contener PII (Información Personal Identificable)
               completa — solo suficiente información para detectar patrones.
    ¿Impacto? "us***@nn-company.com" es útil para detectar que el mismo email
              recibe múltiples intentos fallidos, sin exponer el email completo.

    Ejemplos:
        "user@example.com"   → "us***@example.com"
        "ab@example.com"     → "**@example.com"
        "a@example.com"      → "*@example.com"

    Args:
        email: Email a redactar.

    Returns:
        Email con la parte local parcialmente oculta con asteriscos.
    """
    if "@" not in email:
        return "***"
    local, domain = email.split("@", 1)
    if len(local) <= 1:
        return f"*@{domain}"
    if len(local) <= 2:
        return f"{local[0]}*@{domain}"
    return f"{local[:2]}{'*' * (len(local) - 2)}@{domain}"
