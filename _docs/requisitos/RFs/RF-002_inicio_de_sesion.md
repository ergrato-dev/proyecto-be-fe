# RF-002 — Inicio de sesión (Login)

<!--
  ¿Qué? Requisito funcional que define el inicio de sesión de usuarios existentes.
  ¿Para qué? Documentar formalmente cómo un usuario se autentica en el sistema.
  ¿Impacto? Sin login, los usuarios no podrían acceder a las funcionalidades protegidas.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RF-002                                                 |
| **Nombre**        | Inicio de sesión (Login)                               |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementado                                           |
| **Fecha**         | Febrero 2026                                           |

---

## Descripción

El sistema debe permitir que un usuario registrado inicie sesión proporcionando su correo electrónico y contraseña. Si las credenciales son válidas, se generan dos tokens JWT: un access token (corta duración) y un refresh token (larga duración).

---

## Entradas

| Campo      | Tipo         | Obligatorio | Validaciones                    |
| ---------- | ------------ | ----------- | ------------------------------- |
| `email`    | Texto (email)| Sí          | Formato de email válido         |
| `password` | Texto        | Sí          | No vacío                        |

---

## Proceso

1. El usuario ingresa correo y contraseña en el formulario de login.
2. El frontend envía las credenciales al backend.
3. El backend busca al usuario por correo electrónico en la base de datos.
4. Si el usuario no existe o la cuenta está inactiva, se retorna error genérico.
5. Se verifica la contraseña ingresada contra el hash almacenado (bcrypt).
6. Si la contraseña no coincide, se retorna error genérico (mismo mensaje que usuario inexistente, por seguridad).
7. Se generan un access token (15 minutos) y un refresh token (7 días) firmados con JWT (HS256).
8. El frontend almacena los tokens y redirige al dashboard.

---

## Salidas

| Escenario                    | Código HTTP | Respuesta                                                          |
| ---------------------------- | ----------- | ------------------------------------------------------------------ |
| Login exitoso                | 200         | `{ access_token, refresh_token, token_type: "bearer" }`           |
| Credenciales inválidas       | 401         | Mensaje genérico: "Incorrect email or password"                    |
| Cuenta inactiva              | 401         | Mensaje genérico: "Incorrect email or password"                    |
| Datos inválidos              | 422         | Detalle de los errores de validación                               |

---

## Endpoint asociado

| Método | Ruta                     | Auth requerida |
| ------ | ------------------------ | -------------- |
| POST   | `/api/v1/auth/login`     | No             |

---

## Reglas de negocio

- RN-005: Los mensajes de error de autenticación deben ser genéricos — no revelar si el email existe o si la contraseña es incorrecta (prevención de enumeración de usuarios).
- RN-006: El access token expira a los 15 minutos.
- RN-007: El refresh token expira a los 7 días.
- RN-008: Los tokens se firman con algoritmo HS256 usando una clave secreta almacenada en variable de entorno.
- RN-009: Solo pueden iniciar sesión usuarios con `is_active = true`.
