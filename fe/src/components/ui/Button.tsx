/**
 * Archivo: components/ui/Button.tsx
 * Descripción: Botón reutilizable con variantes de estilo y estado de carga.
 * ¿Para qué? Estandarizar la apariencia y comportamiento de todos los botones de la app.
 * ¿Impacto? Sin este componente, cada botón tendría estilos diferentes,
 *           rompiendo la consistencia visual del diseño.
 */

/**
 * ¿Qué? Props del componente Button.
 * ¿Para qué? Configurar variante (primary, secondary, danger), tamaño, loading, etc.
 * ¿Impacto? TypeScript garantiza que solo se usen variantes válidas.
 */
interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * ¿Qué? Componente de botón con variantes de color, tamaño y estado de carga.
 * ¿Para qué? Reutilizar en formularios, modales, acciones del dashboard, etc.
 * ¿Impacto? Diseño: colores sólidos (sin degradados), transiciones suaves, sans-serif.
 *           El spinner aparece automáticamente cuando isLoading=true.
 */
export function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
}: ButtonProps) {
  // ¿Qué? Clases CSS según la variante elegida (primary, secondary, danger).
  // ¿Para qué? Cada variante tiene colores distintos para comunicar intención.
  // ¿Impacto? primary = acción principal (azul), secondary = acción secundaria (gris),
  //           danger = acción destructiva (rojo).
  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-blue-500/20",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 focus:ring-gray-500/20",
    danger:
      "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:ring-red-500/20",
  };

  // ¿Qué? Clases CSS según el tamaño elegido.
  // ¿Para qué? Permitir botones de diferentes tamaños según el contexto.
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""}`}
    >
      {/* ¿Qué? Spinner SVG animado que aparece durante la carga. */}
      {/* ¿Para qué? Feedback visual de que la acción está procesándose. */}
      {/* ¿Impacto? Sin loading state, el usuario podría hacer clic varias veces. */}
      {isLoading && (
        <svg
          className="-ml-1 mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
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
      )}
      {children}
    </button>
  );
}
