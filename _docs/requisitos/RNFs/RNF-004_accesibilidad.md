# RNF-004 — Accesibilidad

<!--
  ¿Qué? Requisito no funcional que define los estándares de accesibilidad del sistema.
  ¿Para qué? Garantizar que usuarios con discapacidades puedan usar la aplicación.
  ¿Impacto? Sin accesibilidad, se excluye a una parte significativa de los usuarios potenciales.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RNF-004                                                |
| **Nombre**        | Accesibilidad                                          |
| **Categoría**     | Accesibilidad                                          |
| **Prioridad**     | Media                                                  |
| **Estado**        | Implementado                                           |

---

## Requisitos

### RNF-004.1 — Etiquetas en formularios
Todos los campos de formulario deben tener una etiqueta `<label>` asociada mediante `htmlFor`/`id`, de modo que los lectores de pantalla anuncien correctamente el propósito de cada campo.

### RNF-004.2 — Atributos ARIA
- Los campos con error deben incluir `aria-invalid="true"`.
- Los mensajes de error deben estar conectados al campo mediante `aria-describedby`.
- Los mensajes de error deben tener `role="alert"` para que los lectores de pantalla los anuncien.
- Los iconos decorativos deben tener `aria-hidden="true"`.
- Los botones sin texto visible (toggle de tema) deben tener `aria-label` descriptivo.

### RNF-004.3 — Contraste de colores
Los colores de texto y fondo deben cumplir el nivel **AA** de WCAG (Web Content Accessibility Guidelines), tanto en tema claro como en tema oscuro.

### RNF-004.4 — Navegación por teclado
Todos los elementos interactivos (inputs, botones, enlaces) deben ser accesibles y operables mediante teclado (Tab, Enter, Escape).

### RNF-004.5 — Toggle de visibilidad de contraseña
Los campos de contraseña deben incluir un botón para mostrar/ocultar el texto, con `aria-label` que indique la acción actual ("Mostrar contraseña" / "Ocultar contraseña").
