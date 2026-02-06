/**
 * Archivo: components/ui/Alert.tsx
 * Descripción: Componente de alerta para mostrar mensajes de éxito, error o información.
 * ¿Para qué? Dar feedback visual al usuario después de una acción (login exitoso, error, etc.).
 * ¿Impacto? Sin alertas, el usuario no sabría si una operación tuvo éxito o falló.
 */

/**
 * ¿Qué? Props del componente Alert.
 * ¿Para qué? Configurar tipo de alerta (success, error, info) y contenido del mensaje.
 * ¿Impacto? El tipo determina el color y el ícono de la alerta.
 */
interface AlertProps {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}

/**
 * ¿Qué? Componente de alerta con colores según tipo y botón de cierre opcional.
 * ¿Para qué? Mostrar mensajes de feedback en los formularios de auth.
 * ¿Impacto? Colores sólidos (sin degradados), bordes sutiles, transiciones suaves.
 */
export function Alert({ type, message, onClose }: AlertProps) {
  // ¿Qué? Mapeo de tipo → clases CSS para colores del contenedor.
  // ¿Para qué? Cada tipo de alerta tiene colores que comunican su naturaleza.
  // ¿Impacto? Verde = éxito, rojo = error, azul = información.
  const typeClasses = {
    success:
      "bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    error:
      "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    info: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  };

  // ¿Qué? Clases CSS para el botón de cierre según el tipo de alerta.
  const closeClasses = {
    success:
      "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200",
    error: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200",
    info: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200",
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 text-sm ${typeClasses[type]}`}
      role="alert"
    >
      {/* ¿Qué? Íconos SVG según el tipo de alerta. */}
      {/* ¿Para qué? Reforzar visualmente el significado de la alerta. */}
      <span className="mt-0.5 flex-shrink-0">
        {type === "success" && (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "error" && (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "info" && (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>

      {/* ¿Qué? Texto del mensaje y botón de cierre. */}
      <span className="flex-1">{message}</span>

      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 transition-colors ${closeClasses[type]}`}
          aria-label="Cerrar alerta"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
}
