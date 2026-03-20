# HU-006 — Cierre de sesión

<!--
  ¿Qué? Historia de usuario que describe el cierre de sesión del usuario autenticado.
  ¿Para qué? Formalizar la necesidad del usuario de terminar su sesión de forma segura.
  ¿Impacto? Sin logout, el usuario no podría cerrar sesión de forma deliberada.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | HU-006                                                 |
| **Título**        | Cierre de sesión                                       |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Media                                                  |
| **Estado**        | Implementada                                           |
| **RF asociados**  | RF-008                                                 |

---

## Historia

**Como** usuario autenticado,
**quiero** cerrar mi sesión cuando termine de usar el sistema,
**para** proteger mi cuenta en dispositivos compartidos.

---

## Criterios de aceptación

### CA-006.1 — Botón de logout visible
- **Dado que** estoy autenticado en cualquier página protegida,
- **cuando** miro la barra de navegación,
- **entonces** debo ver un botón "Salir" con icono de logout en la parte derecha.

### CA-006.2 — Logout exitoso
- **Dado que** hago clic en el botón "Salir",
- **cuando** se procesa el logout,
- **entonces** debo ser redirigido a la página de login (`/login`).

### CA-006.3 — Tokens eliminados
- **Dado que** cerré sesión exitosamente,
- **cuando** intento acceder a una ruta protegida directamente por URL,
- **entonces** debo ser redirigido al login, ya que los tokens fueron eliminados.

### CA-006.4 — Re-login inmediato
- **Dado que** cerré sesión,
- **cuando** ingreso mis credenciales nuevamente en el login,
- **entonces** debo poder iniciar sesión sin problemas.
