# RF-006 — Restablecimiento de contraseña (Reset Password)

<!--
  ¿Qué? Requisito funcional que define el restablecimiento de contraseña con token.
  ¿Para qué? Documentar el segundo paso del flujo de recuperación.
  ¿Impacto? Complementa RF-005 — sin este paso, el enlace de recuperación no serviría de nada.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RF-006                                                 |
| **Nombre**        | Restablecimiento de contraseña (Reset Password)        |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementado                                           |
| **Fecha**         | Febrero 2026                                           |

---

## Descripción

El sistema debe permitir que un usuario restablezca su contraseña presentando un token de recuperación válido (recibido por email) junto con la nueva contraseña deseada.

---

## Entradas

| Campo          | Tipo  | Obligatorio | Validaciones                                                       |
| -------------- | ----- | ----------- | ------------------------------------------------------------------ |
| `token`        | Texto | Sí          | UUID válido, existente en BD, no expirado, no usado previamente    |
| `new_password` | Texto | Sí          | Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número |

---

## Proceso

1. El usuario accede al enlace recibido por email: `/reset-password?token=<uuid>`.
2. Ingresa la nueva contraseña y su confirmación.
3. El frontend valida los requisitos de fortaleza y coincidencia.
4. Se envía el token y la nueva contraseña al backend.
5. El backend busca el token en la tabla `password_reset_tokens`.
6. Verifica que el token no haya expirado ni haya sido usado.
7. Hashea la nueva contraseña con bcrypt.
8. Actualiza la contraseña del usuario en la tabla `users`.
9. Marca el token como usado (`used = true`).
10. Retorna confirmación de éxito.

---

## Salidas

| Escenario                     | Código HTTP | Respuesta                                          |
| ----------------------------- | ----------- | -------------------------------------------------- |
| Reset exitoso                 | 200         | `{ message: "Password reset successfully" }`       |
| Token inválido o expirado     | 400         | Mensaje: "Invalid or expired reset token"          |
| Token ya usado                | 400         | Mensaje: "Invalid or expired reset token"          |
| Contraseña débil              | 422         | Detalle de validación                              |

---

## Endpoint asociado

| Método | Ruta                              | Auth requerida                    |
| ------ | --------------------------------- | --------------------------------- |
| POST   | `/api/v1/auth/reset-password`     | No (requiere token de reset en body) |

---

## Reglas de negocio

- RN-020: El token de reset solo puede usarse una vez — tras usarse se marca `used = true`.
- RN-021: Si el token expiró (más de 1 hora desde su creación), se rechaza la solicitud.
- RN-022: Los mensajes de error para token inválido, expirado o usado son idénticos (por seguridad).
- RN-023: La nueva contraseña debe cumplir los mismos requisitos de fortaleza que el registro (RF-001).
