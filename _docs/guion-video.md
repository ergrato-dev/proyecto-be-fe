# 🎬 Guión del Video — NN Auth System

## Aplicación Fullstack con FastAPI + React + PostgreSQL + Docker

<!--
  ¿Qué? Guión paso a paso para grabar el video explicativo del proyecto académico NN Auth System.
  ¿Para qué? Servir de guía de grabación, asegurando que cada concepto se explique
             en orden lógico, sin saltarse pasos esenciales ni dar nada por supuesto.
  ¿Impacto? Un guión bien estructurado garantiza que los estudiantes puedan seguir el video
             sin perderse, construyendo el conocimiento incrementalmente.
-->

---

## Índice del Video

| #   | Sección                                    | Duración estimada |
| --- | ------------------------------------------ | ----------------- |
| 1   | Introducción y presentación del proyecto   | ~5 min            |
| 2   | Prerrequisitos y herramientas              | ~5 min            |
| 3   | Estructura del monorepo                    | ~5 min            |
| 4   | Docker y PostgreSQL — la base de datos     | ~10 min           |
| 5   | Backend — Configuración inicial            | ~15 min           |
| 6   | Backend — Modelos ORM y migraciones        | ~15 min           |
| 7   | Backend — Schemas Pydantic                 | ~10 min           |
| 8   | Backend — Seguridad: hashing y JWT         | ~15 min           |
| 9   | Backend — Dependencias inyectables         | ~10 min           |
| 10  | Backend — Servicios (lógica de negocio)    | ~20 min           |
| 11  | Backend — Routers y endpoints              | ~15 min           |
| 12  | Backend — Tests con pytest                 | ~15 min           |
| 13  | Frontend — Configuración inicial           | ~10 min           |
| 14  | Frontend — Tipos TypeScript                | ~8 min            |
| 15  | Frontend — Cliente HTTP con Axios          | ~12 min           |
| 16  | Frontend — Contexto de autenticación       | ~15 min           |
| 17  | Frontend — Hook useAuth y rutas protegidas | ~10 min           |
| 18  | Frontend — Páginas de autenticación        | ~20 min           |
| 19  | Demostración del flujo completo            | ~15 min           |
| 20  | Cierre y recapitulación                    | ~5 min            |
| 21  | Actualizaciones recientes (OWASP + docs)   | ~8 min            |

**Duración total estimada: ~3 horas 10 min** (recomendado dividir en 5-6 videos de 30-40 min)

---

## ✂️ División sugerida en videos

| Video   | Secciones    | Enfoque                                        |
| ------- | ------------ | ---------------------------------------------- |
| Video 1 | 1, 2, 3, 4   | Intro + Docker + estructura del proyecto       |
| Video 2 | 5, 6, 7      | Backend: configuración, modelos y schemas      |
| Video 3 | 8, 9, 10, 11 | Backend: seguridad, servicios y endpoints      |
| Video 4 | 12           | Backend: testing completo con pytest           |
| Video 5 | 13–19, 20    | Frontend completo + demo integrada             |
| Video 6 | 21           | Cierre técnico: OWASP, Swagger y documentación |

---

---

# 🎥 VIDEO 1 — Introducción, Docker y Estructura del Proyecto

---

## SECCIÓN 1 — Introducción y presentación del proyecto

### 🎙️ Guión

**[Pantalla: diapositiva de título o README.md abierto]**

> "Hola, bienvenidos a este tutorial. Vamos a construir juntos un sistema de autenticación completo — desde cero, paso a paso — usando tecnologías que se usan en el mundo real: **FastAPI** para el backend, **React** con TypeScript para el frontend, **PostgreSQL** como base de datos y **Docker** para orquestar todo el entorno.
>
> El proyecto se llama **NN Auth System** y fue diseñado como proyecto educativo para el SENA. Pero más allá del contexto académico, los conceptos que vamos a ver aplican a cualquier aplicación web que necesite manejar usuarios y sesiones.
>
> ¿Qué vamos a implementar? Un sistema completo con: registro de usuarios, inicio de sesión con tokens JWT, cambio de contraseña, recuperación de contraseña por email, y protección de rutas en el frontend."

**[Pantalla: diagrama de arquitectura o estructura de carpetas]**

> "La arquitectura es simple pero refleja cómo se estructura una aplicación profesional. Tenemos dos partes principales: el **backend** — que expone una API REST — y el **frontend** — una SPA que consume esa API. La base de datos corre en un contenedor Docker que arrancamos con un solo comando.
>
> Lo que hace especial este proyecto no es solo qué construimos, sino **cómo** lo construimos: cada archivo tiene comentarios pedagógicos explicando **qué hace**, **para qué sirve** y **qué impacto tiene** en el sistema. Eso es exactamente lo que vamos a hacer en este video: entender el **por qué** de cada decisión."

---

## SECCIÓN 2 — Prerrequisitos y herramientas

### 🎙️ Guión

**[Pantalla: terminal abierta, ejecutando comandos de verificación]**

> "Antes de arrancar, vamos a verificar que tenemos todo lo necesario instalado. Necesitamos cuatro cosas:"

**[Terminal: ejecutar cada comando]**

```bash
# 1. Python 3.12 o superior
python3 --version
# Esperamos: Python 3.12.x

# 2. Node.js 20 LTS o superior
node --version
# Esperamos: v20.x.x

# 3. pnpm — el gestor de paquetes que usamos para el frontend
pnpm --version
# Esperamos: 9.x.x o superior
# Si no lo tienen: corepack enable && corepack prepare pnpm@latest --activate

# 4. Docker y Docker Compose
docker --version
docker compose version
```

> "Importante: en este proyecto usamos **pnpm** para el frontend, no npm. pnpm es más rápido y maneja mejor las dependencias. Para el backend, usamos **venv** de Python, que es el gestor de entornos virtuales estándar.
>
> ¿Por qué hacemos esto? Porque nunca queremos instalar dependencias globalmente en el sistema. Cada proyecto necesita su propio entorno aislado para evitar conflictos entre versiones."

### 💡 Puntos clave a resaltar

- `pnpm` es obligatorio en este proyecto — `npm` está prohibido
- Python con `venv` — nunca instalar paquetes en el Python del sistema
- Docker corre la base de datos — no necesitamos instalar PostgreSQL localmente

---

## SECCIÓN 3 — Estructura del monorepo

### 🎙️ Guión

**[Pantalla: VS Code con el explorador de archivos visible]**

> "Este es un **monorepo** — un repositorio único que contiene dos proyectos distintos: el backend en `be/` y el frontend en `fe/`. Esta estructura nos facilita trabajar en ambos al mismo tiempo y mantener configuraciones compartidas.

**[Señalar carpetas en el explorador]**

> Veamos la estructura. En la raíz tenemos:
>
> - `docker-compose.yml` — el archivo que orquesta todos los servicios
> - `README.md` — documentación de arranque rápido
> - `_docs/` — toda la documentación técnica del proyecto
> - `be/` — el backend con FastAPI
> - `fe/` — el frontend con React
>
> Dentro de `be/app/` vamos a ver una arquitectura en capas: `models/` para los modelos de base de datos, `schemas/` para la validación de datos, `services/` para la lógica de negocio, `routers/` para los endpoints, y `utils/` para funciones reutilizables.
>
> Esta separación por responsabilidades se llama **Separation of Concerns** — cada carpeta tiene un único propósito y eso nos facilita mantener y testear el código."

---

## SECCIÓN 4 — Docker y PostgreSQL

### 🎙️ Guión

**[Pantalla: `docker-compose.yml` abierto en el editor]**

> "Vamos a empezar por lo más fundamental: la base de datos. No vamos a instalar PostgreSQL en nuestra máquina — vamos a correrlo en un contenedor Docker. Eso garantiza que todos los desarrolladores del proyecto usen exactamente la misma versión y configuración."

**[Leer y explicar el archivo `docker-compose.yml`]**

```yaml
services:
  db:
    image: postgres:17-alpine
    container_name: nn_auth_db
```

> "Aquí configuramos el servicio `db` usando la imagen oficial de PostgreSQL 17, variante Alpine — que es la más liviana. Le damos el nombre `nn_auth_db` al contenedor para poder identificarlo fácilmente."

```yaml
environment:
  POSTGRES_USER: nn_user
  POSTGRES_PASSWORD: nn_password
  POSTGRES_DB: nn_auth_db
```

> "Estas variables de entorno son las que PostgreSQL usa al inicializarse por primera vez. Crean el usuario, la contraseña y la base de datos. **Importante**: estos valores son solo para desarrollo local. En producción, nunca hardcodeamos credenciales — usamos secrets de Docker o variables de entorno seguras."

```yaml
ports:
  - "5432:5432"
volumes:
  - nn_auth_data:/var/lib/postgresql/data
```

> "El mapeo de puertos `5432:5432` significa: exponer el puerto 5432 del contenedor en el puerto 5432 de nuestra máquina. Esto nos permite conectarnos con herramientas como DBeaver o pgAdmin.
>
> El volumen persiste los datos — si reiniciamos el contenedor, no perdemos los registros de la base de datos."

**[Terminal: levantar el contenedor]**

```bash
# Desde la raíz del proyecto
docker compose up -d

# Verificar que está corriendo
docker compose ps

# Ver logs de la base de datos
docker compose logs db
```

> "El flag `-d` levanta los servicios en segundo plano. Al ver `healthy` en el estado, sabemos que PostgreSQL está listo para recibir conexiones.
>
> En esta primera parte del `docker-compose.yml` también hay configurado el backend y el frontend para cuando queramos hacer deploy completo con Docker. Eso lo veremos al final."

---

---

# 🎥 VIDEO 2 — Backend: Configuración, Modelos y Schemas

---

## SECCIÓN 5 — Backend: Configuración inicial

### 🎙️ Guión — Entorno virtual y dependencias

**[Pantalla: terminal, dentro de la carpeta `be/`]**

```bash
cd be

# Crear el entorno virtual
python3 -m venv .venv

# Activarlo (Linux/Mac)
source .venv/bin/activate

# El prompt cambia → (.venv) be$
# Eso confirma que estamos dentro del entorno virtual

# Instalar dependencias
pip install -r requirements.txt
```

> "¿Por qué un entorno virtual? Porque sin él, cada paquete que instalemos va al Python del sistema, y si tenemos otro proyecto con versiones diferentes de las mismas librerías, habrá conflictos. El entorno virtual crea una instalación de Python completamente aislada para este proyecto."

**[Abrir `requirements.txt`]**

> "Vamos a revisar las dependencias principales:
>
> - `fastapi` — el framework web. Es async por defecto, muy rápido y genera documentación automática.
> - `uvicorn` — el servidor que ejecuta FastAPI. ASGI = Asynchronous Server Gateway Interface.
> - `sqlalchemy` — el ORM para hablar con PostgreSQL en Python.
> - `alembic` — para las migraciones de base de datos. Es como el control de versiones de la BD.
> - `pydantic-settings` — para cargar y validar las variables de entorno.
> - `python-jose[cryptography]` — para crear y verificar tokens JWT.
> - `passlib[bcrypt]` — para hashear contraseñas. **Nunca** guardamos contraseñas en texto plano."

### 🎙️ Guión — Variables de entorno y `config.py`

**[Abrir `be/.env.example`]**

```bash
DATABASE_URL=postgresql://nn_user:nn_password@localhost:5432/nn_auth_db
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
MAIL_SERVER=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=noreply@nn-company.com
MAIL_PASSWORD=your-mail-password
FRONTEND_URL=http://localhost:5173
```

> "El archivo `.env.example` es una plantilla — le muestra a cualquier desarrollador qué variables necesita configurar. El archivo real `.env` está en el `.gitignore` y nunca se versiona, porque contiene credenciales reales."

```bash
# Crear el .env a partir del ejemplo
cp .env.example .env
# Editar con los valores reales para desarrollo local
```

**[Abrir `app/config.py`]**

> "Este es uno de los archivos más importantes del proyecto: la configuración centralizada. Usamos `pydantic-settings` para cargar las variables del `.env` y validarlas automáticamente."

```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ...
```

> "Cada campo es un atributo tipado. Si `DATABASE_URL` no está definida en el `.env`, Pydantic lanzará un error claro al arrancar la aplicación diciendo exactamente qué falta. Eso es **fail fast** — mejor fallar al inicio con un error descriptivo que fallar a mitad de un request con un error críptico."

### 🎙️ Guión — `database.py`

**[Abrir `app/database.py`]**

> "Este módulo configura la conexión a PostgreSQL. Tres piezas clave:"

```python
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=False,
)
```

> "El `engine` es el motor de conexión. Gestiona un **pool de conexiones** — en lugar de abrir una conexión nueva por cada request HTTP, mantiene un conjunto de conexiones reutilizables. Mucho más eficiente.
>
> `pool_pre_ping=True` hace una verificación rápida antes de usar una conexión para asegurarse de que sigue activa. Esto previene errores de 'conexión cerrada' después de períodos de inactividad."

```python
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
```

> "La `SessionLocal` es una fábrica de sesiones. Una sesión es el 'espacio de trabajo' con la base de datos — donde hacemos queries, inserts y updates.
>
> `autocommit=False` es crucial: los cambios **no** se guardan automáticamente. Tenemos que llamar `db.commit()` explícitamente. Esto nos da control total sobre las transacciones — si algo falla a la mitad, podemos hacer rollback."

```python
class Base(DeclarativeBase):
    pass
```

> "Y finalmente, `Base` es la clase de la que heredan todos los modelos. SQLAlchemy la usa para llevar el registro de todas las tablas del sistema."

### 🎙️ Guión — `main.py`

**[Abrir `app/main.py`]**

> "El punto de entrada de la aplicación. Aquí creamos la instancia de FastAPI, configuramos CORS y registramos los routers."

```python
_is_production = settings.ENVIRONMENT == "production"

app = FastAPI(
    title="NN Auth System",
    description="...",
    version="0.1.0",
  docs_url=None if _is_production else "/docs",
  redoc_url=None if _is_production else "/redoc",
)
```

> "Los metadatos del constructor se muestran en Swagger UI, pero ahora con control por entorno. En desarrollo (`ENVIRONMENT=development`) tenemos `/docs` y `/redoc`; en producción se deshabilitan para no exponer la superficie de la API."

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
  allow_methods=["GET", "POST"],
  allow_headers=["Content-Type", "Authorization"],
)
```

> "CORS — Cross-Origin Resource Sharing. Los navegadores tienen una política de seguridad que bloquea peticiones a dominios distintos del que sirve la página. Nuestro frontend está en `localhost:5173` y el backend en `localhost:8000` — dominios diferentes. Sin este middleware, el navegador bloquearía todas las peticiones del frontend.
>
> Fijense que solo permitimos el origen de nuestro frontend y además limitamos métodos y headers al mínimo necesario. Esta configuración reduce exposición y sigue OWASP A05 (Security Misconfiguration)."

```python
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

> "También registramos `slowapi` para rate limiting y su handler de error 429. Esto protege endpoints críticos de autenticación contra fuerza bruta y evita responder con 500 cuando se excede el límite."

**[Terminal: arrancar el backend]**

```bash
cd be
source .venv/bin/activate
uvicorn app.main:app --reload
```

> "El flag `--reload` hace que Uvicorn reinicie automáticamente el servidor cuando detecta cambios en el código. Perfecto para desarrollo.
>
> Ahora abrimos el navegador en `http://localhost:8000/docs` y vemos la documentación interactiva. Nota importante: si `ENVIRONMENT=production`, `/docs` y `/redoc` estarán deshabilitados."

---

## SECCIÓN 6 — Backend: Modelos ORM y migraciones con Alembic

### 🎙️ Guión — Modelo `User`

**[Abrir `app/models/user.py`]**

> "Los modelos ORM son clases Python que representan tablas en la base de datos. SQLAlchemy traduce las operaciones sobre estos objetos a SQL automáticamente — a eso se le llama ORM, Object-Relational Mapping."

```python
class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
```

> "El ID es un **UUID** — un identificador único universal, no un número autoincremental. ¿Por qué? Dos razones de seguridad:
>
> 1. No revela cuántos usuarios tiene el sistema — con IDs numéricos, si tu ID es 1042, sabes que hay al menos 1042 usuarios.
> 2. No son predecibles — no se puede adivinar el ID de otro usuario."

```python
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
```

> "`unique=True` — no pueden existir dos usuarios con el mismo email. `index=True` — PostgreSQL crea un índice en esta columna, lo que acelera las búsquedas por email. El login hace una búsqueda por email en cada petición, así que el índice es esencial para el rendimiento."

```python
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
```

> "**Hashed password** — la contraseña almacenada es un hash, no el texto original. Un hash es el resultado de una función matemática unidireccional: puedes ir de contraseña a hash, pero no de hash a contraseña. Incluso si alguien roba la base de datos, las contraseñas no se pueden recuperar."

```python
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
```

> "`server_default=func.now()` — la fecha de creación la genera **el servidor de PostgreSQL**, no Python. Esto garantiza consistencia incluso si hay varios servidores corriendo con distintas zonas horarias."

### 🎙️ Guión — Modelo `PasswordResetToken`

**[Abrir `app/models/password_reset_token.py`]**

> "Para el flujo de 'olvidé mi contraseña', necesitamos una tabla adicional que almacene tokens temporales de un solo uso."

```python
class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
    )
    token: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
    )
    expires_at: Mapped[datetime]
    used: Mapped[bool] = mapped_column(default=False)
```

> "El token es único e indexado para búsquedas rápidas. `expires_at` define hasta cuándo es válido — 1 hora por defecto. `used` es un flag de un solo uso: una vez que se usa el token para resetear la contraseña, se marca como `used=True` y no se puede volver a usar.
>
> `ondelete='CASCADE'` — si se borra el usuario, se borran automáticamente todos sus tokens. Limpieza automática de datos huérfanos."

### 🎙️ Guión — Migraciones con Alembic

**[Terminal y mostrar carpeta `alembic/`]**

> "Los modelos definen la estructura, pero ¿cómo la creamos en la base de datos real? Con **Alembic** — el control de versiones para esquemas de base de datos. Igual que git gestiona versiones del código, Alembic gestiona versiones de la estructura de la BD."

```bash
# Así se inicializa Alembic (ya está hecho en este proyecto)
# alembic init alembic

# Crear una nueva migración (genera el archivo automáticamente)
alembic revision --autogenerate -m "create users and password_reset_tokens tables"

# Aplicar la migración a la base de datos
alembic upgrade head

# Ver el historial de migraciones
alembic history
```

> "El comando `--autogenerate` compara los modelos Python con el estado actual de la BD y genera el código SQL de migración automáticamente. Muy poderoso.
>
> `upgrade head` aplica todas las migraciones pendientes hasta la más reciente.
>
> ¿Por qué no simplemente `Base.metadata.create_all()`? Porque en producción, la BD ya tiene datos. Las migraciones permiten cambios incrementales sin perder datos existentes."

**[Mostrar archivo de migración en `alembic/versions/`]**

> "Cada archivo de migración tiene dos funciones: `upgrade()` y `downgrade()`. `upgrade` aplica el cambio, `downgrade` lo revierte. Siempre podemos volver atrás si algo sale mal."

---

## SECCIÓN 7 — Backend: Schemas Pydantic

### 🎙️ Guión

**[Abrir `app/schemas/user.py`]**

> "Los schemas Pydantic son la 'forma' de los datos que la API acepta y retorna. Son diferentes a los modelos ORM — los modelos definen la base de datos, los schemas definen la interfaz HTTP."

```python
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        if not re.search(r"[A-Z]", v):
          raise ValueError("La contraseña debe tener al menos una letra mayúscula")
        ...
        return v
```

> "Cuando el frontend envía un POST a `/register`, FastAPI extrae el body JSON y lo pasa por `UserCreate`. Si el email no es válido, si la contraseña es débil, si falta algún campo — FastAPI retorna automáticamente un error `422 Unprocessable Entity` con detalles de qué falló.
>
> Fijense en `EmailStr` — Pydantic valida automáticamente que sea un email con formato correcto.
>
> El validador de contraseña exige mínimo 8 caracteres, mayúsculas, minúsculas y números. Sin esta validación, alguien podría registrarse con contraseña '1' — inadmisible."

```python
class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    full_name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
```

> "El `UserResponse` define **qué datos retornamos**. Fijense que `hashed_password` no está aquí. Eso es crítico — nunca, bajo ninguna circunstancia, el hash de la contraseña debe aparecer en una respuesta de la API.
>
> `from_attributes=True` le dice a Pydantic que puede construir este schema a partir de un objeto SQLAlchemy (no solo de diccionarios)."

```python
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
```

> "El `TokenResponse` es lo que retorna el login. Dos tokens — el `access_token` de vida corta para las peticiones, y el `refresh_token` de vida larga para renovar el access token."

---

---

# 🎥 VIDEO 3 — Backend: Seguridad, Servicios y Endpoints

---

## SECCIÓN 8 — Backend: Seguridad — Hashing y JWT

### 🎙️ Guión — Hashing de contraseñas

**[Abrir `app/utils/security.py`]**

> "Este es el módulo más crítico de seguridad. Cualquier error aquí compromete todo el sistema de autenticación."

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```

> "Usamos `passlib` con el algoritmo `bcrypt`. ¿Por qué bcrypt y no MD5 o SHA256? Porque **bcrypt está diseñado específicamente para contraseñas**. A diferencia de SHA256 que es ultrarrápido, bcrypt es **deliberadamente lento** — procesa cientos de hashes por segundo, no millones. Esto hace que los ataques de fuerza bruta sean impracticables.
>
> bcrypt también incluye automáticamente un **salt** — datos aleatorios únicos por cada hash. Dos hashes de la misma contraseña serán siempre diferentes, lo que previene ataques con **rainbow tables**."

```python
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

> "Dos funciones fundamentales: `hash_password` para registrar o cambiar contraseña, y `verify_password` para el login. `verify` extrae el salt del hash almacenado, lo aplica a la contraseña ingresada y compara. Si coinciden, True. Si no, False."

### 🎙️ Guión — JWT

> "JWT — JSON Web Token. Es el mecanismo que usamos para autenticación **stateless** — el servidor no necesita recordar sesiones, toda la información necesaria está dentro del token."

```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzE2...
```

> "Un JWT tiene tres partes separadas por puntos:
>
> 1. **Header**: indica el algoritmo de firma (HS256)
> 2. **Payload**: los datos — quién es el usuario, cuándo expira
> 3. **Signature**: firma criptográfica que garantiza que el token no fue modificado
>
> El payload **no está cifrado** — cualquiera puede decodificarlo. Lo que sí está garantizado es la **integridad** — nadie puede modificar el payload sin invalidar la firma."

```python
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES  # 15 minutos
    )
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
```

> "El access token expira en **15 minutos**. Si alguien lo roba, solo lo puede usar durante 15 minutos.
>
> `settings.SECRET_KEY` es la clave secreta del servidor para firmar los tokens. Se lee del `.env` y nunca se hardcodea en el código. Si se filtra, hay que cambiarla inmediatamente."

```python
def create_refresh_token(data: dict, ...) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS  # 7 días
    )
    to_encode.update({"type": "refresh"})
    ...
```

> "El refresh token dura **7 días**. Su único propósito es obtener nuevos access tokens cuando este expira. Fijense el campo `type` — al decodificar verificamos que un refresh token no se use como access token y viceversa."

```python
def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
```

> "`jwt.decode` verifica automáticamente la firma **y** la expiración. Si el token fue modificado o ya expiró, lanza un `JWTError` que convertimos en un `401 Unauthorized`."

---

## SECCIÓN 9 — Backend: Dependencias inyectables

### 🎙️ Guión

**[Abrir `app/dependencies.py`]**

> "Las dependencias de FastAPI son funciones reutilizables que se 'inyectan' en los endpoints usando `Depends()`. Es el patrón de **Dependency Injection** aplicado a los endpoints HTTP."

```python
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

> "Esta función provee una sesión de base de datos. El patrón `try/finally` garantiza que la sesión **siempre se cierre**, incluso si ocurre un error. Si no cerramos las sesiones, agotamos el pool de conexiones y la app deja de responder.
>
> Es un generador con `yield` — FastAPI ejecuta el código hasta el `yield`, le pasa la sesión al endpoint, y cuando el endpoint termina, continúa con el `finally`."

```python
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
```

> "`OAuth2PasswordBearer` le dice a FastAPI dónde está el token — en el header `Authorization: Bearer <token>`. Lo extrae automáticamente y lo pasa a la función.
>
> Esta es la dependencia que protege los endpoints autenticados. Cuando un endpoint usa `Depends(get_current_user)`, FastAPI automáticamente:
>
> 1. Extrae el token del header
> 2. Lo decodifica y verifica
> 3. Busca al usuario en la BD
> 4. Si todo está bien, pasa el objeto `User` al endpoint
> 5. Si algo falla, retorna `401` y el endpoint ni siquiera se ejecuta"

---

## SECCIÓN 10 — Backend: Servicios — Lógica de Negocio

### 🎙️ Guión

**[Abrir `app/services/auth_service.py`]**

> "Los servicios contienen la **lógica de negocio** — las reglas de qué puede y no puede hacer el sistema. Los routers (endpoints) son delgados: solo reciben el request, llaman al service y retornan la respuesta. La lógica real está aquí."

```python
def register_user(db: Session, user_data: UserCreate) -> User:
    # 1. Verificar email duplicado
    stmt = select(User).where(User.email == user_data.email)
    existing_user = db.execute(stmt).scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    # 2. Crear usuario con contraseña hasheada
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hash_password(user_data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
```

> "El flujo de registro tiene tres pasos:
>
> 1. Verificar que el email no esté registrado — lanzamos HTTP 400 con mensaje descriptivo si ya existe
> 2. Crear el usuario con la contraseña hasheada — `hash_password()` es de `utils/security.py`
> 3. Guardar en la BD con `commit()` y refrescar para obtener los valores generados por PostgreSQL (como `created_at`)"

```python
def login_user(db: Session, login_data: UserLogin) -> TokenResponse:
    # 1. Buscar usuario
    user = db.execute(select(User).where(User.email == login_data.email)).scalar_one_or_none()

    # 2. Verificar contraseña (sin revelar si el email existe o no)
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas",
        )

    # 3. Generar tokens
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)
```

> "Fijense algo importante en el mensaje de error: `'Credenciales inválidas'`. No decimos `'usuario no encontrado'` ni `'contraseña incorrecta'`. ¿Por qué? Seguridad — si diferenciamos entre 'email no existe' y 'contraseña incorrecta', estamos dándole información a un atacante sobre qué emails están registrados. Un único mensaje genérico previene la **enumeración de usuarios**."

```python
async def forgot_password(db: Session, email: str) -> None:
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()

    # Siempre retornar éxito, aunque el email no exista
    if not user:
        return

    # Generar token único y guardarlo en BD
    token = str(uuid.uuid4())
    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
    )
    db.add(reset_token)
    db.commit()

    # Enviar email con el enlace de reset
    await send_password_reset_email(email=user.email, token=token)
```

> "Mismo patrón de seguridad: aunque el email no exista, retornamos éxito silenciosamente. El usuario siempre ve el mismo mensaje: `'Si el email está registrado, recibirás un enlace'`. Esto previene que un atacante use este endpoint para averiguar qué emails están registrados."

---

## SECCIÓN 11 — Backend: Routers y Endpoints

### 🎙️ Guión

**[Abrir `app/routers/auth.py`]**

> "Los routers son los endpoints HTTP — definen las rutas, los métodos HTTP, los schemas de entrada y salida, y delegan al service."

```python
router = APIRouter(
    prefix="/api/v1/auth",
    tags=["auth"],
)
```

> "El `prefix` hace que todos los endpoints de este router sean accesibles bajo `/api/v1/auth/...`. El versionamiento en la URL (`v1`) es una buena práctica — si en el futuro cambiamos la API, podemos crear `/api/v2/` sin romper los clientes existentes."

```python
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user_data: UserCreate, db: Session = Depends(get_db)) -> UserResponse:
    user = auth_service.register_user(db=db, user_data=user_data)
    return UserResponse.model_validate(user)
```

> "`response_model=UserResponse` — FastAPI garantiza que la respuesta **siempre** tenga la forma de `UserResponse`. Aunque el service retorne un objeto `User` con `hashed_password`, FastAPI lo filtra automáticamente. Esta es la segunda capa de protección contra la exposición de datos sensibles.
>
> `status_code=201 Created` — convenio HTTP: cuando se crea un recurso, se retorna 201, no 200."

```python
@router.post("/change-password", response_model=MessageResponse)
def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),  # ← Requiere auth
    db: Session = Depends(get_db),
) -> MessageResponse:
    ...
```

> "El parámetro `current_user: User = Depends(get_current_user)` es lo que hace este endpoint protegido. Si el request no tiene un `Authorization: Bearer <token>` válido, FastAPI retorna 401 automáticamente antes de ejecutar el cuerpo de la función."

```python
@router.post("/verify-email", response_model=MessageResponse)
def verify_email(request_data: VerifyEmailRequest, db: Session = Depends(get_db)) -> MessageResponse:
  auth_service.verify_email(db=db, token=request_data.token)
  return MessageResponse(message="Email verificado exitosamente")
```

> "Este endpoint completa el flujo de activación de cuenta. Después del registro, el usuario recibe un token por correo y debe verificar su email antes de iniciar sesión."

```python
@limiter.limit("5/minute")
@router.post("/register", ...)
...

@limiter.limit("10/minute")
@router.post("/login", ...)
...
```

> "Los límites por minuto en registro/login/forgot-password reducen ataques automatizados y son parte de las mitigaciones OWASP aplicadas al backend."

**[Terminal: probar endpoints en Swagger UI]**

```bash
# Con el servidor corriendo: http://localhost:8000/docs
# 1. Registrar usuario
# 2. Verificar email con POST /api/v1/auth/verify-email
# 3. Hacer login → copiar access_token
# 4. Usar "Authorize" en Swagger con el token
# 5. Probar GET /api/v1/users/me
```

---

---

# 🎥 VIDEO 4 — Backend: Testing completo con pytest

---

## SECCIÓN 12 — Backend: Tests con pytest

### 🎙️ Guión — Configuración de tests (`conftest.py`)

**[Abrir `app/tests/conftest.py`]**

> "Los tests garantizan que el código hace lo que creemos que hace. En este proyecto tenemos tests de integración — que prueban los endpoints HTTP de principio a fin, incluyendo la base de datos.
>
> El archivo `conftest.py` define los **fixtures** — bloques de configuración y datos reutilizables que se inyectan en los tests automáticamente."

```python
@pytest.fixture(scope="session", autouse=True)
def setup_database() -> Generator[None, None, None]:
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)
```

> "Este fixture se ejecuta **una sola vez** por sesión de pytest. Borra y recrea todas las tablas al inicio, y las borra al final. Los tests usan la misma base de datos pero con datos aislados — los tests **nunca** afectan la BD de desarrollo."

```python
@pytest.fixture()
def db() -> Generator[Session, None, None]:
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()  # ← Revierte todos los cambios del test
    connection.close()
```

> "Este es el truco clave del aislamiento: cada test corre dentro de una **transacción que nunca se hace commit**. Al final, se hace `rollback` — como si el test nunca hubiera ocurrido. El siguiente test empieza con la BD limpia."

```python
@pytest.fixture()
def client(db: Session) -> TestClient:
    app.dependency_overrides[get_db] = lambda: db
    return TestClient(app)
```

> "`dependency_overrides` — esta es la magia de FastAPI para testing. Le decimos: 'cuando alguien pida `get_db`, usa esta sesión de test en lugar de crear una nueva'. Así los tests usan la misma sesión con transacción que se revertirá."

### 🎙️ Guión — Casos de prueba (`test_auth.py`)

**[Abrir `app/tests/test_auth.py`]**

```python
class TestRegister:
    URL = "/api/v1/auth/register"

    def test_register_success(self, client: TestClient) -> None:
        response = client.post(self.URL, json={
            "email": "new@nn-company.com",
            "full_name": "New User",
            "password": "NewPass123",
        })

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "new@nn-company.com"
        assert "hashed_password" not in data  # ← Seguridad verificada
```

> "Cada test verifica un escenario específico. El más importante: verificar que `hashed_password` **no aparece** en la respuesta. Si este assertion falla, tenemos una fuga de datos crítica.
>
> Organizamos los tests en clases — `TestRegister`, `TestLogin`, `TestChangePassword` — para agrupar tests relacionados y compartir la URL del endpoint."

```python
    def test_register_weak_password(self, client: TestClient) -> None:
        response = client.post(self.URL, json={
            "email": "weak@nn-company.com",
            "full_name": "Weak User",
            "password": "weak",  # Contraseña débil
        })
        assert response.status_code == 422  # Validation error
```

> "Probamos los casos de **error** también — el 'unhappy path'. Verificamos que contraseñas débiles son rechazadas con 422."

**[Terminal: ejecutar tests]**

```bash
cd be
source .venv/bin/activate

# Ejecutar todos los tests con output detallado
pytest -v

# Con cobertura de código
pytest --cov=app --cov-report=term-missing

# Ejecutar solo los tests de registro
pytest app/tests/test_auth.py::TestRegister -v
```

> "La cobertura de código nos dice qué porcentaje del código fue ejecutado durante los tests. Buscamos mínimo 80% en los módulos de lógica de negocio.
>
> Veremos que 38 tests pasan en backend y se mantiene cobertura alta en los módulos críticos de autenticación."

---

---

# 🎥 VIDEO 5 — Frontend completo + Integración + Demo

---

## SECCIÓN 13 — Frontend: Configuración inicial

### 🎙️ Guión

**[Pantalla: terminal, desde la raíz del proyecto]**

```bash
cd fe

# Instalar dependencias
pnpm install

# Arrancar el servidor de desarrollo
pnpm dev
```

> "El frontend está construido con Vite — un bundler de nueva generación que es extremadamente rápido. El servidor de desarrollo está listo en menos de 1 segundo."

**[Abrir `fe/src/index.css`]**

> "TailwindCSS 4 está configurado como framework de estilos. En lugar de escribir CSS personalizado, usamos clases utilitarias directamente en los componentes. Esto acelera el desarrollo y mantiene la consistencia visual."

**[Abrir `vite.config.ts`]**

```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
```

> "El alias `@` apunta a la carpeta `src/`. Eso nos permite escribir `import { useAuth } from '@/hooks/useAuth'` en lugar de rutas relativas como `'../../hooks/useAuth'`. Mucho más limpio."

**[Abrir `tsconfig.app.json`]**

```json
"strict": true
```

> "TypeScript en modo estricto. Eso activa todas las verificaciones de tipo más restrictivas. Más trabajo al escribir el código, menos bugs en producción."

---

## SECCIÓN 14 — Frontend: Tipos TypeScript

### 🎙️ Guión

**[Abrir `fe/src/types/auth.ts`]**

> "Los tipos TypeScript son el 'contrato' entre el frontend y el backend. Definen exactamente qué forma tienen los datos que enviamos y recibimos.
>
> Esto se llama **contratos de tipos** — garantizan en tiempo de compilación que estamos enviando los datos correctos."

```typescript
export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

> "Fijense que estos tipos replican exactamente los schemas del backend. `RegisterRequest` corresponde al schema `UserCreate` de Pydantic, `TokenResponse` al `TokenResponse` de Python, etc.
>
> Si el backend cambia un campo, TypeScript nos avisará en todos los lugares del frontend que usan ese tipo — antes de que el error llegue a producción."

---

## SECCIÓN 15 — Frontend: Cliente HTTP con Axios

### 🎙️ Guión

**[Abrir `fe/src/api/axios.ts`]**

> "Configuramos una instancia de Axios con comportamiento predefinido — URL base, headers y manejo de errores — para que todos los módulos de API la usen consistentemente."

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});
```

> "`import.meta.env.VITE_API_URL` lee la variable de entorno del archivo `.env` de Vite. En desarrollo apunta a `localhost:8000`, en producción al dominio real. El default `|| "http://localhost:8000"` es solo un respaldo de seguridad."

```typescript
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

> "Los **interceptores** son middleware de Axios. Este interceptor de request se ejecuta antes de cada petición y adjunta automáticamente el access token en el header `Authorization`. Sin esto, tendríamos que pasarlo manualmente en cada llamada a la API.
>
> Usamos `sessionStorage` en lugar de `localStorage`. La diferencia: `sessionStorage` se borra al cerrar la pestaña del navegador, `localStorage` persiste. sessionStorage es más seguro para tokens de autenticación."

**[Abrir `fe/src/api/auth.ts`]**

```typescript
export async function loginUser(data: LoginRequest): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>(`${AUTH_PREFIX}/login`, data);
  return response.data;
}
```

> "Cada función de la API encapsula una llamada HTTP específica. Los componentes no usan `api.post()` directamente — llaman a `loginUser()`, `registerUser()`, etc. Si el endpoint del backend cambia, solo modificamos este archivo."

---

## SECCIÓN 16 — Frontend: Contexto de autenticación

### 🎙️ Guión

**[Abrir `fe/src/context/AuthContext.tsx`]**

> "El **Context API** de React permite compartir estado entre componentes sin pasar props manualmente por toda la jerarquía del árbol. El `AuthContext` es el corazón del frontend — cualquier componente puede saber si el usuario está autenticado y llamar a las acciones de auth."

```typescript
const [user, setUser] = useState<UserResponse | null>(null);
const [accessToken, setAccessToken] = useState<string | null>(() =>
  sessionStorage.getItem("access_token"),
);
const [isLoading, setIsLoading] = useState<boolean>(true);

const isAuthenticated = !!user && !!accessToken;
```

> "El estado de autenticación tiene tres partes:
>
> - `user` — los datos del usuario logueado (null si no hay sesión)
> - `accessToken` — el JWT actual
> - `isLoading` — true mientras verificamos si hay una sesión guardada al arrancar
>
> `isAuthenticated` es un derivado — es `true` solo cuando hay usuario **y** hay token. Si falta cualquiera de los dos, el usuario no está autenticado."

```typescript
useEffect(() => {
  const restoreSession = async () => {
    const storedToken = sessionStorage.getItem("access_token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };
  restoreSession();
}, []);
```

> "Al arrancar la aplicación, verificamos si hay un token guardado. Si lo hay, llamamos a `GET /api/v1/users/me` para validar que el token sigue siendo válido y obtener los datos del usuario.
>
> Esto es lo que da la experiencia de 'recordar sesión' — al refrescar la página, si el token sigue válido, el usuario sigue autenticado."

---

## SECCIÓN 17 — Frontend: Hook `useAuth` y rutas protegidas

### 🎙️ Guión

**[Abrir `fe/src/hooks/useAuth.ts`]**

```typescript
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider.");
  }

  return context;
}
```

> "El hook `useAuth` es la API pública del sistema de autenticación. Cualquier componente que necesite saber si el usuario está autenticado, obtener sus datos o llamar a acciones como logout, usa este hook.
>
> El error si se usa fuera del AuthProvider ayuda a detectar bugs de configuración inmediatamente en desarrollo."

**[Abrir `fe/src/components/ProtectedRoute.tsx`]**

```typescript
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>; // Spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

> "El `ProtectedRoute` envuelve las rutas que requieren autenticación. Si el usuario no está autenticado, redirige a `/login`.
>
> El estado `isLoading` es crucial — al arrancar la app verificamos la sesión antes de saber si el usuario está autenticado. Sin este loading, la app redirigiría brevemente al login incluso cuando el usuario sí tiene sesión."

**[Abrir `fe/src/App.tsx` — mostrar cómo se usan las rutas]**

```tsx
<Routes>
  {/* Rutas públicas */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* Rutas protegidas */}
  <Route
    element={
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    }
  >
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/change-password" element={<ChangePasswordPage />} />
  </Route>
</Routes>
```

> "El `ProtectedRoute` envuelve el grupo de rutas que requieren sesión. Si el usuario intenta acceder a `/dashboard` sin estar autenticado — aunque sea escribiendo la URL directamente — el `ProtectedRoute` lo detecta y lo redirige a `/login`."

---

## SECCIÓN 18 — Frontend: Páginas de autenticación

### 🎙️ Guión

**[Navegar por las páginas en el navegador mientras se explica]**

> "Tenemos seis páginas principales en el frontend:
>
> - `LoginPage` — formulario de inicio de sesión
> - `RegisterPage` — formulario de registro
> - `DashboardPage` — panel principal (ruta protegida)
> - `ChangePasswordPage` — cambio de contraseña (ruta protegida)
> - `ForgotPasswordPage` — solicitar recuperación por email
> - `ResetPasswordPage` — establecer nueva contraseña con el token del email
>
> Además, en backend existe el endpoint `POST /api/v1/auth/verify-email` que activa la cuenta tras el registro.

**[Mostrar `LoginPage.tsx` brevemente]**

> "Cada página usa `useAuth()` para acceder a las acciones. Por ejemplo, `LoginPage` llama a `auth.login(email, password)` al enviar el formulario. El contexto maneja el resto: llama a la API, guarda los tokens, actualiza el estado y redirige al dashboard.
>
> Los formularios usan estados de React para manejar los campos. Los errores del backend se muestran con el componente `Alert`, los estados de carga con el atributo `disabled` en el botón.
>
> El diseño sigue Mobile-First — los formularios se ven bien en móvil, tablet y escritorio. Dark mode implementado con las clases `dark:` de Tailwind."

---

## SECCIÓN 19 — Demostración del flujo completo

### 🎙️ Guión

**[Pantalla dividida: terminal con logs del backend | navegador | herramienta de base de datos]**

> "Vamos a recorrer el flujo completo del sistema, desde el registro hasta el logout."

### Paso 1: Arrancar todos los servicios

```bash
# Terminal 1: Base de datos
docker compose up -d db

# Terminal 2: Backend
cd be && source .venv/bin/activate && uvicorn app.main:app --reload

# Terminal 3: Frontend
cd fe && pnpm dev
```

### Paso 2: Registro

**[Ir a http://localhost:5173/register]**

> "Rellenamos el formulario con email, nombre y contraseña fuerte. Al enviar, el frontend llama a `POST /api/v1/auth/register`.
>
> En la terminal del backend vemos el request llegar. En la BD, si miramos la tabla `users`, vemos el nuevo registro — con la contraseña como hash bcrypt, nunca en texto plano.
>
> Importante: inicialmente queda con `is_email_verified=false` hasta completar la verificación."

### Paso 3: Verificación de email

> "Después del registro, simulamos la recepción del enlace de verificación y ejecutamos `POST /api/v1/auth/verify-email` con el token.
>
> En base de datos se marca el token como usado y el usuario pasa a `is_email_verified=true`."

### Paso 4: Login y tokens

**[Ir a /login]**

> "Al hacer login, el backend devuelve `access_token` y `refresh_token`. El frontend los guarda en `sessionStorage`.
>
> En las DevTools del navegador (Application → Session Storage), vemos los tokens almacenados."

### Paso 5: Acceder al dashboard

> "Redireccionamos al dashboard. El `ProtectedRoute` verifica la autenticación — hay token válido, deja pasar.
>
> En el dashboard vemos los datos del usuario, que el frontend obtuvo de `GET /api/v1/users/me`."

### Paso 6: Token expirado — refresh automático

> "El access token expira cada 15 minutos. Si el frontend intenta hacer una petición con un token expirado, recibe 401. El interceptor de Axios captura ese 401 y automáticamente llama a `POST /api/v1/auth/refresh` con el refresh token para obtener uno nuevo. El usuario no nota nada."

### Paso 7: Cambio de contraseña

**[Ir a /change-password]**

> "Cambiamos la contraseña. El endpoint requiere la contraseña actual — capa extra de seguridad. En los logs del backend vemos el proceso: verificar contraseña actual, hashear la nueva, actualizar en BD."

### Paso 8: Recuperación de contraseña

**[Ir a /forgot-password]**

> "Simulamos olvidar la contraseña. Ingresamos el email, el backend genera un token y lo 'envía' por email. En desarrollo, el enlace aparece en los logs del servidor.
>
> Copiamos el enlace, vamos a `/reset-password?token=...`, y establecemos una nueva contraseña. El token se marca como `used=True` en la BD y no puede usarse de nuevo."

### Paso 9: Logout

> "Al cerrar sesión, se borran los tokens de `sessionStorage` y el estado del contexto se limpia. Intentar acceder a `/dashboard` redirige al login."

---

## SECCIÓN 20 — Cierre y recapitulación

### 🎙️ Guión

**[Pantalla: diapositiva con resumen]**

> "Hemos construido un sistema de autenticación completo con:
>
> **Backend:** FastAPI con Python, utilizando arquitectura en capas — routers, services, models y schemas. Autenticación con JWT, contraseñas hasheadas con bcrypt, verificación de email previa al login, mitigaciones OWASP Top 10 (rate limiting, audit logging, hardening de headers y Swagger condicionado por entorno) y 38 tests de integración en verde.
>
> **Frontend:** React con TypeScript, Context API para el estado global de auth, interceptores de Axios para tokens automáticos, protección de rutas y mejoras de accesibilidad ARIA/WCAG con tests frontend en verde.
>
> **Infraestructura:** PostgreSQL en Docker, migraciones con Alembic, variables de entorno para toda la configuración sensible.
>
> Los conceptos más importantes que aplicamos:
>
> - **Separation of Concerns** — cada capa del backend tiene una sola responsabilidad
> - **Security by default** — contraseñas hasheadas, tokens cortos, mensajes de error genéricos
> - **Fail fast** — validación de datos con Pydantic al inicio de cada operación
> - **Testabilidad** — la inyección de dependencias de FastAPI hace que los tests sean limpios y aislados
>
> Todo el código tiene comentarios pedagógicos con el formato ¿Qué? ¿Para qué? ¿Impacto? — para que puedan revisarlo en su propio tiempo y entender el razonamiento detrás de cada decisión.
>
> El código completo está disponible en el repositorio. Recuerden revisar el `README.md` para las instrucciones de arranque rápido.
>
> ¡Hasta el próximo video!"

---

## SECCIÓN 21 — Actualizaciones recientes (OWASP + docs)

### 🎙️ Guión

**[Pantalla: carpeta `_docs/` abierta + `be/app/main.py`]**

> "Antes de cerrar, mostramos las mejoras más recientes para dejar trazabilidad técnica:
>
> 1. Seguridad OWASP Top 10 reforzada en backend.
> 2. Endpoint de verificación de email integrado al flujo.
> 3. Documentación de Fase 8 completada y enlazada.
> 4. Guía de accesibilidad ARIA/WCAG consolidada para frontend.
>
> En seguridad, ya tenemos rate limiting con `slowapi`, logging de auditoría para eventos sensibles y headers HTTP de hardening.
>
> En configuración, `ENVIRONMENT` controla Swagger/Redoc: habilitados en desarrollo, deshabilitados en producción.
>
> Y en documentación, se consolidaron arquitectura, catálogo de endpoints y esquema de base de datos para que cualquier persona del equipo pueda entender el sistema sin leer todo el código."

> "Esta sección es ideal para una evidencia final de calidad: mostramos código, controles de seguridad y documentación alineada con los últimos desarrollos."

---

## 📝 Notas de Producción para el Video

### Configuración recomendada de pantalla

- **Resolución:** 1920×1080 (1080p)
- **Zoom del editor:** 14-16px para que sea legible
- **Terminal:** fuente Fira Code o Fira Mono, tamaño 14-16px
- **Navegador:** sin extensiones que puedan interferir

### Herramientas adicionales sugeridas

- **DBeaver** o **TablePlus** — para mostrar la BD visualmente al explicar modelos
- **Insomnia** o **Postman** — alternativa a Swagger para probar endpoints
- **httpie** — cliente HTTP de terminal más legible que curl

### Comandos de referencia rápida

```bash
# Backend — arranque
cd be && source .venv/bin/activate && uvicorn app.main:app --reload

# Backend — tests
cd be && source .venv/bin/activate && pytest -v --cov=app --cov-report=term-missing

# Backend — linting
cd be && source .venv/bin/activate && ruff check app/ && ruff format app/

# Frontend — desarrollo
cd fe && pnpm dev

# Frontend — tests
cd fe && pnpm test

# Base de datos — levantar
docker compose up -d db

# Base de datos — ver logs
docker compose logs -f db

# Alembic — nueva migración
cd be && source .venv/bin/activate && alembic revision --autogenerate -m "descripcion"

# Alembic — aplicar migraciones
cd be && source .venv/bin/activate && alembic upgrade head
```

### Orden de archivos a mostrar (resumen)

| Orden | Archivo                                       | Concepto principal                        |
| ----- | --------------------------------------------- | ----------------------------------------- |
| 01    | `docker-compose.yml`                          | Infraestructura y servicios               |
| 02    | `be/.env.example`                             | Variables de entorno                      |
| 03    | `be/requirements.txt`                         | Dependencias Python                       |
| 04    | `be/app/config.py`                            | Settings + `ENVIRONMENT`                  |
| 05    | `be/app/database.py`                          | Engine, Session, Base de SQLAlchemy       |
| 06    | `be/app/main.py`                              | FastAPI app, CORS, security headers, docs |
| 07    | `be/app/models/user.py`                       | Modelo ORM User                           |
| 08    | `be/app/models/password_reset_token.py`       | Modelo ORM PasswordResetToken             |
| 09    | `be/app/models/email_verification_token.py`   | Modelo ORM EmailVerificationToken         |
| 10    | `alembic/versions/*.py`                       | Migraciones Alembic                       |
| 11    | `be/app/schemas/user.py`                      | Schemas Pydantic                          |
| 12    | `be/app/utils/security.py`                    | Hashing bcrypt + JWT                      |
| 13    | `be/app/utils/limiter.py`                     | Rate limiting (OWASP A04)                 |
| 14    | `be/app/utils/audit_log.py`                   | Auditoría de seguridad (OWASP A09)        |
| 15    | `be/app/dependencies.py`                      | get_db + get_current_user                 |
| 16    | `be/app/services/auth_service.py`             | Lógica de negocio                         |
| 17    | `be/app/utils/email.py`                       | Envío de emails                           |
| 18    | `be/app/routers/auth.py`                      | Endpoints de auth (+ verify-email)        |
| 19    | `be/app/routers/users.py`                     | Endpoint GET /me                          |
| 20    | `be/app/tests/conftest.py`                    | Fixtures de testing                       |
| 21    | `be/app/tests/test_auth.py`                   | Tests de integración (38 casos)           |
| 22    | `fe/src/types/auth.ts`                        | Tipos TypeScript                          |
| 23    | `fe/src/api/axios.ts`                         | Axios + interceptores                     |
| 24    | `fe/src/api/auth.ts`                          | Cliente HTTP de auth                      |
| 25    | `fe/src/context/AuthContext.tsx`              | Context API de auth                       |
| 26    | `fe/src/hooks/useAuth.ts`                     | Hook personalizado                        |
| 27    | `fe/src/components/ProtectedRoute.tsx`        | Rutas protegidas                          |
| 28    | `fe/src/App.tsx`                              | Enrutamiento principal                    |
| 29    | `fe/src/pages/*.tsx`                          | Páginas de la app                         |
| 30    | `_docs/referencia-tecnica/architecture.md`    | Arquitectura actualizada                  |
| 31    | `_docs/referencia-tecnica/api-endpoints.md`   | Catálogo completo de endpoints            |
| 32    | `_docs/referencia-tecnica/database-schema.md` | Esquema y relaciones de BD                |
| 33    | `_docs/conceptos/owasp-top-10.md`             | Mitigaciones de seguridad OWASP           |
| 34    | `_docs/conceptos/accesibilidad-aria-wcag.md`  | Evidencia de accesibilidad frontend       |
