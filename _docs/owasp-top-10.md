# OWASP Top 10 — Guía Pedagógica de Seguridad

<!--
  ¿Qué? Documento que explica cada una de las 10 vulnerabilidades más críticas
        según OWASP (Open Worldwide Application Security Project) y cómo este
        proyecto las mitiga o por qué no aplican.
  ¿Para qué? Educar al equipo sobre seguridad web práctica, mostrando no solo
             "qué hacer" sino "por qué hacerlo" con ejemplos del código real.
  ¿Impacto? Entender OWASP Top 10 es fundamental para cualquier desarrollador
             que trabaje en aplicaciones expuestas a internet. Este documento
             conecta la teoría con la implementación concreta del proyecto.
-->

> **Referencia oficial**: [OWASP Top 10 — 2021](https://owasp.org/Top10/)
> **Edición usada en este proyecto**: 2021 (vigente al inicio del proyecto, 2026)

---

## ¿Qué es OWASP?

**OWASP** (Open Worldwide Application Security Project) es una fundación internacional
sin fines de lucro dedicada a mejorar la seguridad del software. Su **Top 10** es el
listado de las vulnerabilidades más críticas y frecuentes en aplicaciones web, actualizado
periódicamente con datos reales de miles de organizaciones.

> Es el estándar de facto en la industria: muchas empresas exigen que sus desarrolladores
> conozcan y mitiguen el OWASP Top 10 antes de desplegar cualquier aplicación.

---

## Resumen de Estado — NN Auth System

| #   | Categoría                     | Estado          | Implementación                                        |
| --- | ----------------------------- | --------------- | ----------------------------------------------------- |
| A01 | Broken Access Control         | ✅ Implementado | JWT + `get_current_user` dependency                   |
| A02 | Cryptographic Failures        | ✅ Implementado | bcrypt + JWT HS256 + SECRET_KEY validator             |
| A03 | Injection                     | ✅ Implementado | SQLAlchemy ORM (no raw SQL)                           |
| A04 | Insecure Design               | ✅ Implementado | Rate limiting con slowapi                             |
| A05 | Security Misconfiguration     | ✅ Implementado | CORS explícito + security headers                     |
| A06 | Vulnerable Components         | ✅ Monitoreado  | Dependencias con versiones fijadas                    |
| A07 | Auth & Session Failures       | ✅ Implementado | Tokens de expiración corta + validación de contraseña |
| A08 | Software & Data Integrity     | ⚠️ Parcial      | Sin firma de código; tokens JWT firmados              |
| A09 | Logging & Monitoring Failures | ✅ Implementado | Audit log estructurado en `audit_log.py`              |
| A10 | Server-Side Request Forgery   | ✅ N/A          | La API no hace peticiones a URLs externas             |

---

## A01 — Broken Access Control (Control de Acceso Roto)

### ¿Qué es?

Un usuario puede acceder a recursos o realizar acciones **para las que no tiene permiso**.
Es la vulnerabilidad #1 del OWASP Top 10 — aparece en el 94% de las aplicaciones analizadas.

### Ejemplos de ataque

```
# Atacante autenticado como usuario "A" accede al perfil de usuario "B":
GET /api/v1/users/123  →  debería devolver 403, pero devuelve datos de "B"

# Usuario sin autenticar accede a un endpoint protegido:
GET /api/v1/users/me  (sin token)  →  debería devolver 401
```

### Cómo lo mitiga este proyecto

**Dependencia `get_current_user`** ([be/app/dependencies.py](../be/app/dependencies.py)):

```python
# Cada endpoint protegido declara esta dependencia:
@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

# Si el token es inválido, expirado o ausente → 401 automático
# El usuario solo puede acceder a SUS OWN datos — no hay parámetro user_id
# expuesto al cliente, se usa el ID extraído del token JWT
```

**Principio clave**: El ID del usuario nunca se acepta del cliente. Se extrae del
token JWT firmado por el servidor — el cliente no puede falsificarlo.

---

## A02 — Cryptographic Failures (Fallas Criptográficas)

### ¿Qué es?

Uso incorrecto o insuficiente de criptografía: contraseñas en texto plano, algoritmos
débiles (MD5, SHA1), claves cortas, o datos sensibles transmitidos sin cifrado.

### Ejemplos de ataque

```sql
-- Si las contraseñas se guardaran en texto plano o con MD5:
SELECT password FROM users WHERE email = 'victim@example.com';
-- Resultado: "miContra123" ← directamente usable por el atacante
-- Con MD5: "5d41402abc4b2a76b9719d911017c592" ← rompible en segundos con rainbow tables
```

### Cómo lo mitiga este proyecto

**1. bcrypt para contraseñas** ([be/app/utils/security.py](../be/app/utils/security.py)):

```python
# bcrypt es un hash adaptativo — costoso por diseño (work factor configurable)
# Incluye un salt aleatorio por contraseña → misma password, diferente hash
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)  # "$2b$12$..." — nunca texto plano

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

**¿Por qué bcrypt y no SHA-256?**
SHA-256 es un hash rápido — diseñado para velocidad. Un atacante con GPU puede probar
billones de SHA-256 por segundo. bcrypt es lento _por diseño_ — limita a miles de
intentos por segundo, haciendo el brute-force imprácticamente costoso.

**2. JWT con SECRET_KEY robusta** ([be/app/config.py](../be/app/config.py)):

```python
@field_validator("SECRET_KEY")
@classmethod
def validate_secret_key_strength(cls, v: str) -> str:
    if len(v) < 32:
        raise ValueError(
            "SECRET_KEY debe tener al menos 32 caracteres. "
            "Genera una con: openssl rand -hex 32"
        )
    return v
```

Una SECRET_KEY de menos de 32 caracteres puede romperse por fuerza bruta, permitiendo
al atacante generar tokens JWT válidos para cualquier usuario. 32 chars = 256 bits de entropía mínima.

**3. HTTPS en producción** (responsabilidad del despliegue):
El código no puede forzar HTTPS, pero la arquitectura (nginx como proxy) debe configurarlo.
Sin HTTPS, tokens y contraseñas viajan en texto plano por la red.

---

## A03 — Injection (Inyección)

### ¿Qué es?

Datos no confiables del usuario se interpretan como **comandos o consultas**, manipulando
la lógica interna de la aplicación. SQL Injection es el ejemplo clásico — también existe
XSS (HTML/JS injection), NoSQL injection, LDAP injection, etc.

### Ejemplo de SQL Injection

```python
# ❌ VULNERABLE — SQL construido concatenando strings del usuario:
email = request.json.get("email")  # atacante envía: ' OR '1'='1
query = f"SELECT * FROM users WHERE email = '{email}'"
# Query resultante: SELECT * FROM users WHERE email = '' OR '1'='1'
# → retorna TODOS los usuarios de la base de datos
```

### Cómo lo mitiga este proyecto

**SQLAlchemy ORM con queries parametrizadas** ([be/app/services/auth_service.py](../be/app/services/auth_service.py)):

```python
# ✅ SEGURO — SQLAlchemy siempre parametriza las queries automáticamente:
user = db.query(User).filter(User.email == email).first()
# SQL real generado: SELECT * FROM users WHERE email = $1 -- [email]
# El parámetro $1 se escapa antes de llegar a la BD → imposible inyectar SQL
```

**Validación Pydantic** ([be/app/schemas/user.py](../be/app/schemas/user.py)):

```python
class LoginRequest(BaseModel):
    email: EmailStr    # Valida formato de email — rechaza strings arbitrarios
    password: str      # Limitado por longitud mínima/máxima

# Si el cliente envía JSON malformado o tipos incorrectos → 422 automático
# Nunca llega al servicio con datos no validados
```

**XSS**: La API devuelve JSON, no HTML — por lo que XSS en el backend no aplica directamente.
En el frontend, React escapa automáticamente el contenido en JSX (`{variable}` → HTML-escaped).

---

## A04 — Insecure Design (Diseño Inseguro)

### ¿Qué es?

La arquitectura o el diseño del sistema carece de controles de seguridad fundamentales.
No se trata de bugs de implementación sino de **ausencia de mecanismos de defensa** desde
el diseño: falta de rate limiting, falta de multi-factor auth, flujos sin límites de reintentos.

### Ataque que esto previene: Brute Force

```
# Sin rate limiting, un atacante puede automatizar miles de intentos:
POST /api/v1/auth/login {"email": "admin@nn.com", "password": "password1"}
POST /api/v1/auth/login {"email": "admin@nn.com", "password": "password2"}
POST /api/v1/auth/login {"email": "admin@nn.com", "password": "password3"}
... (repetir 100.000 veces en pocos minutos)
```

### Cómo lo mitiga este proyecto

**Rate limiting con slowapi** ([be/app/utils/limiter.py](../be/app/utils/limiter.py) + [be/app/routers/auth.py](../be/app/routers/auth.py)):

```python
# Límites aplicados a los endpoints más sensibles:
@router.post("/login")
@limiter.limit("10/minute")     # máx 10 intentos de login por IP por minuto
async def login(request: Request, ...):
    ...

@router.post("/register")
@limiter.limit("5/minute")      # máx 5 registros por IP por minuto

@router.post("/forgot-password")
@limiter.limit("5/minute")      # máx 5 solicitudes de reset por IP por minuto
```

**¿Qué pasa cuando se supera el límite?**

```json
HTTP 429 Too Many Requests
{"error": "Rate limit exceeded: 10 per 1 minute"}
```

**Por qué 10/min para login y 5/min para register/forgot?**

- Login: un usuario legítimo que escribe mal su contraseña necesitaría 2-3 intentos máximo.
  10 intentos por minuto es cómodo para uso normal pero imposible para brute force masivo.
- Register/forgot-password: un humano raramente registra más de 1-2 cuentas por minuto.
  5/min previene creación masiva de cuentas falsas (spam, bots).

---

## A05 — Security Misconfiguration (Configuración de Seguridad Incorrecta)

### ¿Qué es?

El sistema funciona correctamente pero está **configurado de forma insegura**: permisos
excesivos, información expuesta, headers de seguridad ausentes, credenciales por defecto.

### Configuraciones inseguras comunes

```python
# ❌ CORS excesivamente permisivo:
app.add_middleware(CORSMiddleware,
    allow_origins=["*"],    # Cualquier sitio puede hacer peticiones
    allow_methods=["*"],    # PUT, DELETE, PATCH, OPTIONS...
    allow_headers=["*"],    # Cualquier header arbitrario
)

# ❌ Sin cabeceras de seguridad:
# Navegador no sabe que no debe embeber la app en iframes (clickjacking)
# Navegador no sabe que no debe ejecutar archivos .txt como scripts (MIME sniffing)
```

### Cómo lo mitiga este proyecto

**1. CORS mínimamente permisivo** ([be/app/main.py](../be/app/main.py)):

```python
# ✅ Solo el origen del frontend de desarrollo:
app.add_middleware(CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],  # http://localhost:5173 — no "*"
    allow_credentials=True,
    allow_methods=["GET", "POST"],           # Solo los métodos que usamos
    allow_headers=["Content-Type", "Authorization"],  # Solo los headers necesarios
)
```

**2. Cabeceras de seguridad HTTP** (middleware en [be/app/main.py](../be/app/main.py)):

| Header                                             | Protección                                |
| -------------------------------------------------- | ----------------------------------------- |
| `X-Content-Type-Options: nosniff`                  | Previene MIME-type sniffing               |
| `X-Frame-Options: DENY`                            | Previene clickjacking via `<iframe>`      |
| `Referrer-Policy: strict-origin-when-cross-origin` | Protege URLs con tokens en query string   |
| `Permissions-Policy: camera=(), microphone=()`     | Deniega acceso a hardware del dispositivo |
| Sin header `Server`                                | Oculta la tecnología del servidor         |

**3. Documentación de API deshabilitada en producción** ([be/app/main.py](../be/app/main.py) + [be/app/config.py](../be/app/config.py)):

El endpoint `/docs` (Swagger UI) y `/redoc` exponen toda la superficie de ataque de la API —
endpoints, parámetros, schemas — sin requerir autenticación. En producción, esto facilita el
reconocimiento previo a un ataque.

```python
# Variable ENVIRONMENT controla la visibilidad de la documentación:
_is_production = settings.ENVIRONMENT == "production"
app = FastAPI(
    docs_url=None if _is_production else "/docs",   # Deshabilitado en producción
    redoc_url=None if _is_production else "/redoc",  # Deshabilitado en producción
)
```

| ENVIRONMENT      | /docs      | /redoc     | Recomendado para         |
| ---------------- | ---------- | ---------- | ------------------------ |
| `development`    | ✅ 200 OK  | ✅ 200 OK  | Desarrollo local         |
| `production`     | ❌ 404     | ❌ 404     | Servidor de producción   |

> La documentación estática de la API está disponible en [`_docs/api-endpoints.md`](./api-endpoints.md) como alternativa segura a Swagger UI en producción.

**4. Configuración desde variables de entorno**:
Credenciales, URLs y secrets nunca en el código — siempre en `.env`:

```bash
SECRET_KEY=<generado con openssl rand -hex 32>
DATABASE_URL=postgresql://user:pass@host:5432/db
ENVIRONMENT=production   # Deshabilita /docs y /redoc
```

---

## A06 — Vulnerable and Outdated Components (Componentes Vulnerables)

### ¿Qué es?

El sistema usa librerías, frameworks o runtime con **vulnerabilidades conocidas** (CVEs
publicados) porque no se actualizan. Un solo componente vulnerable puede comprometer
todo el sistema.

### Cómo lo mitiga este proyecto

**Versiones mínimas fijadas** ([be/requirements.txt](../be/requirements.txt)):

```
fastapi>=0.115       # Requiere versión mínima con patches de seguridad
pydantic>=2.0        # V2 con mejoras de seguridad sobre V1
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
slowapi>=0.1.9
```

**Buenas prácticas adicionales** (a implementar en CI/CD):

```bash
# Verificar vulnerabilidades conocidas en dependencias:
pip install safety && safety check

# O con pip-audit:
pip install pip-audit && pip-audit
```

> **Nota pedagógica**: Usar `>=version` (versión mínima) en lugar de `==version` (versión exacta)
> permite recibir patches de seguridad automáticamente dentro de la misma major version,
> sin romperse ante cambios de API incompatibles.

---

## A07 — Authentication and Session Failures (Fallas de Autenticación)

### ¿Qué es?

Debilidades en cómo el sistema identifica y verifica usuarios: contraseñas débiles
permitidas, tokens sin expiración, exposición de tokens, recuperación de contraseña insegura.

### Cómo lo mitiga este proyecto

**1. Validación de fortaleza de contraseñas** ([be/app/schemas/user.py](../be/app/schemas/user.py)):

```python
@field_validator("password")
@classmethod
def validate_password_strength(cls, v: str) -> str:
    if len(v) < 8:
        raise ValueError("La contraseña debe tener al menos 8 caracteres")
    if not re.search(r"[A-Z]", v):
        raise ValueError("Debe contener al menos una mayúscula")
    if not re.search(r"[a-z]", v):
        raise ValueError("Debe contener al menos una minúscula")
    if not re.search(r"\d", v):
        raise ValueError("Debe contener al menos un número")
    return v
```

**2. Tokens de corta duración** ([be/app/config.py](../be/app/config.py)):

```python
ACCESS_TOKEN_EXPIRE_MINUTES: int = 15   # 15 min — ventana pequeña si se filtra
REFRESH_TOKEN_EXPIRE_DAYS: int = 7      # 7 días — para renovar sin re-login
```

**3. Verificación de email obligatoria**:
Los usuarios no pueden hacer login hasta verificar su email — previene el uso de
emails de otras personas para crear cuentas.

**4. Tokens de reset de un solo uso** ([be/app/models/password_reset_token.py](../be/app/models/password_reset_token.py)):

```python
used: Mapped[bool] = mapped_column(Boolean, default=False)
# Una vez usado → se marca used=True → no puede usarse de nuevo
# Además tiene expires_at → expira en 1 hora aunque no se use
```

**5. Mensajes de error genéricos**:

```python
# ❌ INSEGURO — revela si el email existe:
# "El email no está registrado" vs "Contraseña incorrecta"
# Un atacante puede enumerar emails válidos

# ✅ SEGURO — mismo mensaje siempre:
raise HTTPException(status_code=401, detail="Credenciales incorrectas")
```

---

## A08 — Software and Data Integrity Failures

### ¿Qué es?

El código o los datos pueden ser modificados por atacantes sin que el sistema lo detecte:
actualizaciones sin firma, deserialización insegura, pipelines CI/CD sin protección.

### Estado en este proyecto

**Parcialmente mitigado**:

✅ **Los tokens JWT están firmados** con HMAC-SHA256 — si alguien modifica el payload,
la verificación de firma falla y el token se rechaza.

```python
# Cualquier modificación al payload invalida la firma:
access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
# ...
decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
# JWTError si el token fue alterado ↑
```

⚠️ **Sin firma de artefactos de despliegue**: En un entorno productivo, el código
debería verificarse criptográficamente antes de desplegarse (Docker image signing,
pip hash verification). Esto está fuera del alcance educativo del proyecto.

---

## A09 — Security Logging and Monitoring Failures

### ¿Qué es?

La aplicación no registra eventos de seguridad críticos (intentos de login fallido,
cambios de contraseña, errores de permisos) ni genera alertas ante comportamientos
anómalos. Sin logs, un ataque puede durar meses sin ser detectado.

### Stat real: tiempo promedio de detección de una brecha

> **280 días** es el promedio que tarda una organización en detectar una brecha de
> seguridad (IBM Cost of a Data Breach Report 2023). Los logs adecuados reducen
> drásticamente este número.

### Cómo lo mitiga este proyecto

**Módulo de audit log** ([be/app/utils/audit_log.py](../be/app/utils/audit_log.py)):

```python
# Eventos registrados automáticamente:
log_login_failed(email="us***@example.com", reason="invalid_credentials", ip="192.168.1.1")
log_login_success(email="us***@example.com", ip="192.168.1.1")
log_password_changed(user_id="uuid-123", ip="192.168.1.1")
log_password_reset_requested(ip="192.168.1.1")
log_email_verified(user_id="uuid-123")
log_rate_limit_hit(endpoint="/api/v1/auth/login", ip="192.168.1.1")
```

**Formato de los logs (JSON estructurado)**:

```json
{
  "timestamp": "2026-02-15T14:23:45.123456+00:00",
  "event": "login_failed",
  "email": "us***@nn-company.com",
  "reason": "invalid_credentials",
  "ip": "203.0.113.42"
}
```

**¿Por qué JSON estructurado y no texto plano?**
Los logs JSON pueden ser ingestados por herramientas como Elasticsearch, Splunk o
Datadog, que permiten buscar, filtrar y crear alertas automáticamente. Por ejemplo:
"alertar si hay más de 50 `login_failed` desde la misma IP en 5 minutos".

**Principio de privacidad en logs — email redactado**:

```python
def _redact_email(email: str) -> str:
    # "user@example.com" → "us***@example.com"
    # Suficiente para diagnóstico, sin exponer el email completo en logs
```

Los logs son archivos de texto — si un servidor se compromete, los logs no deben
revelar emails completos de usuarios. El balance privacidad/utilidad se logra con redacción.

---

## A10 — Server-Side Request Forgery (SSRF)

### ¿Qué es?

El servidor hace peticiones HTTP a URLs controladas por el atacante, lo que puede
exponer servicios internos, metadatos de cloud (AWS IMDSv1), o permitir escaneo
de la red interna.

```
# Ejemplo de ataque SSRF:
POST /api/fetch-image
{"url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/"}
# → El servidor hace un GET a la URL de metadatos de AWS
# → Retorna credenciales IAM del servidor ← atacante las roba
```

### Estado en este proyecto

**No aplica (N/A)**: La API de NN Auth System no realiza peticiones HTTP a URLs
externas basadas en input del usuario. Los únicos clientes HTTP externos son:

- El envío de email (servidor SMTP fijo, no controlable por el usuario)
- No hay endpoints de "fetch URL" ni webhooks configurables por el cliente

Si en el futuro se agregaran integraciones con URLs externas, se debe:

1. Validar la URL contra una whitelist de dominios permitidos
2. Bloquear rangos de IP privados (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16)
3. Usar una librería o servicio dedicado a sanitizar URLs

---

## Resumen Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                    NN Auth System Security                       │
│                                                                 │
│  Cliente           FastAPI Backend           Base de Datos      │
│  ────────          ──────────────────        ───────────────    │
│                                                                 │
│  POST /login  ──►  Rate Limiting (A04)                         │
│                    slowapi: 10/min                              │
│                         │                                       │
│                    Pydantic Validation (A03)                    │
│                    EmailStr, min length                         │
│                         │                                       │
│                    Auth Service (A07)                           │
│                    bcrypt.verify() (A02)                        │
│                         │                                       │
│                    Audit Log (A09)  ──────►  security.audit     │
│                    login_failed/success       (JSON logs)       │
│                         │                                       │
│  JWT Token    ◄──  JWT signed HS256 (A02)                      │
│                    ACCESS: 15min                                │
│                    REFRESH: 7 days                              │
│                                                                 │
│  GET /me      ──►  get_current_user (A01)                      │
│                    JWT verification                             │
│                    User ID from token                           │
│                    (never from client)                          │
│                                                                 │
│  All requests ──►  Security Headers (A05)                      │
│               ◄──  X-Frame-Options: DENY                       │
│                    X-Content-Type-Options                       │
│                    Referrer-Policy                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Recursos de Aprendizaje

| Recurso              | URL                                 | Para qué                                     |
| -------------------- | ----------------------------------- | -------------------------------------------- |
| OWASP Top 10 oficial | https://owasp.org/Top10/            | Referencia completa actualizada              |
| OWASP Cheat Sheets   | https://cheatsheetseries.owasp.org/ | Guías específicas por tecnología             |
| Have I Been Pwned    | https://haveibeenpwned.com/         | Verificar si un email fue comprometido       |
| JWT Debugger         | https://jwt.io/                     | Decodificar y entender tokens JWT            |
| Security Headers     | https://securityheaders.com/        | Verificar cabeceras de seguridad de un sitio |

---

> **Conclusión pedagógica**: La seguridad no es una característica que se agrega al
> final — es una práctica que se integra en cada decisión de diseño y cada línea de
> código. El OWASP Top 10 no es una lista de miedos sino una **guía de construcción**
> que te dice exactamente qué construit para proteger tu aplicación y a sus usuarios.
