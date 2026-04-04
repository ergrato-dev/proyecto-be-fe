---
description: "Genera un mensaje de commit Conventional Commits con cuerpo pedagógico (What/For/Impact) a partir de los cambios realizados. Usar antes de hacer git commit."
name: "Mensaje de commit"
argument-hint: "Describe brevemente los cambios realizados, o usa #changes para que el agente los analice"
agent: "agent"
---

# Generar mensaje de commit — NN Auth System

Analiza los cambios del workspace y genera un mensaje de commit siguiendo las
convenciones **Conventional Commits** del proyecto con cuerpo pedagógico.

## Formato requerido

```
type(scope): short description in english  ← máx 72 caracteres, sin punto final

For: <razón por la que se necesitaba este cambio>
Impact: <qué habilita o qué afecta este cambio en el sistema>
```

**Regla crítica**: la línea de asunto (primera línea) debe estar en **inglés**.
El cuerpo (`For:` / `Impact:`) puede estar en inglés o español.

## Tipos permitidos

| Tipo       | Cuándo usarlo                                        |
| ---------- | ---------------------------------------------------- |
| `feat`     | Nueva funcionalidad para el usuario                  |
| `fix`      | Corrección de un bug                                 |
| `docs`     | Solo cambios de documentación                        |
| `style`    | Formato, espacios (sin cambio de lógica)             |
| `refactor` | Reestructuración sin cambiar funcionalidad           |
| `test`     | Agregar o corregir tests                             |
| `chore`    | Tareas de mantenimiento, configuración, dependencias |
| `ci`       | Cambios en CI/CD                                     |
| `perf`     | Mejoras de rendimiento                               |

## Scopes del proyecto

| Scope      | Uso                                         |
| ---------- | ------------------------------------------- |
| `auth`     | Autenticación y autorización                |
| `user`     | Modelo/funcionalidad de usuario             |
| `db`       | Base de datos y migraciones                 |
| `api`      | Endpoints y routers                         |
| `ui`       | Componentes y estilos del frontend          |
| `config`   | Configuración y entorno                     |
| `test`     | Tests                                       |
| `deps`     | Dependencias (actualización, pinning, CVEs) |
| `i18n`     | Internacionalización y traducciones         |
| `docs`     | Documentación (README, \_docs/)             |
| `security` | Correcciones de seguridad                   |

## Ejemplos del proyecto

```bash
# Nueva funcionalidad
feat(auth): add email verification on registration

For: Prevent fake accounts and ensure users own the email they register with
Impact: Activates the email verification flow; unverified users cannot log in

# Corrección de bug
fix(auth): return 401 instead of 500 on expired refresh token

For: Expired tokens were causing unhandled exceptions in the refresh endpoint
Impact: Users now get a clear 401 and are redirected to login

# Actualización de dependencias con CVE
chore(deps): bump cryptography 46.0.5 → 46.0.6 — fix CVE-2026-34073

For: CVE-2026-34073 allows remote attackers to trigger undefined behavior
in cryptographic operations
Impact: Eliminates known vulnerability in JWT signing infrastructure

# Documentación
docs(api): add endpoint reference for PATCH /users/me/locale

For: Endpoint was missing from the API docs making it hard to discover
Impact: Developers can now find and test the locale update endpoint

# Migración de BD
chore(db): add locale column to users table

For: Store user language preference to persist it across sessions
Impact: Enables per-user i18n preference; requires running alembic upgrade head
```

## Instrucciones para el agente

1. Analizar los cambios realizados en el workspace (archivos modificados, creados o eliminados)
2. Determinar el tipo y scope más apropiados según las tablas anteriores
3. Redactar la línea de asunto en inglés, en tiempo imperativo ("add", "fix", "update"), máx 72 chars
4. Completar `For:` con la motivación del cambio (por qué era necesario)
5. Completar `Impact:` con el efecto concreto en el sistema
6. Si hay múltiples cambios independientes, sugerir separarlos en commits distintos
7. Presentar el mensaje listo para copiar/pegar

## Cambios a describir

$input
