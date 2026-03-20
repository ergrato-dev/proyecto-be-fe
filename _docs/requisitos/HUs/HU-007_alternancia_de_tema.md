# HU-007 — Alternancia de tema visual

<!--
  ¿Qué? Historia de usuario que describe la funcionalidad de cambio de tema (dark/light).
  ¿Para qué? Formalizar la necesidad del usuario de personalizar la apariencia visual de la app.
  ¿Impacto? Mejora la comodidad visual y accesibilidad según las preferencias del usuario.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | HU-007                                                 |
| **Título**        | Alternancia de tema visual                             |
| **Módulo**        | Interfaz de usuario                                    |
| **Prioridad**     | Media                                                  |
| **Estado**        | Implementada                                           |
| **RF asociados**  | RF-010                                                 |

---

## Historia

**Como** usuario del sistema,
**quiero** poder alternar entre tema claro y oscuro,
**para** ajustar la apariencia visual a mi preferencia o condiciones de iluminación.

---

## Criterios de aceptación

### CA-007.1 — Botón de toggle visible
- **Dado que** estoy en cualquier página del sistema (autenticado o no),
- **cuando** miro la interfaz,
- **entonces** debo encontrar un botón con icono de sol o luna para cambiar el tema.

### CA-007.2 — Cambio inmediato de tema
- **Dado que** hago clic en el botón de toggle de tema,
- **cuando** el toggle se procesa,
- **entonces** la interfaz debe cambiar inmediatamente entre tema claro y oscuro con transición suave.

### CA-007.3 — Persistencia de preferencia
- **Dado que** seleccioné un tema (por ejemplo, oscuro),
- **cuando** recargo la página o vuelvo más tarde,
- **entonces** el sistema debe recordar mi elección y aplicar el tema que seleccioné previamente.

### CA-007.4 — Respeto a la preferencia del sistema
- **Dado que** es la primera vez que visito la aplicación (sin preferencia guardada),
- **cuando** la página carga,
- **entonces** el tema debe coincidir con la preferencia de mi sistema operativo (`prefers-color-scheme`).

### CA-007.5 — Icono contextual
- **Dado que** estoy en tema oscuro,
- **cuando** miro el botón de toggle,
- **entonces** el icono debe ser un sol (indicando "cambiar a claro"); y viceversa, luna en tema claro.
