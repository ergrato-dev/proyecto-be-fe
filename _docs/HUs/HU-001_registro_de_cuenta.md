# HU-001 — Registro de cuenta

<!--
  ¿Qué? Historia de usuario que describe el registro de un nuevo usuario en el sistema.
  ¿Para qué? Formalizar la necesidad del usuario de crear una cuenta para acceder al sistema.
  ¿Impacto? Es la puerta de entrada al sistema — sin registro, no hay usuarios.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | HU-001                                                 |
| **Título**        | Registro de cuenta                                     |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementada                                           |
| **RF asociados**  | RF-001                                                 |

---

## Historia

**Como** usuario nuevo,
**quiero** crear una cuenta proporcionando mi nombre, correo electrónico y contraseña,
**para** poder acceder a las funcionalidades del sistema NN Auth.

---

## Criterios de aceptación

### CA-001.1 — Formulario de registro completo
- **Dado que** estoy en la página de registro (`/register`),
- **cuando** veo el formulario,
- **entonces** debo encontrar campos para nombre completo, correo electrónico, contraseña y confirmación de contraseña, cada uno con su icono contextual a la izquierda.

### CA-001.2 — Validación de nombre
- **Dado que** estoy completando el formulario de registro,
- **cuando** ingreso un nombre con menos de 2 caracteres y envío el formulario,
- **entonces** debo ver un mensaje de error: "El nombre debe tener al menos 2 caracteres".

### CA-001.3 — Validación de correo obligatorio
- **Dado que** estoy completando el formulario de registro,
- **cuando** dejo el campo de correo vacío y envío el formulario,
- **entonces** debo ver un mensaje de error: "El correo es obligatorio".

### CA-001.4 — Validación de contraseña débil
- **Dado que** estoy completando el formulario de registro,
- **cuando** ingreso una contraseña que no cumple los requisitos mínimos (menos de 8 caracteres, sin mayúscula, sin minúscula o sin número),
- **entonces** debo ver un mensaje de error descriptivo indicando qué requisito falta.

### CA-001.5 — Confirmación de contraseña
- **Dado que** estoy completando el formulario de registro,
- **cuando** la contraseña y su confirmación no coinciden,
- **entonces** debo ver el mensaje: "Las contraseñas no coinciden".

### CA-001.6 — Registro exitoso con redirección
- **Dado que** he completado todos los campos correctamente,
- **cuando** envío el formulario,
- **entonces** mi cuenta se crea exitosamente y soy redirigido automáticamente al dashboard (`/dashboard`).

### CA-001.7 — Email duplicado
- **Dado que** intento registrarme con un correo que ya existe en el sistema,
- **cuando** envío el formulario,
- **entonces** debo ver un mensaje de error indicando que el email ya está registrado.

### CA-001.8 — Estado de carga
- **Dado que** envié el formulario de registro,
- **cuando** la solicitud está en proceso,
- **entonces** el botón "Crear cuenta" debe estar deshabilitado y mostrar un indicador de carga.

### CA-001.9 — Enlace a login
- **Dado que** estoy en la página de registro,
- **cuando** ya tengo una cuenta,
- **entonces** debo encontrar un enlace "Iniciar sesión" que me lleve a la página de login.
