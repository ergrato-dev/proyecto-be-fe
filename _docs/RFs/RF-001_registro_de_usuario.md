# RF-001 — Registro de usuario

<!--
  ¿Qué? Requisito funcional que define el registro de nuevos usuarios en el sistema.
  ¿Para qué? Documentar formalmente la funcionalidad de creación de cuentas.
  ¿Impacto? Sin este requisito, no habría forma estandarizada de incorporar usuarios al sistema.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RF-001                                                 |
| **Nombre**        | Registro de usuario                                    |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementado                                           |
| **Fecha**         | Febrero 2026                                           |

---

## Descripción

El sistema debe permitir que un usuario nuevo cree una cuenta proporcionando su nombre completo, correo electrónico y contraseña. Una vez registrado, el usuario podrá iniciar sesión con las credenciales creadas.

---

## Entradas

| Campo           | Tipo         | Obligatorio | Validaciones                                                                 |
| --------------- | ------------ | ----------- | ---------------------------------------------------------------------------- |
| `full_name`     | Texto        | Sí          | Mínimo 2 caracteres, máximo 255                                             |
| `email`         | Texto (email)| Sí          | Formato de email válido, máximo 255 caracteres, debe ser único en el sistema |
| `password`      | Texto        | Sí          | Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número           |

---

## Proceso

1. El usuario ingresa nombre completo, correo electrónico y contraseña en el formulario de registro.
2. El frontend valida los campos antes de enviar la solicitud al backend.
3. El backend valida los datos con Pydantic (formato, longitudes, fortaleza de contraseña).
4. El backend verifica que el correo no esté registrado previamente.
5. La contraseña se hashea con bcrypt antes de almacenarse.
6. Se crea el registro del usuario en la tabla `users` de la base de datos.
7. Se retorna la información del usuario creado (sin la contraseña).

---

## Salidas

| Escenario                  | Código HTTP | Respuesta                                          |
| -------------------------- | ----------- | -------------------------------------------------- |
| Registro exitoso           | 201         | Datos del usuario creado (`id`, `email`, `full_name`, `is_active`, `created_at`) |
| Email ya registrado        | 400         | Mensaje de error: "Email already registered"        |
| Datos inválidos            | 422         | Detalle de los errores de validación                |

---

## Endpoint asociado

| Método | Ruta                        | Auth requerida |
| ------ | --------------------------- | -------------- |
| POST   | `/api/v1/auth/register`     | No             |

---

## Reglas de negocio

- RN-001: El correo electrónico debe ser único en todo el sistema.
- RN-002: La contraseña nunca se almacena en texto plano; siempre se hashea con bcrypt.
- RN-003: La contraseña debe cumplir los requisitos mínimos de fortaleza (8+ caracteres, mayúscula, minúscula, número).
- RN-004: El campo `is_active` se establece como `true` por defecto al crear la cuenta.
