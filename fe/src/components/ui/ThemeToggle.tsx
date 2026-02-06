/**
 * Archivo: components/ui/ThemeToggle.tsx
 * Descripción: Botón para alternar entre tema claro y oscuro.
 * ¿Para qué? Permitir al usuario elegir su preferencia de tema (dark/light).
 * ¿Impacto? Sin este componente, el tema se definiría solo por prefers-color-scheme
 *           del sistema operativo, sin opción de cambio manual.
 */

import { useEffect, useState } from "react";

/**
 * ¿Qué? Hook interno que gestiona el estado del tema (dark/light).
 * ¿Para qué? Leer la preferencia del usuario desde localStorage, o caer en la del SO.
 * ¿Impacto? El tema persiste entre sesiones gracias a localStorage.
 */
function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // ¿Qué? Intenta leer la preferencia guardada en localStorage.
    // ¿Para qué? Respetar la última elección del usuario.
    // ¿Impacto? Si no hay preferencia guardada, usa la del sistema operativo.
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // ¿Qué? Agrega o quita la clase "dark" en el elemento <html>.
    // ¿Para qué? TailwindCSS usa la clase "dark" en html para activar los estilos dark:.
    // ¿Impacto? Sin esta clase, dark:bg-gray-950 y similares no se aplicarían.
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((prev) => !prev) };
}

/**
 * ¿Qué? Botón con ícono de sol/luna para cambiar entre dark y light mode.
 * ¿Para qué? Experiencia de usuario accesible con toggle visual.
 * ¿Impacto? Diseño limpio: solo un ícono con transición suave, sin texto ni degradados.
 */
export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={isDark ? "Tema claro" : "Tema oscuro"}
    >
      {isDark ? (
        // ¿Qué? Ícono de sol — indica que se cambiará a light mode.
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // ¿Qué? Ícono de luna — indica que se cambiará a dark mode.
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}
