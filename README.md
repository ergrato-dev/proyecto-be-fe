# 🔐 NN Auth System

<!--
  ¿Qué? Documentación principal del proyecto NN Auth System.
  ¿Para qué? Guiar a cualquier desarrollador o aprendiz para entender, configurar y ejecutar el proyecto.
  ¿Impacto? Sin este README, los nuevos colaboradores no sabrían cómo levantar el proyecto
  ni entenderían su propósito, arquitectura o convenciones.
-->

> **Proyecto educativo** — SENA, Ficha 3171599 | Febrero 2026

Sistema de autenticación completo para una empresa genérica **"NN"**, diseñado como ejercicio formativo.
Incluye registro de usuarios, login, cambio de contraseña y recuperación por email.

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación y Setup](#-instalación-y-setup)
- [Ejecución](#-ejecución)
- [Testing](#-testing)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Convenciones](#-convenciones)
- [Documentación Adicional](#-documentación-adicional)

---

## 🛠️ Stack Tecnológico

| Capa              | Tecnologías                                         |
| ----------------- | --------------------------------------------------- |
| **Backend**       | Python 3.12+, FastAPI, SQLAlchemy 2.0, Alembic, JWT |
| **Frontend**      | React 18+, Vite, TypeScript, TailwindCSS 4+         |
| **Base de datos** | PostgreSQL 17+ (Docker Compose)                     |
| **Email (dev)**   | Mailpit — captura SMTP local, UI en puerto 8025     |
| **Testing**       | pytest + httpx (BE), Vitest + Testing Library (FE)  |
| **Linting**       | ruff (Python), ESLint + Prettier (TypeScript)       |

---

## ✅ Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

| Herramienta        | Versión mínima | Verificar con            |
| ------------------ | -------------- | ------------------------ |
| **Python**         | 3.12+          | `python3 --version`      |
| **Node.js**        | 20 LTS+        | `node --version`         |
| **pnpm**           | 9+             | `pnpm --version`         |
| **Docker**         | 24+            | `docker --version`       |
| **Docker Compose** | 2.20+          | `docker compose version` |
| **Git**            | 2.40+          | `git --version`          |

> ⚠️ **Importante**: Usar **pnpm** como gestor de paquetes de Node.js. **Nunca usar npm ni yarn.**

> 🖥️ **Usuarios de Windows — leer antes de continuar**
> Todos los comandos de este proyecto usan sintaxis Bash (`source`, `export`, `/`, etc.).
> Usa siempre **Git Bash** como terminal — viene incluido al instalar
> [Git para Windows](https://git-scm.com/download/win).
> **No uses CMD ni PowerShell** — los comandos no funcionarán igual.

### Instalar pnpm (si no lo tienes)

```bash
# Opción recomendada — vía corepack (incluido con Node.js 16+)
corepack enable
corepack prepare pnpm@latest --activate

# Alternativa — instalación independiente
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

---

## 🚀 Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd proyecto
```

### 2. Levantar la base de datos

```bash
# Inicia PostgreSQL 17 + Mailpit (captura de emails) en contenedores Docker
docker compose up -d

# Verificar que están corriendo
docker compose ps
# Deberías ver nn_auth_db y nn_auth_mailpit con estado "healthy"
```

### 3. Configurar el Backend

```bash
cd be

# Crear entorno virtual de Python
python3 -m venv .venv

# Activar el entorno virtual
source .venv/bin/activate          # Linux/macOS y Windows (Git Bash) ← usar siempre
# source .venv/Scripts/activate    # Windows (Git Bash — ruta alternativa si la anterior falla)

# Instalar dependencias
pip install -r requirements.txt

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores si es necesario

# Ejecutar migraciones de base de datos
alembic upgrade head
```

### 4. Configurar el Frontend

```bash
cd fe

# Instalar dependencias con pnpm (¡NUNCA con npm!)
pnpm install

# Copiar y configurar variables de entorno
cp .env.example .env
```

---

## ▶️ Ejecución

### Levantar todo el sistema (3 terminales)

```bash
# Terminal 1 — Base de datos (si no está corriendo)
docker compose up -d

# Terminal 2 — Backend (FastAPI)
cd be && source .venv/bin/activate
uvicorn app.main:app --reload
# → API disponible en http://localhost:8000
# → Swagger UI en http://localhost:8000/docs  (solo si ENVIRONMENT=development, que es el default)

# Terminal 3 — Frontend (React + Vite)
cd fe && pnpm dev
# → App disponible en http://localhost:5173
```

> 📧 **Mailpit** — bandeja de entrada de emails de desarrollo: `http://localhost:8025`
> Aquí se capturan los emails de verificación de cuenta y recuperación de contraseña.

---

## 🧪 Testing

### Backend

```bash
cd be && source .venv/bin/activate

# Ejecutar todos los tests
pytest -v

# Ejecutar con cobertura
pytest --cov=app --cov-report=term-missing

# Ejecutar un test específico
pytest app/tests/test_auth.py -v
```

### Frontend

```bash
cd fe

# Ejecutar todos los tests
pnpm test

# Ejecutar en modo watch
pnpm test:watch

# Ejecutar con cobertura
pnpm test:coverage
```

### Linting

```bash
# Backend
cd be && ruff check app/ && ruff format app/

# Frontend
cd fe && pnpm lint && pnpm format
```

---

## 📁 Estructura del Proyecto

```
proyecto/
├── .github/copilot-instructions.md   # Reglas y convenciones del proyecto
├── .gitignore                        # Archivos ignorados por git
├── docker-compose.yml                # PostgreSQL 17 para desarrollo
├── README.md                         # ← Este archivo
├── _docs/                            # Documentación técnica
├── _assets/                          # Recursos estáticos
├── be/                               # Backend — FastAPI + Python
│   ├── app/                          # Código fuente
│   │   ├── main.py                   # Punto de entrada FastAPI
│   │   ├── config.py                 # Configuración (Pydantic Settings)
│   │   ├── database.py               # Conexión a PostgreSQL
│   │   ├── models/                   # Modelos ORM (User, PasswordResetToken, EmailVerificationToken)
│   │   ├── schemas/                  # Schemas Pydantic (request/response)
│   │   ├── routers/                  # Endpoints (auth, users)
│   │   ├── services/                 # Lógica de negocio
│   │   ├── utils/                    # Utilidades (security, email)
│   │   └── tests/                    # Tests con pytest
│   ├── alembic/                      # Migraciones de BD
│   └── requirements.txt              # Dependencias Python
└── fe/                               # Frontend — React + Vite + TypeScript
    ├── src/
    │   ├── api/                      # Clientes HTTP
    │   ├── components/               # Componentes reutilizables
    │   ├── pages/                    # Páginas/vistas
    │   ├── hooks/                    # Custom hooks
    │   ├── context/                  # Context providers
    │   └── types/                    # Tipos TypeScript
    ├── package.json                  # Dependencias (pnpm)
    └── vite.config.ts                # Configuración de Vite
```

---

## 📏 Convenciones

| Aspecto              | Regla                                            |
| -------------------- | ------------------------------------------------ |
| Nomenclatura técnica | Inglés (variables, funciones, clases, endpoints) |
| Comentarios/docs     | Español (con ¿Qué? ¿Para qué? ¿Impacto?)         |
| Commits              | Conventional Commits en inglés + What/For/Impact |
| Python               | PEP 8 + type hints obligatorios + ruff           |
| TypeScript           | strict mode + ESLint + Prettier                  |
| Gestor de paquetes   | `venv` (Python), `pnpm` (Node.js)                |
| Testing              | Código generado = código probado                 |

Para las reglas completas, ver [`.github/copilot-instructions.md`](.github/copilot-instructions.md).

---

## 📚 Documentación Adicional

| Documento                                                                                    | Descripción                                              |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [`_docs/referencia-tecnica/architecture.md`](_docs/referencia-tecnica/architecture.md)       | Arquitectura general, flujos y decisiones técnicas       |
| [`_docs/referencia-tecnica/api-endpoints.md`](_docs/referencia-tecnica/api-endpoints.md)     | Todos los endpoints con parámetros, respuestas y errores |
| [`_docs/referencia-tecnica/database-schema.md`](_docs/referencia-tecnica/database-schema.md) | Esquema ER, tablas, columnas y migraciones               |
| [`_docs/conceptos/owasp-top-10.md`](_docs/conceptos/owasp-top-10.md)                         | Implementación del OWASP Top 10 2021                     |
| [`_docs/conceptos/accesibilidad-aria-wcag.md`](_docs/conceptos/accesibilidad-aria-wcag.md)   | Estándares ARIA/WCAG 2.1 AA aplicados                    |
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md)                         | Reglas y convenciones del proyecto                       |

---

## 🎓 Propósito Educativo

Este proyecto está diseñado para **aprender haciendo**. Cada archivo, función y componente incluye comentarios pedagógicos que explican:

- **¿Qué?** — Qué hace este código
- **¿Para qué?** — Por qué existe y cuál es su propósito
- **¿Impacto?** — Qué pasa si no existiera o si se implementa mal

> _"La calidad no es una opción, es una obligación."_

---

## 📄 Licencia

Proyecto educativo — SENA, Ficha 3171599. Uso exclusivamente académico.
