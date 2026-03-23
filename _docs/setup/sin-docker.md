# Setup sin Docker — NN Auth System

<!--
  ¿Qué? Guía paso a paso para correr el proyecto sin Docker, instalando
         PostgreSQL, Python y Node.js directamente en el sistema operativo.
  ¿Para qué? Útil cuando Docker no está disponible, cuando se quiere depurar
             el backend directamente con uvicorn --reload, o cuando se prefiere
             control total sobre cada servicio.
  ¿Impacto? Más pasos de configuración inicial, pero mayor flexibilidad para
             desarrollo activo: hot-reload nativo, debuggers de IDE, etc.
-->

> **Modo recomendado para:** desarrollo activo, depuración con IDE,
> entornos donde Docker no está disponible o no se puede instalar.

Cada servicio corre directamente en el sistema operativo:

| Servicio   | Cómo corre                    | URL / Puerto          |
| ---------- | ----------------------------- | --------------------- |
| PostgreSQL | Instalado en el sistema local | `localhost:5432`      |
| Backend    | `uvicorn` con `.venv` activo  | http://localhost:8000 |
| Frontend   | `pnpm dev` (Vite dev server)  | http://localhost:5173 |
| Mailpit    | Binario o Docker (opcional)   | http://localhost:8025 |

---

## Prerrequisitos

Instala las siguientes herramientas antes de comenzar:

| Herramienta    | Versión mínima | Verificar con       | Descargar                                                    |
| -------------- | -------------- | ------------------- | ------------------------------------------------------------ |
| **Python**     | 3.12+          | `python3 --version` | https://www.python.org/downloads/                            |
| **Node.js**    | 20 LTS+        | `node --version`    | https://nodejs.org/                                          |
| **pnpm**       | 9+             | `pnpm --version`    | `corepack enable && corepack prepare pnpm@latest --activate` |
| **PostgreSQL** | 17+            | `psql --version`    | https://www.postgresql.org/download/                         |
| **Git**        | 2.40+          | `git --version`     | https://git-scm.com/downloads                                |

> ⚠️ **Nunca usar `npm` ni `yarn`** — solo `pnpm` para instalar dependencias de Node.js.

> 🖥️ **Windows**: Usar siempre **Git Bash** como terminal.
> Los comandos `source`, `export` y rutas con `/` no funcionan en CMD ni PowerShell.

### Instalar pnpm (si no lo tienes)

```bash
# Opción recomendada — vía corepack (incluido con Node.js 16+)
corepack enable
corepack prepare pnpm@latest --activate

# Alternativa — instalación independiente
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Instalar PostgreSQL

**Ubuntu / Debian:**

```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql   # iniciar automáticamente al arrancar
```

**macOS (Homebrew):**

```bash
brew install postgresql@17
brew services start postgresql@17
```

**Windows:**
Descargar el instalador gráfico desde https://www.postgresql.org/download/windows/
El instalador incluye `psql`, `pgAdmin` y el servicio de Windows.

---

## Paso 1 — Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd proyecto
```

---

## Paso 2 — Preparar PostgreSQL local

Crear el usuario y la base de datos que el backend necesita:

```bash
# Conectarse a PostgreSQL como superusuario
sudo -u postgres psql          # Linux
psql -U postgres               # macOS / Windows (Git Bash)
```

Dentro de la consola de PostgreSQL, ejecutar:

```sql
-- Crear el usuario de la aplicación
CREATE USER nn_user WITH PASSWORD 'nn_password';

-- Crear la base de datos
CREATE DATABASE nn_auth_db OWNER nn_user;

-- Dar todos los privilegios
GRANT ALL PRIVILEGES ON DATABASE nn_auth_db TO nn_user;

-- Salir
\q
```

Verificar la conexión:

```bash
psql -U nn_user -d nn_auth_db -h localhost -c "SELECT version();"
# Deberías ver la versión de PostgreSQL instalada
```

---

## Paso 3 — Configurar el Backend

### 3.1 Crear el entorno virtual de Python

```bash
cd be

# Crear el entorno virtual (solo la primera vez)
python3 -m venv .venv

# Activar el entorno virtual
source .venv/bin/activate          # Linux / macOS / Windows (Git Bash)
# source .venv/Scripts/activate    # Windows (Git Bash — ruta alternativa si la anterior falla)

# Verificar que el venv está activo — deberías ver (.venv) al inicio del prompt
python --version
# → Python 3.12.x
```

> ⚠️ **Importante**: Activar el entorno virtual **cada vez** que abras una terminal nueva
> antes de ejecutar cualquier comando de Python.

### 3.2 Instalar dependencias

```bash
# Con el .venv activo:
pip install -r requirements.txt

# Verificar instalación
pip list | grep fastapi
# → fastapi   0.115.x
```

### 3.3 Configurar variables de entorno

```bash
cp .env.example .env
```

Abrir `be/.env` y ajustar los valores para desarrollo local sin Docker:

```bash
# Base de datos — apuntar a localhost (no a "db" como en Docker)
DATABASE_URL=postgresql://nn_user:nn_password@localhost:5432/nn_auth_db

# JWT — dejar los valores del ejemplo son válidos para desarrollo
SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Frontend — Vite dev server corre en 5173
FRONTEND_URL=http://localhost:5173

# Email — ver Paso 5 para opciones de configuración
RESEND_API_KEY=
SMTP_HOST=
```

**Generar una `SECRET_KEY` segura (recomendado):**

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
# Copiar el resultado en SECRET_KEY= del .env
```

### 3.4 Ejecutar las migraciones de base de datos

```bash
# Con el .venv activo y desde be/
alembic upgrade head
```

Deberías ver algo como:

```
INFO  [alembic.runtime.migration] Running upgrade  -> a7c03fd8169f, create users and ...
INFO  [alembic.runtime.migration] Running upgrade a7c03fd8169f -> c3d5e7f9a1b2, ...
INFO  [alembic.runtime.migration] Running upgrade c3d5e7f9a1b2 -> d4e6f8a0b2c4, ...
```

Verificar que las tablas se crearon:

```bash
psql -U nn_user -d nn_auth_db -h localhost -c "\dt"
# Deberías ver: users, password_reset_tokens, email_verification_tokens
```

---

## Paso 4 — Configurar el Frontend

```bash
cd ../fe    # o `cd fe` desde la raíz del proyecto

# Instalar dependencias con pnpm (¡NUNCA con npm!)
pnpm install

# Copiar variables de entorno
cp .env.example .env
```

Verificar el contenido de `fe/.env`:

```bash
# URL del backend — el Vite dev server hace proxy al backend en este puerto
VITE_API_URL=http://localhost:8000
```

Este valor ya es correcto para desarrollo sin Docker — no hace falta cambiarlo.

---

## Paso 5 — Configurar emails (desarrollo local)

Tienes tres opciones para probar el envío de emails:

### Opción A — Sin emails (modo más simple)

Dejar las variables de email vacías en `be/.env`:

```bash
RESEND_API_KEY=
SMTP_HOST=
```

El backend imprimirá el enlace de verificación/recuperación directamente en los **logs**
de uvicorn. Copiar el enlace desde la terminal para usarlo.

### Opción B — Mailpit local (bandeja visual, recomendado)

Mailpit captura los emails en una UI web sin enviarlos a internet.

**Instalar Mailpit:**

```bash
# Linux/macOS — descarga el binario
curl -sL https://raw.githubusercontent.com/axllent/mailpit/develop/install.sh | bash

# O con Homebrew (macOS)
brew install mailpit
```

**Iniciar Mailpit** (en una terminal aparte):

```bash
mailpit
# → SMTP en localhost:1025
# → Web UI en http://localhost:8025
```

**Configurar `be/.env`:**

```bash
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USERNAME=
SMTP_PASSWORD=
```

Abrir http://localhost:8025 para ver los emails capturados.

### Opción C — Resend (emails reales, cuenta gratuita)

Obtener API key en https://resend.com (3,000 emails/mes gratuitos).

```bash
RESEND_API_KEY=re_tu_api_key_aqui
RESEND_FROM_EMAIL=onboarding@resend.dev   # dominio de prueba de Resend
RESEND_FROM_NAME=NN Auth System
SMTP_HOST=                                # dejar vacío
```

---

## Paso 6 — Levantar el sistema (3 terminales)

Necesitas 3 terminales abiertas simultáneamente:

### Terminal 1 — Backend (FastAPI)

```bash
cd be
source .venv/bin/activate   # activar siempre antes de uvicorn
uvicorn app.main:app --reload
```

Salida esperada:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [...] using WatchFiles
INFO:     Started server process [...]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

URLs disponibles:

- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### Terminal 2 — Frontend (React + Vite)

```bash
cd fe
pnpm dev
```

Salida esperada:

```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Terminal 3 — Mailpit (si usas la Opción B)

```bash
mailpit
```

---

## Paso 7 — Verificar que todo funciona

Abrir en el navegador:

| URL                          | Qué muestra                 |
| ---------------------------- | --------------------------- |
| http://localhost:5173        | Landing page del frontend   |
| http://localhost:8000/docs   | Swagger UI del backend      |
| http://localhost:8000/health | JSON `{"status": "ok"}`     |
| http://localhost:8025        | Mailpit (si está corriendo) |

Probar el flujo completo:

```bash
# 1. Registrar un usuario
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","first_name":"Test","last_name":"User","password":"Test1234"}'

# 2. Ver el email de verificación en Mailpit (http://localhost:8025)
#    o copiar el enlace de los logs de uvicorn (Terminal 1)

# 3. Iniciar sesión
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
# → Devuelve access_token y refresh_token
```

---

## Paso 8 — Ejecutar tests

### Backend

```bash
cd be && source .venv/bin/activate

# Todos los tests
pytest -v

# Con cobertura
pytest --cov=app --cov-report=term-missing

# Un módulo específico
pytest app/tests/test_auth.py -v
```

### Frontend

```bash
cd fe

# Todos los tests (modo run)
pnpm test

# Modo watch (re-ejecuta al guardar)
pnpm test:watch

# Con cobertura
pnpm test:coverage
```

### Linting y formateo

```bash
# Backend
cd be && source .venv/bin/activate
ruff check app/        # detectar errores
ruff format app/       # formatear código

# Frontend
cd fe
pnpm lint              # detectar errores
pnpm format            # formatear código
```

---

## Solución de problemas comunes

### "No module named 'fastapi'" o errores de importación

El entorno virtual no está activado:

```bash
cd be
source .venv/bin/activate      # Linux / macOS / Windows (Git Bash)
# Verificar: el prompt debe mostrar (.venv) al inicio
```

### "connection refused" al conectar a PostgreSQL

```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql     # Linux
brew services list | grep postgresql  # macOS

# Iniciar si está detenido
sudo systemctl start postgresql      # Linux
brew services start postgresql@17    # macOS

# Verificar credenciales
psql -U nn_user -d nn_auth_db -h localhost
```

### "FATAL: role 'nn_user' does not exist"

El Paso 2 (crear usuario y BD) no se completó:

```bash
sudo -u postgres psql
# Ejecutar los comandos CREATE USER y CREATE DATABASE del Paso 2
```

### Error de migración de Alembic

```bash
# Ver el estado actual
alembic current

# Revertir la última migración
alembic downgrade -1

# Volver a aplicar
alembic upgrade head
```

### "EADDRINUSE" — puerto 5173 o 8000 ya en uso

```bash
# Encontrar el proceso que usa el puerto (ej: 8000)
lsof -i :8000

# Terminar el proceso
kill -9 <PID>
```

### El frontend muestra errores de CORS o "Network Error"

Verificar:

1. El backend está corriendo en http://localhost:8000
2. `VITE_API_URL=http://localhost:8000` en `fe/.env`
3. `FRONTEND_URL=http://localhost:5173` en `be/.env`

---

## Resumen rápido

```bash
# ─── Setup inicial (una sola vez) ───
git clone <url> && cd proyecto

# PostgreSQL: crear usuario y BD (ver Paso 2)

# Backend
cd be && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # editar DATABASE_URL y FRONTEND_URL
alembic upgrade head

# Frontend
cd ../fe && pnpm install && cp .env.example .env

# ─── Día a día (3 terminales) ───
# T1: cd be && source .venv/bin/activate && uvicorn app.main:app --reload
# T2: cd fe && pnpm dev
# T3: mailpit (opcional)
```
