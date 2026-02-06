/**
 * Archivo: pages/DashboardPage.tsx
 * Descripción: Página principal del usuario autenticado — muestra su perfil e información.
 * ¿Para qué? Ser el destino después del login — el usuario ve su info y accede a acciones.
 * ¿Impacto? Sin esta página, el usuario logueado no tendría a dónde ir después del login.
 */

import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

/**
 * ¿Qué? Dashboard con tarjeta de perfil y accesos rápidos.
 * ¿Para qué? Mostrar los datos del usuario y dar acceso a acciones (cambiar contraseña, etc.).
 * ¿Impacto? Es la página protegida principal — solo accesible con sesión activa.
 */
export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* ¿Qué? Saludo personalizado con el nombre del usuario. */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Bienvenido, {user?.full_name}
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Panel de control de tu cuenta
        </p>
      </div>

      {/* ¿Qué? Tarjeta con información del perfil del usuario. */}
      {/* ¿Para qué? Mostrar datos de la cuenta: email, estado, fechas. */}
      {/* ¿Impacto? El usuario puede verificar que su información es correcta. */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Información del perfil
        </h2>

        <dl className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40">
              Nombre
            </dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100">{user?.full_name}</dd>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40">
              Correo
            </dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100">{user?.email}</dd>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40">
              Estado
            </dt>
            <dd>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user?.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {user?.is_active ? "Activo" : "Inactivo"}
              </span>
            </dd>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40">
              Miembro desde
            </dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </dd>
          </div>
        </dl>

        {/* ¿Qué? Botón de cambiar contraseña alineado a la derecha. */}
        {/* ¿Para qué? Acceder rápidamente a la funcionalidad de cambio de contraseña. */}
        {/* ¿Impacto? Botones de acción siempre a la derecha (regla de diseño del proyecto). */}
        <div className="mt-6 flex justify-end border-t border-gray-200 pt-4 dark:border-gray-700">
          <Link to="/change-password">
            <Button variant="secondary" size="sm">
              Cambiar contraseña
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
