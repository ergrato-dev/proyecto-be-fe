# HU-002 — Inicio de sesión

<!--
  ¿Qué? Historia de usuario que describe el inicio de sesión en el sistema.
  ¿Para qué? Formalizar la necesidad del usuario de autenticarse para acceder a funcionalidades protegidas.
  ¿Impacto? Sin login, el sistema no puede identificar ni autorizar a los usuarios.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | HU-002                                                 |
| **Título**        | Inicio de sesión                                       |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementada                                           |
| **RF asociados**  | RF-002, RF-003                                         |

---

## Historia

**Como** usuario registrado,
**quiero** iniciar sesión con mi correo electrónico y contraseña,
**para** acceder a mi perfil y las funcionalidades protegidas del sistema.

---

## Criterios de aceptación

### CA-002.1 — Formulario de login
- **Dado que** estoy en la página de login (`/login`),
- **cuando** veo el formulario,
- **entonces** debo encontrar campos para correo electrónico y contraseña, con iconos de sobre y candado respectivamente.

### CA-002.2 — Login exitoso con redirección
- **Dado que** he ingresado credenciales válidas (correo y contraseña correctos),
- **cuando** envío el formulario,
- **entonces** inicio sesión exitosamente y soy redirigido al dashboard (`/dashboard`).

### CA-002.3 — Credenciales inválidas
- **Dado que** he ingresado credenciales incorrectas (correo o contraseña erróneos),
- **cuando** envío el formulario,
- **entonces** debo ver un mensaje de error genérico sin indicar si el error es del correo o la contraseña.

### CA-002.4 — Toggle de visibilidad de contraseña
- **Dado que** estoy escribiendo mi contraseña,
- **cuando** hago clic en el botón de ojo junto al campo de contraseña,
- **entonces** la contraseña se muestra en texto plano, y al hacer clic de nuevo se oculta.

### CA-002.5 — Estado de carga
- **Dado que** envié el formulario de login,
- **cuando** la solicitud está en proceso,
- **entonces** el botón "Iniciar sesión" debe estar deshabilitado y mostrar indicador de carga.

### CA-002.6 — Enlace a registro
- **Dado que** estoy en la página de login y no tengo cuenta,
- **cuando** busco una forma de registrarme,
- **entonces** debo encontrar un enlace "Crear cuenta" que me lleve a la página de registro.

### CA-002.7 — Enlace a recuperación de contraseña
- **Dado que** estoy en la página de login y olvidé mi contraseña,
- **cuando** busco una forma de recuperarla,
- **entonces** debo encontrar un enlace "¿Olvidaste tu contraseña?" que me lleve a la página de forgot-password.

### CA-002.8 — Renovación automática de sesión
- **Dado que** mi access token ha expirado pero mi refresh token sigue vigente,
- **cuando** el sistema detecta la expiración,
- **entonces** debe renovar automáticamente el access token sin que yo tenga que volver a iniciar sesión.
