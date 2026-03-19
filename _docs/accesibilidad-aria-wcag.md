# Accesibilidad Web — ARIA y WCAG

<!--
  ¿Qué? Documento pedagógico sobre estándares de accesibilidad web aplicados
        en este proyecto: WCAG 2.1 y ARIA (Accessible Rich Internet Applications).
  ¿Para qué? Explicar qué es la accesibilidad, por qué importa, y documentar
             exactamente cómo se implementó cada patrón en el código del proyecto.
  ¿Impacto? Una app inaccesible excluye a personas con discapacidades visuales,
             motrices o cognitivas. La accesibilidad no es opcional — en muchos
             países es un requisito legal (ADA en EE.UU., directiva EU 2016/2102).
-->

> **Estándar de referencia**: [WCAG 2.1 — W3C](https://www.w3.org/TR/WCAG21/)
> **Especificación ARIA**: [WAI-ARIA 1.2 — W3C](https://www.w3.org/TR/wai-aria-1.2/)

---

## ¿Qué es la Accesibilidad Web?

La accesibilidad web garantiza que **todas las personas** puedan usar aplicaciones web,
independientemente de sus capacidades. Esto incluye personas que:

- Usan **lectores de pantalla** (NVDA, VoiceOver, JAWS) por discapacidad visual
- Navegan **solo con teclado** (sin ratón) por limitaciones motrices
- Tienen **daltonismo** y no pueden distinguir colores como información
- Usan **software de amplificación** por baja visión
- Tienen **dislexia** u otras diferencias cognitivas

### Los 4 principios WCAG — POUR

| Principio | Descripción | Ejemplo |
|-----------|-------------|---------|
| **P**erceptible | La info debe presentarse de forma que el usuario pueda percibirla | Alt text en imágenes, contraste de colores |
| **O**perable | Los componentes deben ser operables por el usuario | Navegación por teclado, sin trampas de foco |
| **U**nderstandable | La información y UI deben ser comprensibles | Labels en formularios, mensajes de error claros |
| **R**obust | El contenido debe interpretarse por tecnologías asistivas | HTML semántico, ARIA roles |

---

## Niveles de Conformidad WCAG

| Nivel | Descripción | Ejemplos de criterios |
|-------|-------------|----------------------|
| **A** | Requisito mínimo — sin esto, el contenido es completamente inaccesible | Alternativas textuales (1.1.1), teclado (2.1.1) |
| **AA** | Estándar recomendado para la mayoría de sitios | Contraste 4.5:1 (1.4.3), reflow (1.4.10) |
| **AAA** | Máxima accesibilidad — difícil de cumplir en todos los contenidos | Contraste 7:1 (1.4.6), lenguaje de señas (1.2.6) |

> **Objetivo de este proyecto**: Conformidad **WCAG 2.1 AA** — el nivel exigido por
> regulaciones gubernamentales en la mayoría de países y por las app stores.

---

## ¿Qué es ARIA?

**ARIA** (Accessible Rich Internet Applications) es una especificación del W3C que
añade semántica adicional al HTML para describir comportamientos interactivos que
HTML nativo no puede expresar por sí solo.

```html
<!-- HTML nativo — el navegador ya sabe que esto es un botón -->
<button>Enviar</button>

<!-- ARIA necesario — un div actuando como botón necesita rol explícito -->
<div role="button" tabindex="0" onclick="...">Enviar</div>

<!-- ARIA para estado dinámico — no existe en HTML nativo -->
<button aria-busy="true">Guardando...</button>
<input aria-invalid="true" aria-describedby="email-error" />
```

### Regla de oro: **Primero HTML semántico**

> Usar ARIA solo cuando HTML nativo no es suficiente.
> `<button>` es mejor que `<div role="button">`.
> `<nav>` es mejor que `<div role="navigation">`.

---

## Estado de Accesibilidad — NN Auth System

### Resumen por archivo

| Componente / Página | Nivel | Criterios WCAG cumplidos |
|---------------------|-------|--------------------------|
| `InputField.tsx` | ✅ AA+ | 1.1.1, 1.3.1, 3.3.1, 3.3.2, 4.1.2 |
| `Button.tsx` | ✅ AA | 4.1.2, 4.1.3 |
| `Alert.tsx` | ✅ AA | 1.1.1, 4.1.3 |
| `ThemeToggle.tsx` | ✅ AA | 1.1.1, 4.1.2 |
| `DataTable.tsx` | ✅ AA+ | 1.3.1, 2.4.3, 2.4.6, 4.1.2 |
| `AuthLayout.tsx` | ✅ AA | 1.3.1, 2.4.1, 2.4.6 |
| `Navbar.tsx` | ✅ AA | 1.3.1, 2.4.1 |
| `ProtectedRoute.tsx` | ✅ AA | 4.1.3 |
| `DashboardPage.tsx` | ✅ AA | 1.4.1, 2.4.6 |
| `DataTableDemoPage.tsx` | ✅ AA | 4.1.2 |
| `index.html` | ✅ AA | 3.1.1, 2.4.2 |

---

## Implementaciones por criterio WCAG

---

### WCAG 1.1.1 — Non-text Content (Nivel A)

**¿Qué?** Todo contenido no textual debe tener una alternativa textual.

**Problema resuelto**: Los íconos SVG decorativos eran leídos por lectores de pantalla
(el path SVG completo como texto), interrumpiendo la experiencia del usuario.

**Implementación en `Alert.tsx`**:
```tsx
{/* ✅ aria-hidden="true" oculta el ícono decorativo del árbol de accesibilidad */}
<span className="mt-0.5 flex-shrink-0" aria-hidden="true">
  <svg aria-hidden="true" ...>  {/* El mensaje de texto ya comunica el tipo de alerta */}
    <path ... />
  </svg>
</span>
```

**Implementación en `InputField.tsx`**:
```tsx
{/* ✅ Wrapper del ícono con aria-hidden — no añade información semántica */}
{icon && (
  <div
    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
    aria-hidden="true"  {/* <- La label ya describe el campo */}
  >
    {icon}
  </div>
)}
```

**Regla práctica**: Un ícono es decorativo si el texto adyacente ya comunica lo mismo.
Necesita `aria-hidden="true"`. Si el ícono es el ÚNICO contenido del botón, necesita `aria-label`.

---

### WCAG 1.3.1 — Info and Relationships (Nivel A)

**¿Qué?** La información, estructura y relaciones deben ser determinables programáticamente.

**Implementación en `AuthLayout.tsx`** — Landmark `<main>`:
```tsx
{/* ✅ <main> como landmark semántico — identifica el contenido principal */}
{/* Un usuario de lector de pantalla puede saltar directamente aquí */}
{/* con un atajo de teclado en lugar de escuchar toda la navegación */}
<main className="flex flex-1 items-center justify-center px-4 pb-12">
  {/* contenido del formulario */}
</main>
```

**Jerarquía de landmarks en la app**:
```
<html>
  <body>
    <nav aria-label="Navegación principal">   ← AppLayout
    <main>                                    ← AppLayout (páginas auth) / contenido de página
      <h1>Bienvenido, Usuario</h1>            ← DashboardPage
      <h2>Información del perfil</h2>         ← DashboardPage
```

**¿Por qué importa?** Los lectores de pantalla tienen comandos para saltar entre landmarks
(`F6` en NVDA, `R` en VoiceOver). Sin `<main>`, el usuario debe escuchar cada elemento
desde el principio de la página.

---

### WCAG 1.4.1 — Use of Color (Nivel A)

**¿Qué?** El color no debe ser el ÚNICO medio para transmitir información.

**Problema**: El badge "Activo/Inactivo" en el dashboard usaba color verde/rojo + texto.
El texto ya es suficiente, pero se añadió `aria-label` para contexto completo.

**Implementación en `DashboardPage.tsx`**:
```tsx
{/* ✅ El texto "Activo"/"Inactivo" ya cumple 1.4.1 */}
{/* aria-label añade el contexto "Estado de la cuenta:" para AT */}
<span
  className={`... ${user?.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
  aria-label={`Estado de la cuenta: ${user?.is_active ? "Activo" : "Inactivo"}`}
>
  {user?.is_active ? "Activo" : "Inactivo"}
</span>
```

**❌ Patrón inseguro** (no hagas esto):
```tsx
{/* Solo color — inaccesible para daltónicos y lectores de pantalla */}
<span className={user?.is_active ? "bg-green-500" : "bg-red-500"} />
```

---

### WCAG 2.4.1 — Bypass Blocks (Nivel A)

**¿Qué?** Debe existir un mecanismo para saltar bloques repetitivos (la navbar) y llegar
directamente al contenido principal.

**Implementación**: Los landmarks `<main>` y `<nav aria-label>` cumplen este criterio.
Los lectores de pantalla modernos usan los landmarks para navegación por saltos.

**Implementación en `Navbar.tsx`**:
```tsx
// ✅ aria-label diferencia esta <nav> de otras en la misma página
// (la paginación del DataTable también usa <nav aria-label="Navegación de páginas">)
<nav aria-label="Navegación principal">
  {/* contenido */}
</nav>
```

**Sin aria-label**, NVDA anunciaría solo "nav" para ambas instancias — el usuario no
sabría cuál es la barra de navegación principal y cuál es la paginación.

---

### WCAG 4.1.2 — Name, Role, Value (Nivel A)

**¿Qué?** Para todos los componentes de UI, el nombre, rol y valor deben determinarse
programáticamente y los cambios de estado deben notificarse a tecnologías asistivas.

**Implementación en `DataTableDemoPage.tsx`** — Toggle buttons:
```tsx
{/* ✅ role="group" agrupa los botones semánticamente */}
{/* ✅ aria-pressed comunica el estado activo/inactivo */}
<div role="group" aria-label="Seleccionar conjunto de datos">
  <button
    aria-pressed={isEmployees}  {/* "activado" o "no activado" */}
    onClick={() => setActiveDataset("employees")}
  >
    👥 Empleados
  </button>
  <button
    aria-pressed={activeDataset === "products"}
    onClick={() => setActiveDataset("products")}
  >
    📦 Productos
  </button>
</div>
```

**¿Qué anuncia el lector de pantalla?**
- Sin aria-pressed: *"botón Empleados"*
- Con aria-pressed: *"botón activado Empleados"* / *"botón no activado Empleados"*

---

### WCAG 4.1.3 — Status Messages (Nivel AA)

**¿Qué?** Los mensajes de estado (confirmaciones, errores, cargas) deben notificarse
a tecnologías asistivas sin necesidad de enfocar el elemento.

**Implementación en `Button.tsx`** — Estado de carga:
```tsx
// ✅ aria-busy notifica que el botón está procesando
// ✅ aria-label dinámico describe el estado actual al usuario de AT
// ✅ disabled previene doble envío
<button
  aria-busy={isLoading}
  aria-label={isLoading ? "Procesando, por favor espera" : undefined}
  disabled={disabled || isLoading}
>
  {isLoading && <Spinner aria-hidden="true" />}
  {children}
</button>
```

**Implementación en `ProtectedRoute.tsx`** — Spinner de sesión:
```tsx
// ✅ role="status" implica aria-live="polite"
// ✅ aria-label describe la acción en curso
// ✅ El spinner SVG tiene aria-hidden="true" — es puramente decorativo
<div role="status" aria-live="polite" aria-label="Verificando sesión, por favor espera">
  <svg aria-hidden="true" className="animate-spin" .../>
  <p>Cargando...</p>
</div>
```

**Diferencia entre `aria-live` values**:
| Valor | Comportamiento | Cuándo usar |
|-------|---------------|-------------|
| `polite` | Espera a que el usuario termine de leer | Mensajes de estado no urgentes |
| `assertive` | Interrumpe inmediatamente | Errores críticos (no abusar) |
| `off` | No anuncia cambios | Contenido que se actualiza frecuentemente |

---

### WCAG en `InputField.tsx` — Ejemplo completo

```tsx
<div className="mb-4">
  {/* WCAG 1.3.1 + 3.3.2: label asociada al input por htmlFor + id */}
  <label htmlFor={name}>{label}</label>

  <input
    id={name}              {/* coincide con htmlFor */}
    aria-invalid={!!error} {/* WCAG 4.1.2: comunica estado de validación */}
    aria-describedby={error ? `${name}-error` : undefined}
    {/* ↑ WCAG 4.1.2: conecta el input con su mensaje de error */}
  />

  {/* WCAG 3.3.1: Error Identification — el error se identifica y describe */}
  {error && (
    <p
      id={`${name}-error`}   {/* referenciado por aria-describedby */}
      role="alert"           {/* anuncia el error cuando cambia */}
    >
      {error}
    </p>
  )}
</div>
```

**¿Qué anuncia el lector de pantalla al enfocar un input con error?**
> *"Email inválido, editar texto, Correo electrónico, email inválido — el formato debe ser ejemplo@dominio.com"*

---

## Patrones ARIA — Referencia Rápida

### Tablas de datos (`DataTable.tsx`)

```tsx
<table>
  <caption>Descripción de la tabla</caption>  {/* WCAG 1.3.1 */}
  <thead>
    <tr>
      <th scope="col">Nombre</th>             {/* identifica columna */}
      <th scope="col" aria-sort="ascending">  {/* estado de ordenación */}
        Fecha
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>...</td>
    </tr>
  </tbody>
</table>

{/* Paginación */}
<nav aria-label="Navegación de páginas">       {/* landmark con nombre */}
  <button aria-label="Página anterior">←</button>
  <button aria-current="page">3</button>       {/* página activa */}
  <button aria-label="Ir a página 4">4</button>
</nav>
```

### Menús desplegables (en acciones de DataTable)

```tsx
{/* Botón disparador */}
<button
  aria-haspopup="true"     {/* indica que abre un menú */}
  aria-expanded={isOpen}   {/* estado: abierto/cerrado */}
  aria-label="Abrir menú de acciones"
>
  ⋮
</button>

{/* Menú */}
{isOpen && (
  <div role="menu">
    <button role="menuitem">Editar</button>  {/* ítems del menú */}
    <button role="menuitem">Eliminar</button>
  </div>
)}
```

### Elementos de solo lector de pantalla — clase `sr-only`

```tsx
{/* ✅ Visible solo para AT — invisible visualmente */}
<span className="sr-only">Acciones</span>

{/* Equivalente CSS de Tailwind: */}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Herramientas de Testing de Accesibilidad

### Automáticas

| Herramienta | Tipo | Qué detecta |
|-------------|------|-------------|
| [axe DevTools](https://www.deque.com/axe/) | Extension navegador | ~57% de issues automáticamente |
| [WAVE](https://wave.webaim.org/) | Extension / online | Errores, alertas, estructura |
| [Lighthouse](https://developers.google.com/web/tools/lighthouse) | Chrome DevTools | Score de accesibilidad |
| `@axe-core/react` | Librería | Detecta en dev mode |

> **Importante**: Las herramientas automáticas solo detectan ~30-40% de los problemas
> reales. El testing manual con lectores de pantalla reales es indispensable.

### Manuales

```bash
# Test básico de navegación por teclado:
# 1. Abrir la app en el navegador
# 2. Presionar Tab repetidamente — verificar que:
#    - Cada elemento interactivo recibe foco
#    - El foco es visible (outline azul)
#    - El orden de foco es lógico (top-left → bottom-right)
#    - No hay "trampas de foco" (loops infinitos)

# Test con lector de pantalla (macOS):
# Activar: Cmd + F5 para VoiceOver
# Navegar con: Control + Option + teclas de flecha

# Test con lector de pantalla (Windows):
# NVDA (gratis): https://www.nvaccess.org/download/
# Activar: Control + Alt + N
```

### Verificación de contraste de colores

```
# WCAG 1.4.3 (AA): contraste mínimo 4.5:1 para texto normal
# WCAG 1.4.6 (AAA): contraste mínimo 7:1 para texto normal
# WCAG 1.4.11 (AA): contraste mínimo 3:1 para componentes UI

# Herramienta: https://webaim.org/resources/contrastchecker/

# Paleta del proyecto (Tailwind):
# gray-900 (#111827) sobre white (#ffffff) → ~16.05:1 ✅ AAA
# blue-600 (#2563eb) sobre white (#ffffff) → ~5.40:1 ✅ AA
# gray-500 (#6b7280) sobre white (#ffffff) → ~4.48:1 ✅ AA (limits)
```

---

## Checklist de Accesibilidad — Para Pull Requests

Antes de hacer merge de cualquier PR con cambios de UI:

- [ ] ¿Todos los `<img>` tienen `alt`? (vacío `alt=""` para decorativas)
- [ ] ¿Todos los iconos decorativos tienen `aria-hidden="true"`?
- [ ] ¿Todos los botones con solo ícono tienen `aria-label`?
- [ ] ¿Todos los `<input>` tienen `<label>` asociada con `htmlFor`?
- [ ] ¿Los mensajes de error usan `role="alert"` o `aria-live`?
- [ ] ¿Los estados de carga usan `role="status"` o `aria-live`?
- [ ] ¿Las regiones principales tienen landmarks semánticos (`<main>`, `<nav>`, `<header>`)?
- [ ] ¿Los múltiples `<nav>` tienen `aria-label` únicos?
- [ ] ¿El color no es el único indicador de información (`1.4.1`)?
- [ ] ¿La jerarquía de headings es correcta (`<h1>` → `<h2>` → `<h3>`)?
- [ ] ¿Los toggle buttons tienen `aria-pressed`?
- [ ] ¿Se puede completar todo el flujo solo con teclado?

---

## Recursos de Aprendizaje

| Recurso | URL | Para qué |
|---------|-----|---------|
| WCAG 2.1 Quick Reference | https://www.w3.org/WAI/WCAG21/quickref/ | Criterios filtrables por nivel |
| WAI-ARIA Authoring Practices | https://www.w3.org/WAI/ARIA/apg/ | Patrones de diseño accesible con ejemplos |
| A11y Project Checklist | https://www.a11yproject.com/checklist/ | Checklist práctica |
| MDN ARIA | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA | Referencia completa |
| Testing Library queries | https://testing-library.com/docs/queries/about | `getByRole`, `getByLabelText` |

---

> **Conclusión pedagógica**: La accesibilidad no es una característica extra que se añade
> al final — es una **forma de construir** que beneficia a todos los usuarios.
> `<button>` en lugar de `<div onClick>` es más fácil, más semántico y más accesible.
> Los atributos ARIA bien usados son pocas líneas que hacen una diferencia enorme
> para millones de personas con discapacidades.
