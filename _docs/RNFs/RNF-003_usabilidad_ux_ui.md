# RNF-003 — Usabilidad y Experiencia de Usuario (UX/UI)

<!--
  ¿Qué? Requisito no funcional que define los estándares de diseño y usabilidad.
  ¿Para qué? Garantizar una interfaz intuitiva, accesible y visualmente consistente.
  ¿Impacto? Una mala UX/UI causa frustración en el usuario y reduce la adopción del sistema.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RNF-003                                                |
| **Nombre**        | Usabilidad y Experiencia de Usuario (UX/UI)            |
| **Categoría**     | Usabilidad                                             |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementado                                           |

---

## Requisitos

### RNF-003.1 — Diseño responsivo (Mobile-first)
La interfaz debe adaptarse correctamente a distintos tamaños de pantalla:
- Móvil (320px — 768px)
- Tablet (768px — 1024px)
- Desktop (1024px+)

Los formularios de autenticación deben verse y funcionar correctamente en dispositivos móviles.

### RNF-003.2 — Soporte de temas (Dark/Light mode)
La aplicación debe ofrecer tema claro y oscuro con toggle manual, respetando la preferencia del sistema operativo como valor por defecto y persistiendo la elección del usuario.

### RNF-003.3 — Tipografía
Se deben usar exclusivamente fuentes **sans-serif** (`Inter`, `system-ui`, `sans-serif`).

### RNF-003.4 — Colores
Los colores deben ser sólidos y planos. Queda **prohibido** el uso de degradados (`gradient`) en cualquier elemento de la interfaz.

### RNF-003.5 — Botones de acción
Los botones de acción (Guardar, Enviar, etc.) deben estar alineados a la **derecha** del contenedor.

### RNF-003.6 — Feedback visual
- Los formularios deben mostrar mensajes de error claros y específicos debajo de cada campo.
- Las operaciones asíncronas deben mostrar indicadores de carga (loading states).
- Las acciones exitosas deben mostrar alertas de confirmación (tipo success).
- Las acciones fallidas deben mostrar alertas de error (tipo error).

### RNF-003.7 — Transiciones
Los elementos interactivos (botones, inputs, toggles) deben tener transiciones suaves en hover y focus (`transition-colors`, `duration-200`).

### RNF-003.8 — Iconografía
Los campos de formulario deben incluir iconos contextuales en su lado izquierdo (email → sobre, password → candado, etc.) usando la librería `lucide-react` para mejorar la identificación visual inmediata.

### RNF-003.9 — Consistencia visual
Todos los componentes de formulario deben usar el mismo componente base (`InputField`, `Button`, `Alert`) para garantizar consistencia en toda la aplicación.
