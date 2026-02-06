/**
 * Archivo: components/ProtectedRoute.tsx
 * Descripción: Componente que protege rutas que requieren autenticación.
 * ¿Para qué? Redirigir automáticamente al login si el usuario no está autenticado.
 * ¿Impacto? Sin este componente, cualquier persona podría acceder al dashboard
 *           sin estar logueado, simplemente navegando a la URL directamente.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * ¿Qué? Props de ProtectedRoute — solo acepta children.
 * ¿Para qué? Envolver componentes que requieren sesión activa.
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ¿Qué? Componente que verifica autenticación antes de renderizar children.
 * ¿Para qué? Proteger rutas como /dashboard, /change-password, etc.
 * ¿Impacto? Si el usuario no está logueado, redirige a /login automáticamente.
 *           Muestra un spinner mientras se verifica la sesión (isLoading).
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // ¿Qué? Spinner de carga mientras se verifica la sesión.
  // ¿Para qué? Al cargar la app, se hace GET /me para validar el token.
  //           Mientras tanto, no sabemos si el usuario está logueado o no.
  // ¿Impacto? Sin este loading, la app redirigiría al login brevemente antes de cargar.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  // ¿Qué? Si no hay sesión activa, redirigir al login.
  // ¿Para qué? Proteger la ruta — el usuario debe autenticarse primero.
  // ¿Impacto? replace evita que el botón "atrás" vuelva a la ruta protegida.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ¿Qué? Si está autenticado, renderizar los children normalmente.
  return <>{children}</>;
}
