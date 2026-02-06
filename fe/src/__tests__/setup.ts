/**
 * Archivo: __tests__/setup.ts
 * Descripción: Configuración global de los tests — se ejecuta antes de cada archivo de test.
 * ¿Para qué? Importar matchers de jest-dom y configurar el entorno DOM simulado.
 * ¿Impacto? Sin este setup, los matchers como toBeInTheDocument() no estarían disponibles
 *           y los tests no podrían interactuar con el DOM.
 */

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// ¿Qué? Limpia el DOM después de cada test.
// ¿Para qué? Evitar que el estado de un test interfiera con el siguiente.
// ¿Impacto? Sin cleanup, elementos renderizados en un test quedarían en el DOM del siguiente.
afterEach(() => {
  cleanup();
});

// ¿Qué? Mock de matchMedia — no disponible en jsdom.
// ¿Para qué? ThemeToggle usa window.matchMedia para detectar prefers-color-scheme.
// ¿Impacto? Sin este mock, los tests que usen ThemeToggle lanzarían "matchMedia is not a function".
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ¿Qué? Mock de sessionStorage para tests.
// ¿Para qué? AuthContext usa sessionStorage para persistir tokens.
// ¿Impacto? jsdom implementa sessionStorage, pero lo limpiamos para asegurar aislamiento.
afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});
