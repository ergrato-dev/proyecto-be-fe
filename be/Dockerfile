# ========================
# NN Auth System — Dockerfile del Backend
# ========================
# ¿Qué? Imagen Docker multi-stage para el backend FastAPI.
# ¿Para qué? Separar la instalación de dependencias (builder) del runtime final,
#            generando una imagen más pequeña y segura para producción/desarrollo.
# ¿Impacto? Sin Dockerfile, el backend sólo puede ejecutarse en entornos con Python
#           configurado manualmente. Con él, corre en cualquier máquina que tenga Docker.

# ────────────────────────────
# Stage 1: builder
# ¿Qué? Instala todas las dependencias Python en un venv aislado.
# ¿Para qué? Aprovechar el caché de capas de Docker — si requirements.txt no cambia,
#            esta capa se reutiliza y el build es mucho más rápido.
# ¿Impacto? Sin este stage, cada rebuild reinstalaría todas las dependencias desde cero.
# ────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# ¿Qué? Crea un entorno virtual en /opt/venv para instalar dependencias.
# ¿Para qué? Aislar los paquetes del sistema base Python — buena práctica igual
#            que usar .venv en desarrollo local.
# ¿Impacto? Permite copiar el venv completo al stage runtime de forma limpia.
RUN python -m venv /opt/venv

# Activar el venv para los comandos RUN siguientes
ENV PATH="/opt/venv/bin:$PATH"

# ¿Qué? Copia SOLO el archivo de dependencias antes que el resto del código.
# ¿Para qué? Optimizar el caché de Docker — si el código cambia pero requirements.txt
#            no, Docker reutiliza la capa de instalación de paquetes.
# ¿Impacto? Build hasta 10x más rápido en iteraciones del día a día.
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt


# ────────────────────────────
# Stage 2: runtime
# ¿Qué? Imagen final que se ejecuta en producción/desarrollo.
# ¿Para qué? Contiene solo lo necesario para correr la app — no las herramientas de build.
# ¿Impacto? Imagen más pequeña (~200MB vs ~500MB+), menor superficie de ataque.
# ────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /app

# ¿Qué? Variables de entorno que mejoran el comportamiento de Python en contenedores.
# ¿Para qué?
#   PYTHONDONTWRITEBYTECODE=1 → No genera archivos .pyc (innecesarios en contenedor).
#   PYTHONUNBUFFERED=1        → Los logs aparecen en tiempo real (sin buffer).
# ¿Impacto? Sin PYTHONUNBUFFERED, los logs del servidor podrían aparecer con retraso
#           o no aparecer si el contenedor falla antes de vaciar el buffer.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

# ¿Qué? Copia el venv con todas las dependencias instaladas desde el stage builder.
# ¿Para qué? Evitar reinstalar paquetes en el stage runtime — el builder ya lo hizo.
# ¿Impacto? El stage runtime no necesita pip ni compiladores C, lo que reduce la imagen.
COPY --from=builder /opt/venv /opt/venv

# ¿Qué? Copia el código fuente completo del backend al contenedor.
# ¿Para qué? Proveer al servidor uvicorn todos los módulos de la aplicación.
# ¿Impacto? Los archivos en .dockerignore NO se copian (ej: .env, .venv local, __pycache__).
COPY . .

# ¿Qué? Documenta que el contenedor escucha en el puerto 8000.
# ¿Para qué? Convención Docker que informa a herramientas y operadores qué puerto usar.
# ¿Impacto? No abre el puerto por sí solo — docker-compose.yml define el mapeo real.
EXPOSE 8000

# ¿Qué? Comando de inicio del contenedor.
# ¿Para qué? Primero ejecuta las migraciones pendientes de Alembic, luego arranca
#            Uvicorn escuchando en todas las interfaces (0.0.0.0) en el puerto 8000.
# ¿Impacto? Sin `alembic upgrade head`, el backend podría arrancar con un esquema de
#           BD desactualizado, causando errores en las primeras operaciones.
#           Sin `--host 0.0.0.0`, Uvicorn escucharía solo en localhost y el contenedor
#           no sería accesible desde fuera.
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
