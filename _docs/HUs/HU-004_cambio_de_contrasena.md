# HU-004 — Cambio de contraseña

<!--
  ¿Qué? Historia de usuario que describe el cambio de contraseña por un usuario autenticado.
  ¿Para qué? Formalizar la necesidad del usuario de actualizar su contraseña de forma segura.
  ¿Impacto? Permite a los usuarios mantener la seguridad de sus cuentas de forma proactiva.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | HU-004                                                 |
| **Título**        | Cambio de contraseña                                   |
| **Módulo**        | Autenticación                                          |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementada                                           |
| **RF asociados**  | RF-004                                                 |

---

## Historia

**Como** usuario autenticado,
**quiero** cambiar mi contraseña actual por una nueva,
**para** mantener la seguridad de mi cuenta.

---

## Criterios de aceptación

### CA-004.1 — Formulario de cambio de contraseña
- **Dado que** estoy en la página de cambio de contraseña (`/change-password`),
- **cuando** veo el formulario,
- **entonces** debo encontrar campos para contraseña actual, nueva contraseña y confirmación de la nueva contraseña, con iconos contextuales.

### CA-004.2 — Verificación de contraseña actual
- **Dado que** ingreso una contraseña actual incorrecta,
- **cuando** envío el formulario,
- **entonces** debo ver un mensaje de error indicando que la contraseña actual es incorrecta.

### CA-004.3 — Validación de nueva contraseña
- **Dado que** ingreso una nueva contraseña que no cumple los requisitos de fortaleza,
- **cuando** envío el formulario,
- **entonces** debo ver un mensaje de error descriptivo indicando qué requisito falta (8+ caracteres, mayúscula, minúscula, número).

### CA-004.4 — Confirmación de nueva contraseña
- **Dado que** la nueva contraseña y su confirmación no coinciden,
- **cuando** envío el formulario,
- **entonces** debo ver el mensaje: "Las contraseñas no coinciden".

### CA-004.5 — Cambio exitoso
- **Dado que** completé correctamente todos los campos,
- **cuando** envío el formulario,
- **entonces** debo ver un mensaje de éxito: "Contraseña actualizada exitosamente" y los campos deben limpiarse.

### CA-004.6 — Botón cancelar
- **Dado que** estoy en la página de cambio de contraseña y cambié de opinión,
- **cuando** hago clic en "Cancelar",
- **entonces** debo ser redirigido al dashboard sin modificar nada.

### CA-004.7 — Estado de carga
- **Dado que** envié el formulario de cambio de contraseña,
- **cuando** la solicitud está en proceso,
- **entonces** el botón "Guardar" debe estar deshabilitado y mostrar indicador de carga.

### CA-004.8 — Login con nueva contraseña
- **Dado que** cambié mi contraseña exitosamente,
- **cuando** cierro sesión e intento iniciar sesión con la contraseña anterior,
- **entonces** el login debe fallar; y al usar la nueva contraseña, debe funcionar correctamente.
