# RF-007 — Consulta de perfil de usuario

<!--
  ¿Qué? Requisito funcional que define la consulta del perfil del usuario autenticado.
  ¿Para qué? Documentar cómo un usuario obtiene sus datos personales tras autenticarse.
  ¿Impacto? Sin este requisito, el frontend no podría mostrar información del usuario en el dashboard.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RF-007                                                 |
| **Nombre**        | Consulta de perfil de usuario                          |
| **Módulo**        | Usuarios                                               |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementado                                           |
| **Fecha**         | Febrero 2026                                           |

---

## Descripción

El sistema debe permitir que un usuario autenticado consulte su propia información de perfil (nombre, email, fecha de creación, estado de la cuenta).

---

## Entradas

| Campo          | Tipo   | Obligatorio | Validaciones                    |
| -------------- | ------ | ----------- | ------------------------------- |
| Access token   | Header | Sí          | JWT válido en `Authorization: Bearer <token>` |

---

## Proceso

1. El frontend envía una solicitud GET con el access token en el header de autorización.
2. El backend extrae y decodifica el token JWT.
3. Se verifica la firma, expiración y tipo del token.
4. Se busca al usuario en la base de datos por el `sub` (subject) del token.
5. Se verifica que el usuario exista y esté activo.
6. Se retorna la información del perfil (sin la contraseña hasheada).

---

## Salidas

| Escenario                  | Código HTTP | Respuesta                                                     |
| -------------------------- | ----------- | ------------------------------------------------------------- |
| Consulta exitosa           | 200         | `{ id, email, full_name, is_active, created_at, updated_at }` |
| Token inválido o expirado  | 401         | Mensaje: "Could not validate credentials"                     |
| Usuario no encontrado      | 401         | Mensaje: "Could not validate credentials"                     |

---

## Endpoint asociado

| Método | Ruta                   | Auth requerida     |
| ------ | ---------------------- | ------------------ |
| GET    | `/api/v1/users/me`     | Sí (Bearer token)  |

---

## Reglas de negocio

- RN-024: El endpoint solo retorna la información del usuario autenticado — nunca la de otros usuarios.
- RN-025: El campo `hashed_password` nunca se incluye en la respuesta.
- RN-026: Si el token es válido pero el usuario ya no existe o fue desactivado, se retorna 401.
