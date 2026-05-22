# Setup con Docker — NN Auth System

<!--
  ¿Qué? Guía paso a paso para levantar TODO el sistema usando Docker Compose.
  ¿Para qué? Permitir que cualquier desarrollador levante el proyecto con un solo comando,
             sin instalar Python, Node.js ni PostgreSQL en su máquina.
  ¿Impacto? Es la forma más rápida y reproducible de correr el proyecto.
             Docker garantiza que todos usen el mismo entorno de ejecución.
-->

> **Modo recomendado para:** demostraciones, pruebas rápidas, entornos de clase
> o cuando no quieres instalar dependencias en tu máquina.

Con Docker Compose, todos los servicios corren en contenedores:

| Servicio  | Qué es                         | Puerto host |
| --------- | ------------------------------ | ----------- |
| `db`      | PostgreSQL 17                  | 5432        |
| `be`      | FastAPI + Uvicorn              | 8000        |
| `fe`      | React + Nginx (build estático) | 3000        |
| `mailpit` | Servidor SMTP local + Web UI   | 8025 / 1025 |

---

## Prerrequisitos

Antes de comenzar, instala estas herramientas:

| Herramienta        | Versión mínima | Verificar con            | Descargar                           |
| ------------------ | -------------- | ------------------------ | ----------------------------------- |
| **Docker**         | 24+            | `docker --version`       | https://docs.docker.com/get-docker/ |
| **Docker Compose** | 2.20+          | `docker compose version` | Incluido con Docker Desktop         |
| **Git**            | 2.40+          | `git --version`          | https://git-scm.com/downloads       |

> ⚠️ **Windows**: Docker Desktop requiere WSL2 habilitado.
> Seguir la guía oficial: https://docs.docker.com/desktop/install/windows-install/

---

## Paso 1 — Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd proyecto
```

Verificar la estructura básica:

```bash
ls
# Deberías ver: be/  fe/  docker-compose.yml  README.md  ...
```

---

## Paso 2 — Configurar variables de entorno del Backend

Docker Compose carga las variables de `be/.env`. Crear ese archivo a partir del ejemplo:

```bash
cp be/.env.example be/.env
```

Abrir `be/.env` con cualquier editor y revisar los valores:

```bash
# Mínimo necesario para que funcione con Docker Compose — NO cambiar estos:
DATABASE_URL=postgresql://nn_user:nn_password@db:5432/nn_auth_db
SMTP_HOST=mailpit
SMTP_PORT=1025
FRONTEND_URL=http://localhost:3000
```

> ⚠️ Nota: dentro de Docker, la BD se llama `db` (nombre del servicio), **no** `localhost`.
> El frontend se sirve en el puerto `3000` (mapeado en `docker-compose.yml`).

**Opcional — email real con Resend:**
Si quieres que los emails lleguen a una bandeja real en lugar de Mailpit,
obtén una API key gratuita en https://resend.com y completa:

```bash
RESEND_API_KEY=re_tu_api_key_aqui
RESEND_FROM_EMAIL=onboarding@resend.dev   # dominio de prueba de Resend
SMTP_HOST=                                # dejar vacío para desactivar SMTP/Mailpit
```

---

## Paso 3 — Construir imágenes y levantar todos los servicios

### Opción A — Script automatizado (recomendado)

El proyecto incluye scripts que automatizan el arranque con healthchecks y resumen final:

```bash
# Primera vez (o cuando hay cambios en código o dependencias) — construye + levanta
./scripts/start.sh

# Arranque rápido sin reconstruir imágenes
./scripts/start.sh --no-build
```

El script:
- Crea `be/.env` automáticamente desde `be/.env.example` si no existe
- Construye las imágenes con `docker compose up --build -d`
- Espera a que cada servicio esté listo (healthchecks activos)
- Muestra un resumen con las URLs de todos los servicios

### Opción B — Comandos manuales

```bash
# Construye las imágenes de be y fe, y levanta todos los contenedores en segundo plano
docker compose up --build -d
```

La primera vez tarda más porque descarga las imágenes base y compila el frontend.
Las veces siguientes (sin `--build`) es mucho más rápido.

Verificar que todos los contenedores están corriendo y sanos:

```bash
docker compose ps
```

Deberías ver algo así:

```
NAME              IMAGE              STATUS
nn_auth_db        postgres:17-alpine Up (healthy)
nn_auth_mailpit   axllent/mailpit    Up
nn_auth_be        proyecto-be-fe-be  Up
nn_auth_fe        proyecto-be-fe-fe  Up
```

> Si algún servicio aparece como `Exit` o `unhealthy`, ver el Paso 6 — Solución de problemas.

---

## Paso 4 — Verificar que todo funciona

Abrir en el navegador:

| URL                               | Qué muestra                                          |
| --------------------------------- | ---------------------------------------------------- |
| http://localhost:3000             | Landing page del frontend                            |
| http://localhost:8000/docs        | Swagger UI del backend (solo en entorno development) |
| http://localhost:8000/api/v1/health | JSON `{"status": "healthy"}` — healthcheck de la API |
| http://localhost:8025             | Mailpit — bandeja de emails capturados               |

Probar la API directamente:

```bash
# Verificar que la API responde
curl http://localhost:8000/api/v1/health
# → {"status":"healthy","project":"NN Auth System","version":"0.1.0"}

# Registrar un usuario de prueba
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","full_name":"Test User","password":"Test1234"}'
```

Después del registro, ir a http://localhost:8025 para ver el email de verificación.

---

## Paso 5 — Comandos útiles del día a día

```bash
# ─── Ver logs ───
docker compose logs -f          # logs de todos los servicios en tiempo real
docker compose logs -f be        # solo logs del backend
docker compose logs -f fe        # solo logs del frontend (Nginx)
docker compose logs -f db        # solo logs de PostgreSQL

# ─── Detener y reiniciar (scripts del proyecto) ───
./scripts/stop.sh                # detiene contenedores, conserva datos de la BD
./scripts/stop.sh --volumes      # ídem + borra el volumen → ¡se pierden los datos! (pide confirmación)
./scripts/start.sh --no-build    # vuelve a iniciarlos sin reconstruir imágenes

# ─── Detener y reiniciar (comandos manuales equivalentes) ───
docker compose stop              # detiene los contenedores (conserva datos)
docker compose start             # vuelve a iniciarlos
docker compose restart be        # reinicia solo el backend

# ─── Reconstruir (cuando cambias código o dependencias) ───
./scripts/start.sh               # reconstruye + levanta + healthchecks (recomendado)
docker compose up --build        # equivalente manual
docker compose up --build be     # reconstruye solo el backend

# ─── Limpiar ───
docker compose down              # detiene y elimina contenedores (datos persisten en volumen)
docker compose down -v           # ídem + borra volúmenes → ¡se pierden los datos de la BD!

# ─── Ejecutar comandos dentro de un contenedor ───
docker compose exec be bash      # abrir shell en el contenedor del backend
docker compose exec db psql -U nn_user -d nn_auth_db  # consola de PostgreSQL
```

---

## Paso 6 — Ejecutar tests (dentro de los contenedores)

```bash
# Tests del backend
docker compose exec be pytest -v

# Tests del backend con cobertura
docker compose exec be pytest --cov=app --cov-report=term-missing

# Linting del backend
docker compose exec be ruff check app/
```

> El frontend en este modo sirve el build estático (producción).
> Para correr los tests del frontend, usar el modo **sin Docker** (ver [`sin-docker.md`](sin-docker.md)).

---

## Paso 7 — Solución de problemas comunes

### El contenedor `be` arranca y se cae inmediatamente

```bash
# Ver el error completo
docker compose logs be

# Causas frecuentes:
# 1. be/.env no existe → ejecutar: cp be/.env.example be/.env
# 2. DATABASE_URL apunta a localhost en lugar de db
#    → Revisar que sea: postgresql://nn_user:nn_password@db:5432/nn_auth_db
```

### Error "port is already in use"

```bash
# Verificar qué proceso usa el puerto (ej: 5432)
sudo lsof -i :5432

# Opción A — detener el proceso local
sudo kill -9 <PID>

# Opción B — cambiar el puerto en docker-compose.yml
# En el servicio db, cambiar "5432:5432" por "5433:5432"
# y luego: docker compose up -d
```

### Los emails no aparecen en Mailpit

```bash
# Verificar que Mailpit está corriendo
docker compose ps mailpit

# Verificar que SMTP_HOST=mailpit en be/.env (no localhost)
grep SMTP_HOST be/.env

# Ver los logs del backend para confirmar el envío
docker compose logs be | grep -i email
```

### Reconstruir desde cero (reset total)

```bash
# Detiene, elimina contenedores, imágenes y volúmenes
docker compose down -v
docker system prune -f

# Volver a construir
docker compose up --build -d
```

---

## Resumen rápido

```bash
# Setup inicial (una sola vez)
git clone <url> && cd proyecto
# be/.env se crea automáticamente desde .env.example al ejecutar el script
# Editarlo manualmente solo si quieres cambiar algún valor

# Levantar todo (construye imágenes + healthchecks + resumen de URLs)
./scripts/start.sh

# Arranques siguientes (sin reconstruir)
./scripts/start.sh --no-build

# Detener
./scripts/stop.sh
```
