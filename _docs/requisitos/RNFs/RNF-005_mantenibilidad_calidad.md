# RNF-005 — Mantenibilidad y Calidad de Código

<!--
  ¿Qué? Requisito no funcional que define estándares de código y mantenibilidad.
  ¿Para qué? Asegurar que el código sea legible, testeable y fácil de mantener a largo plazo.
  ¿Impacto? Código mal estructurado aumenta el costo de mantenimiento y la probabilidad de bugs.
-->

---

## Identificación

| Campo             | Valor                                                  |
| ----------------- | ------------------------------------------------------ |
| **ID**            | RNF-005                                                |
| **Nombre**        | Mantenibilidad y Calidad de Código                     |
| **Categoría**     | Mantenibilidad                                         |
| **Prioridad**     | Alta                                                   |
| **Estado**        | Implementado                                           |

---

## Requisitos

### RNF-005.1 — Cobertura de tests
- **Backend**: cobertura mínima del 80% en módulos de lógica de negocio (pytest + pytest-cov).
- **Frontend**: tests unitarios para componentes críticos y flujos de autenticación (Vitest + Testing Library).

### RNF-005.2 — Tipado estricto
- **Python**: type hints obligatorios en parámetros y retornos de todas las funciones.
- **TypeScript**: `strict: true` en `tsconfig.json`; nunca usar `any` de forma explícita salvo justificación documentada.

### RNF-005.3 — Linting y formateo
- **Backend**: `ruff` para linting y formateo, siguiendo PEP 8 con línea máxima de 100 caracteres.
- **Frontend**: ESLint + Prettier para linting y formateo automático.

### RNF-005.4 — Separación de responsabilidades
La arquitectura debe seguir una separación clara:
- **Backend**: Routers (endpoints) → Services (lógica de negocio) → Models (BD) → Schemas (validación).
- **Frontend**: Pages (vistas) → Components (UI reutilizable) → Hooks (lógica) → Context (estado global) → API (comunicación HTTP).

### RNF-005.5 — Comentarios pedagógicos
Cada archivo y bloque de código significativo debe incluir comentarios en español que respondan:
- **¿Qué?** — Descripción del elemento.
- **¿Para qué?** — Propósito y justificación.
- **¿Impacto?** — Consecuencias de su presencia o ausencia.

### RNF-005.6 — Convenciones de nomenclatura
- **Código**: nomenclatura en inglés (variables, funciones, clases, endpoints, tablas).
- **Documentación**: comentarios y documentación en español.
- **Commits**: formato Conventional Commits en inglés con cuerpo What/For/Impact.

### RNF-005.7 — Principios de diseño
El código debe adherirse a:
- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- **YAGNI** (You Aren't Gonna Need It)
- **Fail Fast** (validar inputs al inicio)
