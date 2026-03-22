# Patrones Arquitectónicos — NN Auth System

<!--
  Archivo: patrones-arquitectonicos.md
  Descripcion: Documentacion tecnica ilustrada de los patrones arquitectonicos
               aplicados en el proyecto NN Auth System.
  Para que? Servir como referencia de estudio y consulta para entender por que
            el sistema esta estructurado como lo esta.
  Impacto: Comprender los patrones facilita mantener, extender y defender
           decisiones tecnicas del proyecto ante evaluaciones o presentaciones.
-->

> **Proyecto:** NN Auth System 
> **Stack:** FastAPI + React + PostgreSQL + Docker
> **Cobertura tests:** 96 % backend · 80 tests frontend

---

## Resumen ejecutivo

El sistema aplica **10 patrones arquitectónicos y de diseño** de uso profesional. No son solo teoría: cada patrón resuelve un problema concreto y está presente en el código del proyecto.

| #   | Patrón                     | Dónde vive                      | Qué resuelve                                         |
| --- | -------------------------- | ------------------------------- | ---------------------------------------------------- |
| 1   | Arquitectura en Capas      | `be/app/`                       | Separación de responsabilidades en el backend        |
| 2   | DTO — Data Transfer Object | `schemas/user.py`               | Nunca exponer datos internos de BD en respuestas     |
| 3   | Inyección de Dependencias  | `dependencies.py` + `Depends()` | Desacoplar servicios transversales (DB, auth)        |
| 4   | JWT Stateless              | `utils/security.py`             | Autenticación sin estado en el servidor              |
| 5   | Context / Provider         | `AuthContext.tsx`               | Estado de auth global en toda la app React           |
| 6   | Custom Hook                | `useAuth.ts`                    | Encapsular y reutilizar lógica de autenticación      |
| 7   | Interceptor                | `api/axios.ts`                  | Adjuntar token JWT en cada petición automáticamente  |
| 8   | SPA + Route Guard          | `ProtectedRoute.tsx`            | Proteger rutas sin renderizar páginas no autorizadas |
| 9   | Monorepo                   | `be/` + `fe/`                   | Código fuente unificado en un solo repositorio       |
| 10  | REST API                   | `routers/auth.py`               | Interfaz estándar entre frontend y backend           |

---

## Vista general del sistema

![](../_assets/pa-01-overview.svg)

El sistema sigue una **arquitectura Cliente–Servidor** de tres capas lógicas:

1. **Frontend (React)** — Interfaz de usuario. Never guarda estado en el servidor.
2. **Backend (FastAPI)** — Lógica de negocio. Expone una API REST bajo `/api/v1/`.
3. **Base de datos (PostgreSQL)** — Persistencia. Solo accedida desde el backend.

La comunicación entre frontend y backend es exclusivamente **HTTP + JSON**. Los tokens JWT viajan en el header `Authorization: Bearer <token>`. Nunca hay sesiones en el servidor.

---

## Patrón 1 — Arquitectura en Capas

![](../_assets/pa-02-backend-layers.svg)

### ¿Qué es?

Organizar el código en capas horizontales donde **cada capa solo puede comunicarse con la capa directamente inferior**.

### ¿Cómo se aplica aquí?

```
HTTP Request
      ↓
┌─────────────────────────────────────────┐
│  routers/          → Capa HTTP          │  Recibe y devuelve HTTP
├─────────────────────────────────────────┤
│  services/         → Capa de Negocio    │  Reglas y decisiones
├─────────────────────────────────────────┤
│  models/ + schemas → Capa de Datos      │  ORM + Validación
├─────────────────────────────────────────┤
│  utils/            → Capa Transversal   │  security · email
└─────────────────────────────────────────┘
      ↓
PostgreSQL
```

### Ejemplo en código

```python
# routers/auth.py — solo recibe el request y llama al service
@router.post("/register", response_model=UserResponse, status_code=201)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return await auth_service.register_user(db, user_data)  # delega al service

# services/auth_service.py — contiene la lógica
async def register_user(db: Session, user_data: UserCreate) -> User:
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(400, "El email ya está registrado")
    user_data.password = hash_password(user_data.password)  # llama a utils
    ...
```

### Ventaja

Un cambio en la base de datos **no afecta** el router. Un cambio en el router **no afecta** la lógica de negocio. Cada capa es testeable de forma independiente.

---

## Patrón 2 — DTO (Data Transfer Object)

![](../_assets/pa-04-dto-pattern.svg)

### ¿Qué es?

Un objeto diseñado exclusivamente para transportar datos entre capas, diferente del modelo de base de datos.

### ¿Por qué es crítico aquí?

El modelo ORM `User` tiene siete columnas, incluyendo `hashed_password`. Si devolviéramos el objeto ORM directamente, **el hash de la contraseña quedaría expuesto en la respuesta HTTP**. El DTO actúa como filtro.

### Ejemplo en código

```python
# models/user.py — Modelo ORM (lo que hay en la BD)
class User(Base):
    id = Column(UUID, primary_key=True)
    email = Column(String, unique=True)
    full_name = Column(String)
    hashed_password = Column(String)  # ← NUNCA debe salir en la respuesta
    is_active = Column(Boolean)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

# schemas/user.py — Schema Pydantic (lo que se devuelve al cliente)
class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    # hashed_password: ← OMITIDO intencionalmente
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
```

```python
# routers/users.py — FastAPI convierte automáticamente ORM → DTO
@router.get("/me", response_model=UserResponse)  # response_model filtra los campos
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user  # FastAPI aplica model_validate() internamente
```

### Ventaja

La API puede cambiar su contrato (el schema) **sin alterar la estructura de la base de datos**, y viceversa.

---

## Patrón 3 — Inyección de Dependencias (DI)

### ¿Qué es?

En lugar de que cada función cree sus propias dependencias, las recibe inyectadas desde afuera. FastAPI implementa esto con `Depends()`.

### Ejemplo en código

```python
# dependencies.py — define las dependencias reutilizables

def get_db() -> Generator[Session, None, None]:
    """Provee una sesión de BD para cada request; la cierra al terminar."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(
    token: str = Depends(oauth2_scheme),  # DI: extrae el token del header
    db: Session = Depends(get_db)         # DI: inyecta la sesión de BD
) -> User:
    """Valida el JWT y devuelve el usuario autenticado."""
    ...
```

```python
# routers/users.py — consume las dependencias declarativamente
@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),  # DI automática
    db: Session = Depends(get_db)                    # DI automática
):
    return current_user
```

### Ventaja

Para los tests, se puede **reemplazar** `get_db` por una base de datos en memoria sin tocar el router. FastAPI se encarga de resolver el grafo de dependencias.

```python
# tests/conftest.py — override de la dependencia en tests
app.dependency_overrides[get_db] = override_get_db  # BD de test en memoria
```

---

## Patrón 4 — JWT Stateless

![](../_assets/pa-03-jwt-flow.svg)

### ¿Qué es?

El servidor **no guarda sesión**. En cambio, emite un token firmado criptográficamente que el cliente presenta en cada request. El servidor solo verifica la firma.

### Tokens del sistema

| Token           | Duración       | Propósito                                                |
| --------------- | -------------- | -------------------------------------------------------- |
| `access_token`  | **15 minutos** | Autenticar cada request a endpoints protegidos           |
| `refresh_token` | **7 días**     | Obtener un nuevo `access_token` sin volver a hacer login |

### Ejemplo en código

```python
# utils/security.py — creación del token
def create_access_token(data: dict) -> str:
    payload = {**data, "exp": datetime.utcnow() + timedelta(minutes=15)}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# utils/security.py — verificación del token
def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(401, "Token inválido o expirado")
```

### Ventaja

El backend puede escalar a múltiples instancias sin compartir estado de sesión. No hay tabla de sesiones. La información del usuario viaja **dentro** del token.

---

## Patrones 5, 6, 7 y 8 — Frontend React

![](../_assets/pa-05-react-patterns.svg)

---

## Patrón 5 — Context / Provider

### ¿Qué es?

React usa el patrón **Provider** para compartir estado global sin necesidad de pasar props manualmente por cada nivel del árbol de componentes.

### Ejemplo en código

```typescript
// context/AuthContext.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    setAccessToken(response.access_token);
    // ...
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, ... }}>
      {children}
    </AuthContext.Provider>
  );
}
```

```tsx
// main.tsx — AuthProvider envuelve toda la app
<AuthProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</AuthProvider>
```

### Ventaja

`DashboardPage`, `Navbar`, `ChangePasswordPage` **todos** acceden al mismo estado de autenticación sin recibir props.

---

## Patrón 6 — Custom Hook

### ¿Qué es?

Una función de React que encapsula lógica reutilizable y puede usar otros hooks internamente.

### Ejemplo en código

```typescript
// hooks/useAuth.ts
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth() debe usarse dentro de <AuthProvider>");
  }
  return context;
}
```

```typescript
// pages/DashboardPage.tsx — consumo del hook
export function DashboardPage() {
  const { user, logout } = useAuth();  // una línea, acceso completo al contexto
  return <h1>Bienvenido, {user?.full_name}</h1>;
}
```

### Ventaja

En lugar de escribir `useContext(AuthContext)` con su validación en cada componente, se centraliza en `useAuth()`. Si el contexto cambia, **solo se modifica el hook**.

---

## Patrón 7 — Interceptor

### ¿Qué es?

Middleware a nivel de cliente HTTP que procesa **todas** las peticiones/respuestas antes de que lleguen al código de la aplicación.

### Ejemplo en código

```typescript
// api/axios.ts
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Interceptor de request — adjunta el token automáticamente
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response — maneja errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

### Ventaja

Ningún componente ni función de API necesita preocuparse por añadir el header `Authorization`. Si el token cambia de lugar (por ejemplo, de `sessionStorage` a una cookie), se modifica **un solo lugar**.

---

## Patrón 8 — SPA + Route Guard

### ¿Qué es?

En una SPA (_Single Page Application_), el enrutamiento ocurre en el cliente (JavaScript), sin recargar la página. El **Route Guard** protege rutas que requieren autenticación.

### Ejemplo en código

```typescript
// components/ProtectedRoute.tsx
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  // Si no está autenticado, redirige sin mostrar la página
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
```

```tsx
// App.tsx — configuración de rutas
<Routes>
  {/* Rutas públicas */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* Rutas protegidas — require autenticación */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/change-password" element={<ChangePasswordPage />} />
  </Route>
</Routes>
```

### Ventaja

Un usuario que visita `/dashboard` sin autenticarse **nunca ve** el HTML de la página. Es redirigido inmediatamente. No hay necesidad de protección en cada componente individualmente.

---

## Patrón 9 — Monorepo

### ¿Qué es?

Múltiples proyectos (frontend, backend, infraestructura) conviven en **un solo repositorio git**.

### Estructura

```
proyecto/                  ← Un solo repositorio git
├── be/                    ← Backend (Python/FastAPI)
│   ├── app/
│   └── requirements.txt
├── fe/                    ← Frontend (React/TypeScript)
│   ├── src/
│   └── package.json
├── docker-compose.yml     ← Infraestructura compartida
└── .github/
    └── copilot-instructions.md
```

### Ventaja

- Un `git clone` obtiene todo el proyecto
- Los cambios que afectan a backend **y** frontend viajan en el mismo commit
- La infraestructura (`docker-compose.yml`) es parte del código versionado

---

## Patrón 10 — REST API

### ¿Qué es?

Interfaz de comunicación basada en recursos HTTP con verbos (`GET`, `POST`, `PUT`, `DELETE`) y códigos de estado estándar (`200`, `201`, `400`, `401`, `404`, `422`).

### Endpoints del sistema

| Verbo  | Ruta                           | Código OK | Descripción                            |
| ------ | ------------------------------ | --------- | -------------------------------------- |
| `POST` | `/api/v1/auth/register`        | `201`     | Registrar nuevo usuario                |
| `POST` | `/api/v1/auth/login`           | `200`     | Iniciar sesión, obtener tokens         |
| `POST` | `/api/v1/auth/refresh`         | `200`     | Renovar access token                   |
| `POST` | `/api/v1/auth/change-password` | `200`     | Cambiar contraseña (auth)              |
| `POST` | `/api/v1/auth/forgot-password` | `200`     | Solicitar email de recuperación        |
| `POST` | `/api/v1/auth/reset-password`  | `200`     | Restablecer contraseña con token       |
| `GET`  | `/api/v1/users/me`             | `200`     | Obtener perfil del usuario autenticado |

### Ejemplo de respuesta estándar

```json
// POST /api/v1/auth/login → 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}

// POST /api/v1/auth/register → 422 Unprocessable Entity (validación fallida)
{
  "detail": [
    { "loc": ["body", "email"], "msg": "value is not a valid email address" }
  ]
}
```

### Ventaja

Cualquier cliente (React, Android, iOS, Postman, curl) puede consumir la API porque habla HTTP estándar. La documentación es automática en `/docs` (Swagger UI).

---

## Relación entre patrones

```
┌─────────────────────────────────────────────────────────────────┐
│ Monorepo (#9)                                                   │
│                                                                 │
│  ┌─── REST API (#10) ────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  Frontend (SPA #8)          Backend (Capas #1)            │  │
│  │  ┌────────────────────┐     ┌──────────────────────────┐  │  │
│  │  │ Provider (#5)      │     │ routers/                 │  │  │
│  │  │  Hook (#6)         │←────│ services/   ← DI (#3)    │  │  │
│  │  │  RouteGuard (#8)   │────→│ models/     ← DTO (#2)   │  │  │
│  │  │  Interceptor (#7)  │     │ utils/      ← JWT (#4)   │  │  │
│  │  └────────────────────┘     └──────────────────────────┘  │  │
│  │                                        ↕                  │  │
│  │                               PostgreSQL (SQLAlchemy)      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

Cada patrón resuelve un problema específico. Juntos, hacen que el sistema sea:

- **Seguro** — DTO + JWT + bcrypt
- **Mantenible** — Capas + DI + CustomHook
- **Escalable** — Stateless + REST + Monorepo
- **Testeable** — DI override + Fixtures + 96 % cobertura
