---
description: "Crea un nuevo componente UI reutilizable para el frontend con TypeScript, TailwindCSS, soporte dark/light mode y test. Usar cuando se necesite un componente que se usará en múltiples páginas."
name: "Nuevo componente UI"
argument-hint: "Describe el componente: nombre, qué renderiza, qué props recibe, comportamiento interactivo, si necesita i18n"
agent: "agent"
---

# Nuevo componente UI reutilizable — NN Auth System

Crea un componente React reutilizable siguiendo las convenciones del proyecto.

## Convenciones obligatorias

- **Componentes**: funcionales con hooks, `PascalCase` en nombre y archivo
- **Tipos**: `interface` para props (sufijo `Props`), `type` para uniones
- **TailwindCSS**: única fuente de estilos — sin CSS modules, sin `style={{}}` inline
- **Dark mode**: todas las clases de color deben tener variante `dark:`
- **Sin degradados**: `bg-gradient-*` está **PROHIBIDO**
- **Fuente**: sans-serif exclusivamente (`font-sans`, nunca `font-serif`, `font-mono` salvo código)
- **Transiciones**: `transition-colors duration-200` en elementos interactivos

## Lo que debes generar

### 1. Componente (`fe/src/components/ui/NombreComponente.tsx`)

Estructura esperada:

```tsx
/**
 * Archivo: NombreComponente.tsx
 * ¿Qué? ...
 * ¿Para qué? ...
 * ¿Impacto? ...
 */

interface NombreComponenteProps {
  // props con tipos explícitos y JSDoc en español
}

export function NombreComponente({ ... }: NombreComponenteProps) {
  // ...
}
```

Referencia de componentes existentes:

- [fe/src/components/ui/Button.tsx](../../../fe/src/components/ui/Button.tsx) — botón con variantes
- [fe/src/components/ui/InputField.tsx](../../../fe/src/components/ui/InputField.tsx) — input con label y error
- [fe/src/components/ui/Alert.tsx](../../../fe/src/components/ui/Alert.tsx) — alerta con variantes semánticas

### 2. Exportar desde el barrel index (si existe `fe/src/components/ui/index.ts`)

Agregar: `export { NombreComponente } from './NombreComponente';`

### 3. Test (`fe/src/__tests__/components/NombreComponente.test.tsx`)

Casos mínimos:

- Renderiza correctamente con props mínimas
- Renderiza correctamente con todas las variantes/estados posibles
- Ejecuta callbacks (`onClick`, `onChange`, etc.) correctamente
- Si tiene texto: los textos son accesibles (roles, labels)

Usar `render`, `screen`, `fireEvent` / `userEvent` de Testing Library.
Test de referencia: [fe/src/**tests**/components/Button.test.tsx](../../../fe/src/__tests__/components/Button.test.tsx)

## Accesibilidad obligatoria

- Inputs: `<label htmlFor>` + `id` en el input
- Botones: texto visible o `aria-label` descriptivo
- Alertas/mensajes de error: `role="alert"`
- Imágenes decorativas: `alt=""`; imágenes informativas: `alt` descriptivo
- Focus visible en elementos interactivos (`focus:ring-2 focus:ring-blue-500`)

## Paleta de colores del sistema

Usar las clases semánticas ya establecidas en el proyecto:

- **Fondo**: `bg-white dark:bg-gray-900` / `bg-gray-50 dark:bg-gray-800`
- **Texto principal**: `text-gray-900 dark:text-gray-100`
- **Texto secundario**: `text-gray-600 dark:text-gray-400`
- **Bordes**: `border-gray-200 dark:border-gray-700`
- **Acento / acción primaria**: `bg-blue-600 hover:bg-blue-700 dark:bg-blue-500`
- **Error**: `text-red-600 dark:text-red-400` / `border-red-500`
- **Éxito**: `text-green-600 dark:text-green-400`

## Descripción del componente a crear

$input
