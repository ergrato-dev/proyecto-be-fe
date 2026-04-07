# Design System — NN Auth System (Serie Educativa)

<!--
  ¿Qué? Referencia técnica del sistema de temas visuales diferenciales por stack.
  ¿Para qué? Documentar la decisión de diseño, la arquitectura CSS y las instrucciones
             exactas para clonar y adaptar el tema a cada proyecto de la serie.
  ¿Impacto? Sin esta referencia, cada proyecto herecería colores hardcodeados de otro stack,
            generando confusión visual entre los aprendices al comparar proyectos.
-->

---

## 1. Propósito

Cada proyecto de la serie educativa implementa el mismo sistema de autenticación con
**un stack backend diferente**. Para que los aprendices puedan identificar visualmente
a qué stack pertenece cada proyecto, se asigna un **color de acento único** a cada uno.

Este color no es decorativo: es **semiótico**. Verde = Python; Azul = Node.js; etc.

---

## 2. Tabla de Identidades Visuales

| Stack backend               | Proyecto              | Color Tailwind | Hex referencia |
| --------------------------- | --------------------- | -------------- | -------------- |
| **FastAPI (Python)** ← ESTE | `proyecto-be-fe`      | `emerald`      | `#059669`      |
| Express.js (Node)           | `proyecto-beex-fe`    | `blue`         | `#2563eb`      |
| Next.js fullstack           | `proyecto-be-fe-next` | `violet`       | `#7c3aed`      |
| Spring Boot Java            | `proyecto-besb-fe`    | `amber`        | `#d97706`      |
| Spring Boot Kotlin          | `proyecto-besbk-fe`   | `fuchsia`      | `#c026d3`      |
| Go REST API                 | `proyecto-bego-fe`    | `cyan`         | `#0891b2`      |

---

## 3. Arquitectura del Sistema de Temas

### 3.1 Principio: token semántico `accent-*`

Los componentes **nunca** referencian un color concreto (`blue-600`, `emerald-500`).
Usan el token abstracto `accent-*`, que está definido **una sola vez** en `index.css`.

```
Componentes (Button, InputField, LandingPage…)
      │
      │  usan  bg-accent-600, text-accent-500, border-accent-300 …
      │
      ▼
  index.css  @theme inline
      │
      │  mapea  --color-accent-* → --color-emerald-*
      │
      ▼
  TailwindCSS v4 (paleta base: emerald, blue, violet, amber, fuchsia, cyan…)
```

**Beneficio**: clonar el tema para otro stack = cambiar **11 líneas** en `index.css`.
Cero cambios en componentes, páginas, tests ni documentación.

### 3.2 Implementación en TailwindCSS v4

TailwindCSS v4 expone cada paleta base como variables CSS (`--color-emerald-500`, etc.).
La directiva `@theme inline` crea aliases que las referencian:

```css
/* fe/src/index.css */

@theme inline {
  --color-accent-50: var(--color-emerald-50);
  --color-accent-100: var(--color-emerald-100);
  --color-accent-200: var(--color-emerald-200);
  --color-accent-300: var(--color-emerald-300);
  --color-accent-400: var(--color-emerald-400);
  --color-accent-500: var(--color-emerald-500); /* ← color base de acento */
  --color-accent-600: var(--color-emerald-600); /* ← botones primarios */
  --color-accent-700: var(--color-emerald-700); /* ← hover de botones */
  --color-accent-800: var(--color-emerald-800);
  --color-accent-900: var(--color-emerald-900);
  --color-accent-950: var(--color-emerald-950);
}
```

Esto genera automáticamente las utilidades:

- `bg-accent-{50…950}` → fondos
- `text-accent-{50…950}` → textos
- `border-accent-{50…950}` → bordes
- `ring-accent-{50…950}` → rings de focus
- etc.

**¿Por qué `inline`?** Sin esa palabra clave, Tailwind intenta resolver el valor
en tiempo de compilación y no puede seguir referencias a otras variables CSS.
Con `inline`, inyecta `var(--color-accent-600)` directamente en el CSS generado,
y el navegador resuelve la cadena en runtime.

---

## 4. Colores Semánticos — Excepción Documentada

El token `accent-*` es para **marca e interacción primaria**. Existen colores con
significado **semántico fijo** que NO cambian entre proyectos:

| Semántica   | Color Tailwind | Uso                                      |
| ----------- | -------------- | ---------------------------------------- |
| Éxito       | `green-*`      | Alert type="success", confirmaciones     |
| Error       | `red-*`        | Alert type="error", validaciones         |
| Advertencia | `yellow-*`     | Avisos no críticos                       |
| Información | `blue-*`       | Alert type="info", cajas informacionales |

**Regla concreta**: `Alert.tsx` tipo `"info"` conserva `blue-*` en todos los proyectos
de la serie. `ContactPage.tsx` mantiene azul el cuadro anti-spam (informacional).
Esto es correcto: el azul semántico de "información" no debe confundirse con el
color de acento de un proyecto concreto.

---

## 5. Logo SVG — Colores Hardcodeados

El componente `NNAuthLogo` en `LandingPage.tsx` usa valores SVG directos, no clases
Tailwind. Al cambiar el stack, actualizar también estos colores:

| Token semántico | FastAPI (emerald)  | Express (blue)     | Go (cyan)          |
| --------------- | ------------------ | ------------------ | ------------------ |
| Borde del badge | `stroke="#059669"` | `stroke="#2563eb"` | `stroke="#0891b2"` |
| Trazos letras N | `stroke="#34d399"` | `stroke="#60a5fa"` | `stroke="#22d3ee"` |

La relación es: borde = `{paleta}-600`, trazos = `{paleta}-400`.

---

## 6. Cómo Clonar Este Proyecto para Otro Stack

### Paso 1 — Cambiar el color de acento en `index.css`

Editar únicamente el bloque `@theme inline` en `fe/src/index.css`:

```css
/* Ejemplo: cambiar de FastAPI (emerald) a Express.js (blue) */

@theme inline {
  /* Antes: var(--color-emerald-*)  */
  /* Después:                       */
  --color-accent-50: var(--color-blue-50);
  --color-accent-100: var(--color-blue-100);
  --color-accent-200: var(--color-blue-200);
  --color-accent-300: var(--color-blue-300);
  --color-accent-400: var(--color-blue-400);
  --color-accent-500: var(--color-blue-500);
  --color-accent-600: var(--color-blue-600);
  --color-accent-700: var(--color-blue-700);
  --color-accent-800: var(--color-blue-800);
  --color-accent-900: var(--color-blue-900);
  --color-accent-950: var(--color-blue-950);
}
```

### Paso 2 — Actualizar el logo SVG

En `fe/src/pages/LandingPage.tsx`, función `NNAuthLogo`, cambiar los dos valores
de `stroke` según la tabla de la sección 5.

### Paso 3 — Actualizar el comentario de cabecera en `index.css`

Cambiar la línea `/* FastAPI (Python) ← ESTE */` para identificar el nuevo stack.

### Paso 4 _(opcional)_ — Actualizar el `tech stack` en `LandingPage.tsx`

El array `techStack` lista las tecnologías del proyecto. Reemplazar `"Python 3.12"`,
`"FastAPI"`, `"SQLAlchemy"`, `"Alembic"`, `"Pydantic"`, `"pytest"` por las del nuevo stack.

---

## 7. Patrones de Uso Correcto en Componentes

### 7.1 Botón primario

```tsx
// ✅ CORRECTO — usa accent, funciona en todos los proyectos
<button className="bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 text-white ...">
  Guardar
</button>

// ❌ INCORRECTO — hardcodea un color concreto
<button className="bg-emerald-600 hover:bg-emerald-700 ...">
  Guardar
</button>
```

### 7.2 Link de acento

```tsx
// ✅ CORRECTO
<a className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300">
  Ver más
</a>
```

### 7.3 Focus ring en inputs y enlaces

```tsx
// ✅ CORRECTO
<input className="focus:border-accent-500 focus:ring-accent-500/20 dark:focus:border-accent-400 ..." />
<a className="focus-visible:ring-2 focus-visible:ring-accent-500 ..." />
```

### 7.4 Badges numerados / íconos de sección

```tsx
// ✅ CORRECTO
<span className="border-accent-300 bg-accent-50 text-accent-600 dark:border-accent-800 dark:bg-accent-950 dark:text-accent-400">
  01
</span>
```

### 7.5 Alerta informacional (EXCEPCIÓN — NO usar accent)

```tsx
// ✅ CORRECTO — info SIEMPRE azul, sin importar el stack
<div className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300">
  Información importante
</div>
```

---

## 8. Verificación

Para auditar que un proyecto no tiene colores hardcodeados de otro stack:

```bash
cd fe/src

# Verificar que no hay colores concretos donde debería ir accent
# (estos patrones en componentes/páginas son errores)
grep -rn "bg-blue-6\|bg-emerald-6\|bg-violet-6\|bg-amber-6\|bg-fuchsia-6\|bg-cyan-6" \
  --include="*.tsx" . | grep -v "Alert.tsx"

# Ver qué color de acento está activo en este proyecto
grep "color-accent-500" index.css
```

Si el primer comando devuelve resultados (excluyendo `Alert.tsx`), hay colores
hardcodeados que deben migrarse a `accent-*`.

---

## 9. Relación con el Repositorio de Referencia

El repositorio `ergrato-dev/proyecto-beex-fe` (Express.js) implementa el mismo
sistema con `blue` como acento. Es el proyecto de referencia para comparar la
misma arquitectura con distinto stack y distinto color de identidad.

| Repositorio        | Stack             | Acento  | URL                                       |
| ------------------ | ----------------- | ------- | ----------------------------------------- |
| `proyecto-be-fe`   | FastAPI + Python  | emerald | _(este repo)_                             |
| `proyecto-beex-fe` | Express.js + Node | blue    | `github.com/ergrato-dev/proyecto-beex-fe` |
