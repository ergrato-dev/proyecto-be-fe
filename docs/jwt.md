# Manejo de JWT en el proyecto

> Documento generado a partir del código fuente en `be/` y `fe/`.

---

## 1. Configuración

`be/app/config.py:73-84`

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| `SECRET_KEY` | Variable de entorno | Clave secreta para firmar/verificar tokens (mín 32 caracteres) |
| `ALGORITHM` | `HS256` | Algoritmo HMAC-SHA256 simétrico |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `15` | Vida útil del access token |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Vida útil del refresh token |

---

## 2. Creación de tokens

`be/app/utils/security.py`

### `create_access_token()` (líneas 63–95)

```python
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
```

Payload resultante:
```json
{
  "sub": "usuario@email.com",
  "exp": 1712345678,
  "type": "access"
}
```

### `create_refresh_token()` (líneas 98–133)

Misma estructura, pero `"type": "refresh"` y expiración de 7 días.

### `decode_token()` (líneas 136–162)

```python
def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
```

Retorna `None` si el token expiró, está malformado o tiene firma inválida.

---

## 3. Login → emisión de tokens

`be/app/routers/auth.py:86-112` — `POST /api/v1/auth/login`

```
Cliente envía { email, password }
  → auth_service.login_user() valida credenciales
  → Verifica is_active y is_email_verified
  → create_access_token(data={"sub": email})
  → create_refresh_token(data={"sub": email})
  → Responde { access_token, refresh_token, token_type: "bearer" }
```

**Frontend** (`fe/src/context/AuthContext.tsx:130-144`):
1. Recibe `TokenResponse`
2. Guarda ambos tokens en `sessionStorage`
3. Llama `GET /me` con el access token para obtener perfil del usuario
4. Aplica locale del usuario (i18n)

---

## 4. Transporte del token (frontend → backend)

`fe/src/api/axios.ts:37-49`

Cada petición saliente pasa por un **interceptor de request** que agrega el header:

```typescript
const token = sessionStorage.getItem("access_token");
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

---

## 5. Verificación del token (backend)

`be/app/dependencies.py:49-121` — `get_current_user()`

```
1. oauth2_scheme extrae el token del header Authorization
2. decode_token() → jwt.decode() con SECRET_KEY + HS256
3. Valida payload["type"] == "access"
4. Extrae email de payload["sub"]
5. Busca usuario en BD por email
6. Verifica is_active == True
7. Retorna objeto User → disponible en la ruta protegida
```

Errores:
- Token inválido/expirado → `HTTP 401 UNAUTHORIZED`
- Usuario inactivo → `HTTP 403 FORBIDDEN`

**Rutas protegidas** usan:
```python
current_user: User = Depends(get_current_user)
```

Presente en:
- `be/app/routers/auth.py:153` — `POST /change-password`
- `be/app/routers/users.py:34,61` — `GET /me`, `PATCH /me/locale`

---

## 6. Refresh token (renovación sin re-login)

`be/app/routers/auth.py:115-143` — `POST /api/v1/auth/refresh`

```
Cliente envía { refresh_token }
  → decode_token() valida JWT + payload["type"] == "refresh"
  → Extrae email, verifica usuario existe y está activo
  → Crea NUEVO access_token + NUEVO refresh_token (rotación)
  → Responde TokenResponse
```

**Rotación de tokens:** cada refresh genera un par nuevo. El refresh token anterior queda inservible (no hay blacklist — es stateless, pero el cliente debe reemplazarlo).

**Frontend** (`fe/src/api/auth.ts:54-57`):
```typescript
export const refreshToken = (data: RefreshTokenRequest) =>
  api.post<TokenResponse>("/api/v1/auth/refresh", data);
```

---

## 7. Almacenamiento en frontend

`fe/src/context/AuthContext.tsx:50-54`

Tokens almacenados en **`sessionStorage`**:
```typescript
sessionStorage.setItem("access_token", token);
sessionStorage.setItem("refresh_token", token);
```

**¿Por qué `sessionStorage` y no `localStorage`?**
- Se borra al cerrar la pestaña/navegador
- Menor exposición que `localStorage` (persiste entre sesiones)
- No accesible desde otras pestañas (aislamiento)

---

## 8. Logout

`fe/src/context/AuthContext.tsx:82-88` — `clearAuth()`

```typescript
sessionStorage.removeItem("access_token");
sessionStorage.removeItem("refresh_token");
// Resetea estado React
```

No se invalida el token en backend (JWT es stateless). El token sigue siendo válido hasta su expiración natural. Para producción se podría implementar una blacklist en Redis.

---

## 9. Tokens no-JWT (UUID)

Para flujos de email se usan tokens UUID almacenados en base de datos:

### Email verification

`be/app/models/email_verification_token.py` — Tabla `email_verification_tokens`

| Campo | Descripción |
|-------|-------------|
| `token` | UUID generado con `secrets.token_urlsafe(32)` |
| `expires_at` | 24 horas desde creación |
| `used` | Boolean — se marca `True` al usar |

Flujo: `POST /register` → crea token → envía email con link → `POST /verify-email` + token → activa cuenta.

### Password reset

`be/app/models/password_reset_token.py` — Tabla `password_reset_tokens`

| Campo | Descripción |
|-------|-------------|
| `token` | UUID generado con `secrets.token_urlsafe(32)` |
| `expires_at` | 1 hora desde creación |
| `used` | Boolean — se marca `True` al usar |

Flujo: `POST /forgot-password` → crea token → envía email con link → `POST /reset-password` + token + nueva contraseña.

---

## 10. Endpoints de autenticación

Todos bajo prefijo `/api/v1/auth`:

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| `POST` | `/register` | No | 5/min | Registro + email de verificación |
| `POST` | `/login` | No | 10/min | Login → JWT pair |
| `POST` | `/refresh` | No | — | Renovar JWT pair |
| `POST` | `/change-password` | Sí | — | Cambiar contraseña (autenticado) |
| `POST` | `/forgot-password` | No | 5/min | Solicitar reset de contraseña |
| `POST` | `/reset-password` | No | — | Resetear contraseña con token UUID |
| `POST` | `/verify-email` | No | — | Verificar email con token UUID |

Prefijo `/api/v1/users`:

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/me` | Sí | Perfil del usuario autenticado |
| `PATCH` | `/me/locale` | Sí | Cambiar idioma preferido |

---

## 11. Protección de rutas en frontend

`fe/src/components/ProtectedRoute.tsx:26-85`

```typescript
if (isLoading) return <Spinner />
if (!isAuthenticated) return <Navigate to="/login" />
return <>{children}</>
```

Rutas protegidas: `/dashboard`, `/change-password`.

---

## 12. Seguridad

- **Tokens diferenciados por tipo:** `"type": "access"` y `"type": "refresh"` — no intercambiables
- **Rotación de refresh tokens:** cada refresh emite un par nuevo
- **Rate limiting:** previene fuerza bruta en login, registro y forgot-password
- **Respuestas genéricas:** `forgot-password` siempre responde igual (previene enumeración de usuarios)
- **Secret key validada:** mínimo 32 caracteres (`be/app/config.py:42-68`)

---

## Archivos relevantes

| Archivo | Rol |
|---------|-----|
| `be/app/config.py` | Configuración JWT (secret, algoritmo, expiración) |
| `be/app/utils/security.py` | `create_access_token`, `create_refresh_token`, `decode_token` |
| `be/app/dependencies.py` | `get_current_user` — middleware de autenticación |
| `be/app/routers/auth.py` | Endpoints de autenticación |
| `be/app/services/auth_service.py` | Lógica de negocio (login, refresh, register, reset) |
| `be/app/schemas/user.py` | Schemas `TokenResponse`, `RefreshTokenRequest` |
| `be/app/models/email_verification_token.py` | Token UUID para verificación de email |
| `be/app/models/password_reset_token.py` | Token UUID para reset de contraseña |
| `fe/src/api/axios.ts` | Interceptor que agrega `Authorization: Bearer` |
| `fe/src/api/auth.ts` | Funciones de API del frontend |
| `fe/src/context/AuthContext.tsx` | Estado de autenticación + sessionStorage |
| `fe/src/components/ProtectedRoute.tsx` | Protección de rutas |
| `fe/src/types/auth.ts` | Tipos TypeScript (TokenResponse, AuthState, etc.) |
