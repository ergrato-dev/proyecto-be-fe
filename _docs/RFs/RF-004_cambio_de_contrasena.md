# RF-004 — Cambio de contraseña

<!--
  ¿Qué? Requisito funcional que define el cambio de contraseña por parte de un usuario autenticado.
  ¿Para qué? Documentar el flujo donde el usuario actualiza su contraseña conociendo la actual.
  ¿Impacto? Permite a los usuarios mantener sus cuentas seguras cambiando contraseñas periódicamente.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RF-004                                                 |
| **Nombre**        | Cambio de contraseña                                   |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementado                                           |
| **Fecha**         | Febrero 2026                                           |

---

## Descripción

El sistema debe permitir que un usuario autenticado cambie su contraseña proporcionando la contraseña actual (como verificación de identidad) y la nueva contraseña deseada.

---

## Entradas

| Campo              | Tipo  | Obligatorio | Validaciones                                                       |
| ------------------ | ----- | ----------- | ------------------------------------------------------------------ |
| `current_password` | Texto | Sí          | Debe coincidir con la contraseña actual hasheada en la BD          |
| `new_password`     | Texto | Sí          | Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número |

---

## Proceso

1. El usuario autenticado accede a la página de cambio de contraseña.
2. Ingresa la contraseña actual, la nueva contraseña y su confirmación.
3. El frontend valida que la nueva contraseña cumpla los requisitos de fortaleza.
4. El frontend valida que la nueva contraseña y su confirmación coincidan.
5. Se envía la contraseña actual y la nueva al backend con el access token.
6. El backend verifica la contraseña actual contra el hash almacenado.
7. Si la verificación es exitosa, se hashea la nueva contraseña y se actualiza en la BD.
8. Se retorna confirmación de cambio exitoso.

---

## Salidas

| Escenario                       | Código HTTP | Respuesta                                  |
| ------------------------------- | ----------- | ------------------------------------------ |
| Cambio exitoso                  | 200         | `{ message: "Password changed successfully" }` |
| Contraseña actual incorrecta    | 400         | Mensaje: "Current password is incorrect"   |
| Nueva contraseña débil          | 422         | Detalle de validación                      |
| Token inválido / no autenticado | 401         | Mensaje: "Could not validate credentials"  |

---

## Endpoint asociado

| Método | Ruta                              | Auth requerida |
| ------ | --------------------------------- | -------------- |
| POST   | `/api/v1/auth/change-password`    | Sí (Bearer token) |

---

## Reglas de negocio

- RN-013: Se requiere la contraseña actual como verificación de identidad antes de permitir el cambio.
- RN-014: La nueva contraseña debe cumplir los mismos requisitos de fortaleza que el registro (RF-001).
- RN-015: La nueva contraseña se hashea con bcrypt antes de almacenarse.
