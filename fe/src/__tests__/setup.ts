/**
 * Archivo: __tests__/setup.ts
 * Descripción: Configuración global de los tests — se ejecuta antes de cada archivo de test.
 * ¿Para qué? Importar matchers de jest-dom y configurar el entorno DOM simulado.
 * ¿Impacto? Sin este setup, los matchers como toBeInTheDocument() no estarían disponibles
 *           y los tests no podrían interactuar con el DOM.
 */

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";
import esTranslations from "@/locales/es/translation.json";

// ¿Qué? Resuelve una clave de traducción anidada en el objeto JSON de español.
// ¿Para qué? El mock de t() necesita devolver el texto real (no la clave) para que
//            los tests puedan buscar elementos por texto visible ("Iniciar sesión", etc.).
// ¿Impacto? Si el mock devuelve la clave, todos los getByText/getByLabelText fallan.
function resolveKey(
  obj: Record<string, unknown>,
  key: string,
  opts?: Record<string, unknown>,
): string {
  const parts = key.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return key;
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current !== "string") return key;
  // ¿Qué? Sustituir interpolaciones como {{name}} con los valores de opts.
  // ¿Para qué? Tests que verifican "Bienvenido, Test" necesitan la interpolación resuelta.
  if (opts) {
    return Object.entries(opts).reduce(
      (acc, [k, v]) => acc.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v)),
      current,
    );
  }
  return current;
}

// ¿Qué? Mock global de react-i18next para todos los tests.
// ¿Para qué? Los componentes usan useTranslation() y t() — sin mock causarían error en jsdom.
// ¿Impacto? El mock resuelve las claves a texto en español real, manteniendo
//           la legibilidad de los tests (los assertions buscan texto real visible).
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      resolveKey(esTranslations as Record<string, unknown>, key, opts),
    i18n: {
      changeLanguage: vi.fn().mockResolvedValue(undefined),
      language: "es",
    },
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

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
