/**
 * Archivo: components/layout/AuthLayout.tsx
 * Descripción: Layout para páginas de autenticación (login, register, forgot, reset).
 * ¿Para qué? Proveer un diseño centrado y consistente para todos los formularios de auth.
 * ¿Impacto? Sin este layout, cada página de auth tendría que implementar su propio centrado
 *           y estructura, causando inconsistencias visuales.
 */

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

/**
 * ¿Qué? Props del AuthLayout — título, subtítulo y children.
 * ¿Para qué? Personalizar el encabezado de cada formulario de auth.
 */
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  /** ¿Qué? Amplía el card a max-w-xl para formularios con más campos (ej: registro). */
  wide?: boolean;
}

/**
 * ¿Qué? Layout centrado con card para formularios de autenticación.
 * ¿Para qué? Diseño mobile-first: el card ocupa el ancho completo en móvil y se centra en desktop.
 * ¿Impacto? Consistencia visual: todos los formularios de auth tienen el mismo look.
 */
export function AuthLayout({ children, title, subtitle, wide = false }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      {/* ¿Qué? Header mínimo con selector de idioma y toggle de tema. */}
      <div className="flex justify-end gap-2 p-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* ¿Qué? Contenedor centrado vertical y horizontalmente. */}
      {/*
        ¿Qué? <main> como landmark semántico principal del documento.
        ¿Para qué? WCAG 2.1 — 1.3.6 Identify Purpose / 2.4.1 Bypass Blocks.
                   Los lectores de pantalla (NVDA, VoiceOver) listan landmarks
                   para que el usuario salte directamente al contenido principal.
        ¿Impacto? Sin <main>, un usuario de lector de pantalla debe escuchar TODA
                  la navegación antes de llegar al formulario. Con <main>, salta
                  directamente con un atajo de teclado.
      */}
      <main className="flex flex-1 items-center justify-center px-4 pb-8">
        <div className={`w-full ${wide ? "max-w-xl" : "max-w-md"}`}>
          {/* ¿Qué? Logo y título de la app centrados. */}
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              NN Auth
            </h1>
          </div>

          {/* ¿Qué? Card con fondo blanco, borde sutil y sombra suave. */}
          {/* ¿Para qué? Contener el formulario en una caja visual definida. */}
          {/* ¿Impacto? Diseño limpio, sin degradados, bordes sutiles. */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
            {/* ¿Qué? Título y subtítulo del formulario. */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
              )}
            </div>

            {/* ¿Qué? Slot para el contenido del formulario (children). */}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
