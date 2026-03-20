# RF-010 — Alternancia de tema (Dark/Light Mode)

<!--
  ¿Qué? Requisito funcional que define la funcionalidad de cambio de tema visual.
  ¿Para qué? Documentar la capacidad del usuario de alternar entre tema claro y oscuro.
  ¿Impacto? Mejora la accesibilidad y comodidad visual del usuario según sus preferencias.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RF-010                                                 |
| **Nombre**        | Alternancia de tema (Dark/Light Mode)                  |
| **Módulo**        | Interfaz de usuario                                    |
| **Prioridad**     | Media                                                  |
| **Estado**        | Implementado                                           |
| **Fecha**         | Febrero 2026                                           |

---

## Descripción

El sistema debe ofrecer un botón de toggle que permita al usuario alternar entre tema claro (light) y tema oscuro (dark). La preferencia se persiste en `localStorage` y, si no hay preferencia guardada, se respeta la configuración del sistema operativo (`prefers-color-scheme`).

---

## Proceso

1. Al cargar la aplicación, se verifica si existe preferencia guardada en `localStorage`.
2. Si existe, se aplica el tema guardado.
3. Si no existe, se detecta la preferencia del sistema operativo mediante `prefers-color-scheme`.
4. Al hacer clic en el botón de toggle, el tema alterna entre claro y oscuro.
5. La nueva preferencia se guarda en `localStorage` para futuras sesiones.
6. La clase `dark` se agrega o remueve del elemento `<html>` para que TailwindCSS aplique los estilos correspondientes.

---

## Salidas

| Escenario            | Resultado                                               |
| -------------------- | ------------------------------------------------------- |
| Cambio a dark mode   | Clase `dark` en `<html>`, localStorage: `theme=dark`    |
| Cambio a light mode  | Sin clase `dark` en `<html>`, localStorage: `theme=light` |

---

## Reglas de negocio

- RN-034: La preferencia de tema persiste entre sesiones gracias a `localStorage`.
- RN-035: Si no hay preferencia guardada, se usa `prefers-color-scheme` del sistema operativo.
- RN-036: El botón de toggle está visible en todas las páginas (navbar y AuthLayout).
- RN-037: El icono del botón cambia según el tema actual (sol para dark → light, luna para light → dark).
