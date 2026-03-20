# RF-005 — Solicitud de recuperación de contraseña (Forgot Password)

<!--
  ¿Qué? Requisito funcional que define la solicitud de recuperación de contraseña.
  ¿Para qué? Documentar el primer paso del flujo de recuperación cuando el usuario olvida su contraseña.
  ¿Impacto? Sin este paso, un usuario que olvida su contraseña no podría volver a acceder al sistema.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RF-005                                                 |
| **Nombre**        | Solicitud de recuperación de contraseña                |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementado                                           |
| **Fecha**         | Febrero 2026                                           |

---

## Descripción

El sistema debe permitir que un usuario solicite la recuperación de su contraseña proporcionando su correo electrónico. Si el correo está registrado, el sistema genera un token de reset y envía un email con un enlace para restablecer la contraseña.

---

## Entradas

| Campo   | Tipo          | Obligatorio | Validaciones            |
| ------- | ------------- | ----------- | ----------------------- |
| `email` | Texto (email) | Sí          | Formato de email válido |

---

## Proceso

1. El usuario accede a la página "¿Olvidaste tu contraseña?".
2. Ingresa su correo electrónico.
3. El backend busca el usuario por email.
4. Si el email existe, se genera un token UUID único con expiración de 1 hora.
5. El token se almacena en la tabla `password_reset_tokens`.
6. Se envía un email al usuario con enlace: `{FRONTEND_URL}/reset-password?token={token}`.
7. Se retorna un mensaje genérico de éxito (independientemente de si el email existe).

---

## Salidas

| Escenario              | Código HTTP | Respuesta                                             |
| ---------------------- | ----------- | ----------------------------------------------------- |
| Solicitud procesada    | 200         | Mensaje genérico: "If the email exists, a reset link has been sent" |
| Datos inválidos        | 422         | Detalle de validación                                 |

---

## Endpoint asociado

| Método | Ruta                              | Auth requerida |
| ------ | --------------------------------- | -------------- |
| POST   | `/api/v1/auth/forgot-password`    | No             |

---

## Reglas de negocio

- RN-016: La respuesta siempre es la misma sin importar si el email existe o no (prevención de enumeración de usuarios).
- RN-017: El token de reset es un UUID único que expira en 1 hora.
- RN-018: El token se almacena en la tabla `password_reset_tokens` con estado `used = false`.
- RN-019: El enlace de recuperación apunta a la URL del frontend configurada en la variable de entorno `FRONTEND_URL`.
