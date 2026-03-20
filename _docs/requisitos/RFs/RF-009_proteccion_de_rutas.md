# RF-009 — Protección de rutas

<!--
  ¿Qué? Requisito funcional que define la protección de rutas que requieren autenticación.
  ¿Para qué? Documentar cómo se restringe el acceso a páginas protegidas.
  ¿Impacto? Sin protección de rutas, cualquier usuario podría acceder al dashboard sin autenticarse.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RF-009                                                 |
| **Nombre**        | Protección de rutas                                    |
| **Módulo**        | Autenticación / Frontend                               |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementado                                           |
| **Fecha**         | Febrero 2026                                           |

---

## Descripción

El sistema debe proteger las rutas que requieren autenticación, redirigiendo a la página de login a cualquier usuario no autenticado que intente acceder a ellas. Igualmente, un usuario ya autenticado que intente acceder a las rutas públicas (login, registro) debe ser redirigido al dashboard.

---

## Rutas protegidas (requieren autenticación)

| Ruta                | Página               |
| ------------------- | -------------------- |
| `/dashboard`        | Dashboard principal  |
| `/change-password`  | Cambio de contraseña |

---

## Rutas públicas (solo para usuarios no autenticados)

| Ruta                | Página                       |
| ------------------- | ---------------------------- |
| `/login`            | Inicio de sesión             |
| `/register`         | Registro de cuenta           |
| `/forgot-password`  | Solicitud de recuperación    |
| `/reset-password`   | Restablecimiento de contraseña |

---

## Proceso

### Usuario no autenticado intenta acceder a ruta protegida:
1. El componente `ProtectedRoute` verifica si existe un usuario autenticado en el contexto.
2. Si no hay usuario autenticado, redirige automáticamente a `/login`.

### Usuario autenticado intenta acceder a ruta pública:
1. Las rutas públicas verifican si el usuario ya está autenticado.
2. Si está autenticado, redirige automáticamente a `/dashboard`.

### Rutas inexistentes:
1. Cualquier ruta no definida redirige a `/login`.

---

## Reglas de negocio

- RN-030: Un usuario no autenticado nunca puede ver el contenido de una ruta protegida.
- RN-031: La redirección usa `replace` para no ensuciar el historial de navegación.
- RN-032: La ruta raíz (`/`) redirige a `/login` si no está autenticado.
- RN-033: Las rutas no definidas (`*`) redirigen a `/login`.
