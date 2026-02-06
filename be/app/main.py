"""
Módulo: main.py
Descripción: Punto de entrada de la aplicación FastAPI — configura y arranca el servidor.
¿Para qué? Crear la instancia principal de FastAPI, configurar CORS, incluir routers
           y definir el ciclo de vida de la aplicación.
¿Impacto? Este es el archivo que Uvicorn ejecuta. Sin él, no hay servidor.
          Todo endpoint, middleware y configuración se conecta aquí.
"""

from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router


# ¿Qué? Función de ciclo de vida (lifespan) que se ejecuta al iniciar y al cerrar la app.
# ¿Para qué? Realizar tareas de inicialización (ej: verificar conexión a BD) al arrancar
#            y tareas de limpieza (ej: cerrar conexiones) al apagar.
# ¿Impacto? Sin lifespan, no hay un lugar centralizado para código de startup/shutdown,
#           lo que podría causar fugas de recursos o conexiones huérfanas.
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Gestiona el ciclo de vida de la aplicación FastAPI.

    ¿Qué? Context manager async que se ejecuta al inicio y al cierre del servidor.
    ¿Para qué? Ejecutar lógica de arranque (verificaciones, logs) y limpieza (cerrar pools).
    ¿Impacto? El código antes de `yield` se ejecuta al INICIAR.
              El código después de `yield` se ejecuta al CERRAR.
    """
    # --- Startup ---
    print("🚀 NN Auth System — Backend iniciando...")
    print(f"📡 CORS habilitado para: {settings.FRONTEND_URL}")
    yield
    # --- Shutdown ---
    print("🛑 NN Auth System — Backend cerrando...")


# ¿Qué? Instancia principal de la aplicación FastAPI.
# ¿Para qué? Es el objeto central que recibe las peticiones HTTP, las enruta a los
#            endpoints correctos y devuelve las respuestas.
# ¿Impacto? Los metadatos (title, description, version) aparecen automáticamente
#           en la documentación interactiva de Swagger UI (/docs).
app = FastAPI(
    title="NN Auth System",
    description=(
        "🔐 Sistema de autenticación completo para la empresa NN. "
        "Incluye registro, login, cambio y recuperación de contraseña. "
        "Proyecto educativo — SENA, Ficha 3171599."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ¿Qué? Middleware CORS (Cross-Origin Resource Sharing).
# ¿Para qué? Permitir que el frontend (http://localhost:5173) haga peticiones HTTP al backend
#            (http://localhost:8000), que técnicamente está en un "origen" diferente.
# ¿Impacto? Sin CORS, el navegador BLOQUEA todas las peticiones del frontend al backend
#           por política de seguridad del mismo origen (Same-Origin Policy).
#           allow_credentials=True permite enviar cookies/headers de autenticación.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,  # Frontend de desarrollo (http://localhost:5173)
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permitir todos los headers (incluyendo Authorization)
)


# ────────────────────────────
# 📍 Incluir routers
# ────────────────────────────

# ¿Qué? Registro de los routers de autenticación y usuarios en la app.
# ¿Para qué? Conectar todos los endpoints definidos en los módulos routers/ a la aplicación
#            principal, para que FastAPI pueda enrutarlos correctamente.
# ¿Impacto? Sin include_router(), los endpoints de auth y users NO existirían — las
#           peticiones a /api/v1/auth/* y /api/v1/users/* retornarían 404.
app.include_router(auth_router)
app.include_router(users_router)


# ────────────────────────────
# 📍 Endpoint de salud (health check)
# ────────────────────────────
@app.get(
    "/api/v1/health",
    tags=["health"],
    summary="Verificar estado del servidor",
)
async def health_check() -> dict[str, str]:
    """Endpoint de verificación de salud del servidor.

    ¿Qué? Retorna un JSON simple indicando que el servidor está activo.
    ¿Para qué? Permitir a herramientas de monitoreo, Docker healthchecks o desarrolladores
              verificar rápidamente que el backend responde.
    ¿Impacto? Si este endpoint no responde, significa que el servidor está caído.
              Es el primer endpoint a probar tras levantar el servidor.

    Returns:
        Diccionario con el estado del servidor y el nombre del proyecto.
    """
    return {
        "status": "healthy",
        "project": "NN Auth System",
        "version": "0.1.0",
    }
