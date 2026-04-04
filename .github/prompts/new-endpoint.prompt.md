---
description: "Crea un endpoint FastAPI completo: router, schema Pydantic, servicio y test. Usar cuando se necesite agregar una nueva ruta a la API."
name: "Nuevo endpoint FastAPI"
argument-hint: "Describe el endpoint: método HTTP, ruta, qué hace, qué datos recibe y devuelve"
agent: "agent"
---

# Nuevo endpoint FastAPI — NN Auth System

Crea un endpoint FastAPI completo siguiendo las convenciones del proyecto.

## Convenciones obligatorias

- **Idioma del código**: inglés (nombres de funciones, variables, clases, rutas, columnas)
- **Idioma de comentarios y docstrings**: español
- **Comentarios pedagógicos**: cada bloque significativo responde ¿Qué? ¿Para qué? ¿Impacto?
- **Type hints**: obligatorios en todos los parámetros y retornos
- **Cabecera de archivo**: incluir si se crea un archivo nuevo (ver copilot-instructions.md §3.4)

## Lo que debes generar

### 1. Schema Pydantic (`be/app/schemas/`)

- Request schema con validaciones estrictas (tipo, longitud, formato)
- Response schema con `model_config = ConfigDict(from_attributes=True)`
- Usar `EmailStr` para emails, `SecretStr` para passwords si aplica
- Ejemplo de referencia: [be/app/schemas/user.py](../../../be/app/schemas/user.py)

### 2. Función en el servicio (`be/app/services/auth_service.py`)

- Lógica de negocio pura — sin lógica HTTP ni de presentación
- Recibe la session de BD como parámetro (`db: Session`)
- Lanza `HTTPException` con código HTTP apropiado ante errores de negocio
- Ejemplo de referencia: [be/app/services/auth_service.py](../../../be/app/services/auth_service.py)

### 3. Endpoint en el router (`be/app/routers/`)

- Usar el router existente o crear uno nuevo si corresponde a un nuevo dominio
- Usar `Depends(get_db)` y `Depends(get_current_user)` según corresponda
- `response_model` explícito siempre
- Endpoints de auth van en [be/app/routers/auth.py](../../../be/app/routers/auth.py)
- Endpoints de usuario van en [be/app/routers/users.py](../../../be/app/routers/users.py)

### 4. Test en pytest (`be/app/tests/test_auth.py`)

- Una clase de test por endpoint (`class TestNombreEndpoint`)
- Casos mínimos: éxito, input inválido, no autenticado (si aplica), error de negocio
- Usar el `AsyncClient` de httpx con el fixture `async_client` de conftest
- Ejemplo de referencia: [be/app/tests/test_auth.py](../../../be/app/tests/test_auth.py)

## Prefijo base de la API

Todos los endpoints se registran bajo `/api/v1/`. Verificar que el router esté
incluido en [be/app/main.py](../../../be/app/main.py).

## Seguridad (OWASP)

- Validar todos los inputs con Pydantic — nunca confiar en datos del cliente
- Usar mensajes de error genéricos en auth (no revelar si un email existe)
- Rate limiting ya configurado vía `slowapi` en el router de auth
- Passwords: siempre `hash_password()` antes de almacenar, nunca texto plano

## Descripción del endpoint a crear

$input
