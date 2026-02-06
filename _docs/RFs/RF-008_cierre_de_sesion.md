# RF-008 — Cierre de sesión (Logout)

<!--
  ¿Qué? Requisito funcional que define el cierre de sesión del usuario.
  ¿Para qué? Documentar cómo el usuario termina su sesión de forma segura.
  ¿Impacto? Sin logout, los tokens permanecerían en el cliente indefinidamente hasta expirar.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RF-008                                                 |
| **Nombre**        | Cierre de sesión (Logout)                              |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Media                                                  |
| **Estado**        | Implementado                                           |
| **Fecha**         | Febrero 2026                                           |

---

## Descripción

El sistema debe permitir que un usuario autenticado cierre su sesión. Al hacerlo, se eliminan los tokens almacenados en el cliente y se redirige al usuario a la página de inicio de sesión.

---

## Proceso

1. El usuario hace clic en el botón "Salir" en la barra de navegación.
2. El frontend elimina el access token y el refresh token almacenados en memoria/estado.
3. Se limpia el estado de autenticación del contexto global (AuthContext).
4. Se redirige al usuario a la página de login (`/login`).

---

## Salidas

| Escenario          | Resultado                                           |
| ------------------ | --------------------------------------------------- |
| Logout exitoso     | Tokens eliminados, usuario redirigido a `/login`    |

---

## Reglas de negocio

- RN-027: El logout se maneja completamente en el frontend (JWT stateless — no hay invalidación server-side).
- RN-028: Al cerrar sesión, todas las rutas protegidas redirigen automáticamente a `/login`.
- RN-029: El usuario puede volver a iniciar sesión inmediatamente después del logout.
