/**
 * Archivo: components/layout/AuthLayout.tsx
 * Descripción: Layout para páginas de autenticación (login, register, forgot, reset).
 * ¿Para qué? Proveer un diseño centrado y consistente para todos los formularios de auth.
 * ¿Impacto? Sin este layout, cada página de auth tendría que implementar su propio centrado
 *           y estructura, causando inconsistencias visuales.
 */

import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * ¿Qué? Props del AuthLayout — título, subtítulo y children.
 * ¿Para qué? Personalizar el encabezado de cada formulario de auth.
 */
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

/**
 * ¿Qué? Layout centrado con card para formularios de autenticación.
 * ¿Para qué? Diseño mobile-first: el card ocupa el ancho completo en móvil y se centra en desktop.
 * ¿Impacto? Consistencia visual: todos los formularios de auth tienen el mismo look.
 */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      {/* ¿Qué? Header mínimo con toggle de tema en la esquina superior derecha. */}
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>

      {/* ¿Qué? Contenedor centrado vertical y horizontalmente. */}
      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* ¿Qué? Logo y título de la app centrados. */}
          <div className="mb-8 text-center">
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
      </div>
    </div>
  );
}
