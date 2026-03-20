# RF-003 — Renovación de token (Refresh)

<!--
  ¿Qué? Requisito funcional que define la renovación del access token usando el refresh token.
  ¿Para qué? Documentar el mecanismo que permite mantener la sesión activa sin re-login.
  ¿Impacto? Sin refresh, el usuario tendría que re-autenticarse cada 15 minutos.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RF-003                                                 |
| **Nombre**        | Renovación de token (Refresh)                          |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementado                                           |
| **Fecha**         | Febrero 2026                                           |

---

## Descripción

El sistema debe permitir obtener un nuevo access token válido presentando un refresh token vigente, sin necesidad de que el usuario vuelva a ingresar sus credenciales.

---

## Entradas

| Campo           | Tipo   | Obligatorio | Validaciones                                     |
| --------------- | ------ | ----------- | ------------------------------------------------ |
| `refresh_token` | Texto  | Sí          | JWT válido, no expirado, tipo "refresh"          |

---

## Proceso

1. El frontend detecta que el access token está por expirar o ya expiró.
2. Se envía el refresh token al backend.
3. El backend decodifica y valida el refresh token (firma, expiración, tipo).
4. Se verifica que el usuario asociado al token aún exista y esté activo.
5. Se genera un nuevo access token (15 minutos).
6. Se retorna el nuevo access token al frontend.

---

## Salidas

| Escenario                    | Código HTTP | Respuesta                                                |
| ---------------------------- | ----------- | -------------------------------------------------------- |
| Refresh exitoso              | 200         | `{ access_token, token_type: "bearer" }`                 |
| Token expirado o inválido    | 401         | Mensaje: "Invalid or expired refresh token"              |
| Usuario inactivo             | 401         | Mensaje: "Invalid or expired refresh token"              |

---

## Endpoint asociado

| Método | Ruta                       | Auth requerida           |
| ------ | -------------------------- | ------------------------ |
| POST   | `/api/v1/auth/refresh`     | No (requiere refresh token en body) |

---

## Reglas de negocio

- RN-010: El refresh token debe contener un claim `type: "refresh"` para diferenciarlo del access token.
- RN-011: Si el refresh token expiró, el usuario debe iniciar sesión nuevamente.
- RN-012: El refresh no genera un nuevo refresh token — solo renueva el access token.
