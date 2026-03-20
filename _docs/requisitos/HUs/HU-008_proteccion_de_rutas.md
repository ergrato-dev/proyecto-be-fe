# HU-008 — Protección de rutas y navegación

<!--
  ¿Qué? Historia de usuario que describe la protección de rutas según estado de autenticación.
  ¿Para qué? Formalizar la necesidad de restringir acceso a páginas protegidas.
  ¿Impacto? Sin protección, cualquier usuario podría acceder a información privada.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | HU-008                                                 |
| **Título**        | Protección de rutas y navegación                       |
| **Módulo**        | Autenticación / Frontend                               |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementada                                           |
| **RF asociados**  | RF-009                                                 |

---

## Historia

**Como** sistema,
**quiero** proteger las rutas que requieren autenticación y redirigir a los usuarios según su estado,
**para** evitar que usuarios no autenticados accedan a información protegida y que usuarios autenticados vean formularios de login innecesarios.

---

## Criterios de aceptación

### CA-008.1 — Redirección de usuario no autenticado
- **Dado que** no he iniciado sesión,
- **cuando** intento acceder al dashboard (`/dashboard`) o cambio de contraseña (`/change-password`),
- **entonces** debo ser redirigido automáticamente al login (`/login`).

### CA-008.2 — Redirección de usuario autenticado a rutas públicas
- **Dado que** ya he iniciado sesión,
- **cuando** intento acceder al login (`/login`) o registro (`/register`),
- **entonces** debo ser redirigido automáticamente al dashboard (`/dashboard`).

### CA-008.3 — Ruta raíz
- **Dado que** accedo a la URL raíz (`/`),
- **cuando** la página carga,
- **entonces** debo ser redirigido al login si no estoy autenticado, o al dashboard si lo estoy.

### CA-008.4 — Rutas inexistentes
- **Dado que** accedo a una URL que no existe (por ejemplo, `/no-existe`),
- **cuando** la página procesa la ruta,
- **entonces** debo ser redirigido al login.

### CA-008.5 — Navegación limpia
- **Dado que** soy redirigido automáticamente,
- **cuando** reviso el historial del navegador,
- **entonces** las redirecciones deben usar `replace` para no ensuciar el historial de navegación.
