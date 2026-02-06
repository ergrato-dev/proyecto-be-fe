"""
Módulo: config.py
Descripción: Configuración centralizada del backend usando Pydantic Settings.
¿Para qué? Cargar y validar TODAS las variables de entorno necesarias al iniciar la app.
           Si falta alguna variable o tiene un formato inválido, la app no arranca y muestra
           un error claro indicando cuál es el problema.
¿Impacto? Sin este módulo, las variables de entorno se leerían con os.getenv() sin validación,
          lo que podría causar errores silenciosos o difíciles de depurar en tiempo de ejecución.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuración de la aplicación cargada desde variables de entorno.

    ¿Qué? Clase que define todas las variables de entorno que necesita el backend.
    ¿Para qué? Centralizar la configuración en un solo lugar con validación automática.
    ¿Impacto? Pydantic valida tipos y valores al instanciar — si DATABASE_URL no es un string
              válido o si SECRET_KEY está vacía, la app falla inmediatamente con un error descriptivo.
    """

    # ────────────────────────────
    # 🗄️ Base de datos
    # ────────────────────────────
    # ¿Qué? URL de conexión a PostgreSQL en formato SQLAlchemy.
    # ¿Para qué? Conectar el backend con la base de datos.
    # ¿Impacto? Si es incorrecta, ninguna operación de lectura/escritura a la BD funcionará.
    DATABASE_URL: str

    # ────────────────────────────
    # 🔐 JWT y Seguridad
    # ────────────────────────────
    # ¿Qué? Clave secreta para firmar y verificar tokens JWT.
    # ¿Para qué? Garantizar que solo nuestro backend puede generar tokens válidos.
    # ¿Impacto? Si se filtra, un atacante podría generar tokens falsos y suplantar usuarios.
    SECRET_KEY: str

    # ¿Qué? Algoritmo criptográfico para firmar JWT (HS256 = HMAC con SHA-256).
    # ¿Para qué? Definir cómo se firma el token — HS256 es simétrico (misma clave firma y verifica).
    # ¿Impacto? Cambiar el algoritmo invalida todos los tokens existentes.
    ALGORITHM: str = "HS256"

    # ¿Qué? Tiempo de vida del access token en minutos.
    # ¿Para qué? Limitar la ventana de tiempo en que un token robado es útil.
    # ¿Impacto? Muy corto = el usuario debe re-autenticarse frecuentemente.
    #           Muy largo = mayor riesgo si el token es comprometido.
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15

    # ¿Qué? Tiempo de vida del refresh token en días.
    # ¿Para qué? Permitir al usuario obtener nuevos access tokens sin re-ingresar credenciales.
    # ¿Impacto? Define cuánto tiempo puede el usuario permanecer "logueado" sin volver a hacer login.
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ────────────────────────────
    # 📧 Email
    # ────────────────────────────
    # ¿Qué? Configuración del servidor SMTP para envío de emails.
    # ¿Para qué? Enviar enlaces de recuperación de contraseña al email del usuario.
    # ¿Impacto? Sin configuración SMTP válida, la funcionalidad de "forgot password" no funciona.
    MAIL_SERVER: str = "smtp.example.com"
    MAIL_PORT: int = 587
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@nn-company.com"
    MAIL_FROM_NAME: str = "NN Auth System"

    # ────────────────────────────
    # 🌐 URLs
    # ────────────────────────────
    # ¿Qué? URL base del frontend.
    # ¿Para qué? Construir enlaces de recuperación de contraseña y configurar CORS.
    # ¿Impacto? Si no coincide con la URL real del frontend, los enlaces de recovery no funcionan
    #           y las peticiones del frontend serán bloqueadas por CORS.
    FRONTEND_URL: str = "http://localhost:5173"

    # ¿Qué? Configuración del modelo Pydantic Settings.
    # ¿Para qué? Indicar que las variables se cargan desde el archivo .env en la carpeta be/.
    # ¿Impacto? Sin esto, Pydantic no lee el archivo .env y solo busca variables del sistema.
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


# ¿Qué? Instancia singleton de la configuración.
# ¿Para qué? Importar `settings` desde cualquier módulo sin re-instanciar la clase.
# ¿Impacto? Se crea UNA sola vez al importar — todas las variables se validan en ese momento.
#           Si falta alguna variable requerida, la app falla aquí con un error claro.
settings = Settings()
