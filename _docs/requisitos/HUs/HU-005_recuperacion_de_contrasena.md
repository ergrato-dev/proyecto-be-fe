# HU-005 — Recuperación de contraseña

<!--
  ¿Qué? Historia de usuario que describe el flujo completo de recuperación de contraseña olvidada.
  ¿Para qué? Formalizar la necesidad del usuario de recuperar acceso a su cuenta cuando olvida la contraseña.
  ¿Impacto? Sin recuperación, un usuario que olvida su contraseña perdería acceso permanente.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | HU-005                                                 |
| **Título**        | Recuperación de contraseña                             |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementada                                           |
| **RF asociados**  | RF-005, RF-006                                         |

---

## Historia

**Como** usuario que olvidó su contraseña,
**quiero** solicitar un enlace de recuperación por correo electrónico y restablecer mi contraseña,
**para** recuperar el acceso a mi cuenta sin necesidad de crear una nueva.

---

## Criterios de aceptación

### Paso 1 — Solicitud de recuperación (Forgot Password)

### CA-005.1 — Formulario de solicitud
- **Dado que** estoy en la página de recuperación de contraseña (`/forgot-password`),
- **cuando** veo el formulario,
- **entonces** debo encontrar un campo de correo electrónico con icono de sobre.

### CA-005.2 — Solicitud procesada
- **Dado que** ingresé un correo electrónico (exista o no en el sistema),
- **cuando** envío el formulario,
- **entonces** debo ver siempre el mismo mensaje genérico de éxito: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."

### CA-005.3 — No revelar existencia de email
- **Dado que** ingresé un correo que no está registrado,
- **cuando** envío el formulario,
- **entonces** la respuesta debe ser idéntica a cuando el correo sí existe (por seguridad).

### CA-005.4 — Enlace de vuelta a login
- **Dado que** estoy en la página de forgot-password,
- **cuando** recuerdo mi contraseña,
- **entonces** debo encontrar un enlace "Volver al inicio de sesión" para regresar al login.

---

### Paso 2 — Restablecimiento de contraseña (Reset Password)

### CA-005.5 — Acceso con token válido
- **Dado que** recibí un enlace de recuperación por email con un token válido,
- **cuando** accedo a `/reset-password?token=<uuid>`,
- **entonces** debo ver un formulario con campos para nueva contraseña y confirmación, con iconos contextuales.

### CA-005.6 — Enlace sin token
- **Dado que** accedo a `/reset-password` sin token en la URL,
- **cuando** la página carga,
- **entonces** debo ver un mensaje de error: "El enlace de recuperación es inválido o ha expirado" con un enlace para solicitar uno nuevo.

### CA-005.7 — Validación de nueva contraseña
- **Dado que** ingreso una nueva contraseña que no cumple los requisitos de fortaleza,
- **cuando** envío el formulario,
- **entonces** debo ver un mensaje de error descriptivo indicando qué requisito falta.

### CA-005.8 — Confirmación de nueva contraseña
- **Dado que** la nueva contraseña y su confirmación no coinciden,
- **cuando** envío el formulario,
- **entonces** debo ver el mensaje: "Las contraseñas no coinciden".

### CA-005.9 — Reset exitoso
- **Dado que** completé el formulario correctamente con un token válido,
- **cuando** envío el formulario,
- **entonces** debo ver un mensaje de éxito: "Contraseña restablecida exitosamente. Ya puedes iniciar sesión." y un botón para ir al login.

### CA-005.10 — Token expirado o usado
- **Dado que** intento usar un token que ya expiró (más de 1 hora) o ya fue utilizado,
- **cuando** envío el formulario,
- **entonces** debo ver un mensaje de error indicando que el token es inválido o expirado.

### CA-005.11 — Login con nueva contraseña
- **Dado que** restablecí mi contraseña exitosamente,
- **cuando** voy al login e ingreso la nueva contraseña,
- **entonces** debo iniciar sesión correctamente y ser redirigido al dashboard.
