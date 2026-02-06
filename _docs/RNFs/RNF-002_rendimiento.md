# RNF-002 — Rendimiento

<!--
  ¿Qué? Requisito no funcional que define las expectativas de rendimiento del sistema.
  ¿Para qué? Garantizar una experiencia fluida para el usuario con tiempos de respuesta aceptables.
  ¿Impacto? Un sistema lento afecta la UX y puede causar abandono por parte de los usuarios.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RNF-002                                                |
| **Nombre**        | Rendimiento                                            |
| **Categoría**     | Rendimiento                                            |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementado                                           |

---

## Requisitos

### RNF-002.1 — Tiempo de respuesta de la API
Los endpoints de la API deben responder en menos de **500 milisegundos** en condiciones normales de carga (excluyendo latencia de red).

### RNF-002.2 — Framework asíncrono
El backend debe utilizar un framework asíncrono (FastAPI + Uvicorn) para manejar múltiples solicitudes concurrentes de forma eficiente sin bloquear el event loop.

### RNF-002.3 — Connection pooling
Las conexiones a la base de datos deben gestionarse mediante un pool de conexiones configurado en SQLAlchemy, evitando la creación/destrucción de conexiones por cada solicitud.

### RNF-002.4 — Build optimizado del frontend
El frontend debe compilarse a un bundle optimizado de producción mediante Vite, aplicando:
- Tree-shaking (eliminación de código no utilizado).
- Minificación de JavaScript y CSS.
- Code splitting para carga eficiente.

### RNF-002.5 — Carga del frontend
La aplicación frontend debe cargar completamente (First Contentful Paint) en menos de **3 segundos** en una conexión de banda ancha estándar.
