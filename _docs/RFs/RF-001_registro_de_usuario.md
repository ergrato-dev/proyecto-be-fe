# RF-001 — Registro de usuario

<!--
  ¿Qué? Requisito funcional que define el registro de nuevos usuarios en el sistema.
  ¿Para qué? Documentar formalmente la funcionalidad de creación de cuentas.
  ¿Impacto? Sin este requisito, no habría forma estandarizada de incorporar usuarios al sistema.
-->

---

## Identificación

| Campo         | Valor               |
| ------------- | ------------------- |
| **ID**        | RF-001              |
| **Nombre**    | Registro de usuario |
| **Módulo**    | Autenticación       |
| **Prioridad** | Alta                |
| **Estado**    | Implementado        |
| **Fecha**     | Febrero 2026        |

---

## Descripción

El sistema debe permitir que un usuario nuevo cree una cuenta proporcionando su nombre completo, correo electrónico y contraseña. Tras el registro, el sistema envía un correo de verificación a la dirección proporcionada. El usuario debe hacer clic en el enlace del correo para activar su cuenta antes de poder iniciar sesión.

---

## Entradas

| Campo       | Tipo          | Obligatorio | Validaciones                                                                 |
| ----------- | ------------- | ----------- | ---------------------------------------------------------------------------- |
| `full_name` | Texto         | Sí          | Mínimo 2 caracteres, máximo 255                                              |
| `email`     | Texto (email) | Sí          | Formato de email válido, máximo 255 caracteres, debe ser único en el sistema |
| `password`  | Texto         | Sí          | Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número            |

---

## Proceso

1. El usuario ingresa nombre completo, correo electrónico y contraseña en el formulario de registro.
2. El frontend valida los campos antes de enviar la solicitud al backend.
3. El backend valida los datos con Pydantic (formato, longitudes, fortaleza de contraseña).
4. El backend verifica que el correo no esté registrado previamente.
5. La contraseña se hashea con bcrypt antes de almacenarse.
6. Se crea el registro del usuario en la tabla `users` con `is_email_verified = false`.
7. Se genera un token UUID único de verificación de email con expiración de 24 horas y se almacena en la tabla `email_verification_tokens`.
8. Se envía un correo electrónico al usuario con el enlace de verificación: `{FRONTEND_URL}/verify-email?token={token}`.
9. La respuesta retorna los datos del usuario recién creado (sin contraseña, con `is_email_verified: false`).
10. El usuario hace clic en el enlace del correo → el frontend envía el token al endpoint `POST /verify-email`.
11. El backend valida el token (existencia, expiración, uso previo), marca `is_email_verified = true` y el token como usado.

---

## Salidas

| Escenario           | Código HTTP | Respuesta                                                                                                    |
| ------------------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| Registro exitoso    | 201         | Datos del usuario creado (`id`, `email`, `full_name`, `is_active`, `is_email_verified: false`, `created_at`) |
| Email ya registrado | 400         | Mensaje de error: "Email already registered"                                                                 |
| Datos inválidos     | 422         | Detalle de los errores de validación                                                                         |

---

## Endpoints asociados

| Método | Ruta                        | Auth requerida | Descripción                                  |
| ------ | --------------------------- | -------------- | -------------------------------------------- |
| POST   | `/api/v1/auth/register`     | No             | Crea la cuenta y envía email de verificación |
| POST   | `/api/v1/auth/verify-email` | No             | Activa la cuenta con el token del email      |

---

## Reglas de negocio

- RN-001: El correo electrónico debe ser único en todo el sistema.
- RN-002: La contraseña nunca se almacena en texto plano; siempre se hashea con bcrypt.
- RN-003: La contraseña debe cumplir los requisitos mínimos de fortaleza (8+ caracteres, mayúscula, minúscula, número).
- RN-004: El campo `is_active` se establece como `true` por defecto al crear la cuenta.
- RN-005: El campo `is_email_verified` se establece como `false` por defecto — el usuario no puede iniciar sesión hasta verificar su correo.
- RN-006: El token de verificación de email expira en 24 horas y solo puede usarse una vez.
- RN-007: Si el envío del correo falla (error en Resend API), el usuario igual queda registrado en la BD. En modo desarrollo (sin API key), el enlace se imprime en la consola del servidor.
