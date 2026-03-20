# HU-003 — Consulta de perfil

<!--
  ¿Qué? Historia de usuario que describe la visualización del perfil del usuario.
  ¿Para qué? Formalizar la necesidad del usuario de ver su información personal tras autenticarse.
  ¿Impacto? Sin acceso al perfil, el usuario no puede verificar ni confirmar sus datos.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | HU-003                                                 |
| **Título**        | Consulta de perfil                                     |
| **Módulo**        | Usuarios                                               |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementada                                           |
| **RF asociados**  | RF-007                                                 |

---

## Historia

**Como** usuario autenticado,
**quiero** ver mi información de perfil (nombre, correo, fecha de registro),
**para** confirmar mis datos personales y verificar que mi cuenta está activa.

---

## Criterios de aceptación

### CA-003.1 — Visualización de datos del perfil
- **Dado que** estoy autenticado y accedo al dashboard (`/dashboard`),
- **cuando** la página carga,
- **entonces** debo ver mi nombre completo, correo electrónico y fecha de creación de la cuenta.

### CA-003.2 — Nombre en la barra de navegación
- **Dado que** estoy autenticado en cualquier página protegida,
- **cuando** miro la barra de navegación,
- **entonces** debo ver mi nombre completo (visible en pantallas medianas y grandes).

### CA-003.3 — Enlace a cambio de contraseña
- **Dado que** estoy en el dashboard,
- **cuando** quiero cambiar mi contraseña,
- **entonces** debo encontrar un enlace o botón que me lleve a la página de cambio de contraseña.

### CA-003.4 — Botón de cerrar sesión
- **Dado que** estoy autenticado,
- **cuando** quiero cerrar mi sesión,
- **entonces** debo encontrar un botón "Salir" con icono de logout en la barra de navegación.

### CA-003.5 — Datos actualizados
- **Dado que** acabo de registrarme o iniciar sesión,
- **cuando** accedo al dashboard,
- **entonces** los datos mostrados deben reflejar la información más reciente de mi cuenta.
