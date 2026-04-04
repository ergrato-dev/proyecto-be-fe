---
description: "Revisa código (backend o frontend) en busca de vulnerabilidades del OWASP Top 10. Devuelve un informe con severidad, descripción y corrección concreta para cada hallazgo. Usar antes de hacer commit de código de seguridad crítica."
name: "Revisión de seguridad OWASP Top 10"
argument-hint: "Pega o describe el código a revisar, o usa #selection para revisar el código seleccionado"
agent: "agent"
---

# Revisión de seguridad OWASP Top 10 — NN Auth System

Realiza una auditoría de seguridad exhaustiva del código indicado, enfocada en el
OWASP Top 10 (2021) en el contexto de una API REST con FastAPI + React/TypeScript.

## Categorías OWASP a evaluar

### A01 — Broken Access Control

- ¿Los endpoints protegidos verifican `get_current_user`?
- ¿Se exponen datos de otros usuarios sin validar ownership?
- ¿Las rutas protegidas del frontend usan `ProtectedRoute`?
- ¿Los tokens JWT se validan correctamente (firma, expiración, claims)?

### A02 — Cryptographic Failures

- ¿Se almacenan passwords en texto plano o con hashing débil (MD5, SHA-1)?
- ¿Se usa bcrypt vía `passlib` para hashing?
- ¿Los tokens JWT usan HS256 con una `SECRET_KEY` de al menos 32 caracteres?
- ¿Se transmiten datos sensibles sin HTTPS (en producción)?
- ¿Aparecen secrets o credenciales hardcodeadas en el código?

### A03 — Injection

- ¿Se usan queries SQL raw sin parametrizar? (debe ser solo SQLAlchemy ORM)
- ¿Se construyen queries concatenando strings con inputs del usuario?
- ¿Los inputs del usuario se validan con Pydantic antes de usarse?
- ¿Hay riesgo de XSS en el frontend (uso de `dangerouslySetInnerHTML`)?

### A04 — Insecure Design

- ¿Los mensajes de error de auth revelan si un email existe o no?
- ¿Hay rate limiting en endpoints de autenticación (`slowapi`)?
- ¿Los tokens de reset tienen expiración corta (máx 1 hora)?
- ¿Se marcan los tokens usados para prevenir replay attacks?

### A05 — Security Misconfiguration

- ¿CORS permite `allow_origins=["*"]` en producción?
- ¿Las variables de entorno sensibles están en `.env` y no versionadas?
- ¿El modo debug de FastAPI está desactivado en producción?
- ¿Se exponen stacks traces completos al cliente?

### A06 — Vulnerable and Outdated Components

- ¿Las versiones en `requirements.txt` y `package.json` están pineadas con `==` / sin `^`?
- ¿`pip-audit` y `pnpm audit` reportan 0 CVEs?

### A07 — Identification and Authentication Failures

- ¿Los passwords tienen fortaleza mínima validada (≥8 cars, mayúscula, número)?
- ¿Los refresh tokens tienen duración máx 7 días?
- ¿Se invalidan los tokens al cambiar/resetear contraseña?
- ¿El login no revela si el error es "email incorrecto" vs "password incorrecto"?

### A08 — Software and Data Integrity Failures

- ¿Los tokens JWT son verificados antes de usarse (no solo decodificados)?
- ¿Se valida el tipo de token (`access` vs `refresh`) antes de aceptarlo?

### A09 — Security Logging and Monitoring Failures

- ¿Se loggean intentos de autenticación fallidos?
- ¿Se registran operaciones sensibles (cambio de contraseña, reset)?
- ¿Los logs NO contienen passwords, tokens completos ni datos personales sensibles?

### A10 — Server-Side Request Forgery (SSRF)

- ¿El backend hace requests HTTP a URLs controladas por el usuario?
- ¿Se valida y sanitiza cualquier URL recibida como input?

## Formato del informe

Para cada hallazgo, reportar:

````
## [CRÍTICO/ALTO/MEDIO/BAJO] — <Nombre corto del hallazgo>

**Categoría OWASP:** A0X — Nombre
**Archivo/línea:** ruta/al/archivo.py:123
**¿Qué ocurre?** Descripción del problema en 1-2 líneas.
**¿Por qué es peligroso?** Impacto concreto si se explota.
**Corrección:**
```código corregido```
````

Si no se encuentran vulnerabilidades, indicarlo explícitamente con:
`✅ No se encontraron vulnerabilidades del OWASP Top 10 en el código revisado.`

## Código a revisar

$input
