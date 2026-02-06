/**
 * Archivo: components/ui/InputField.tsx
 * Descripción: Campo de entrada reutilizable con label, icono, validación y mensajes de error.
 * ¿Para qué? Estandarizar todos los inputs del formulario de auth con un diseño consistente.
 * ¿Impacto? Sin este componente, cada formulario tendría su propia implementación de inputs,
 *           resultando en inconsistencias visuales y duplicación de lógica de validación.
 */

import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * ¿Qué? Props del componente InputField.
 * ¿Para qué? Definir todas las opciones configurables del input.
 * ¿Impacto? TypeScript valida que los consumidores pasen las props correctas.
 */
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  error?: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  /** ¿Qué? Icono opcional que se muestra a la izquierda del input.
   *  ¿Para qué? Mejorar la UX/UI dando contexto visual sobre el tipo de campo.
   *  ¿Impacto? Un icono de sobre para email, candado para password, etc. */
  icon?: ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * ¿Qué? Componente de input con label, icono izquierdo, borde de error y mensaje de validación.
 * ¿Para qué? Reutilizar en todos los formularios de auth (login, register, etc.).
 * ¿Impacto? Diseño moderno, sans-serif, dark/light mode, sin degradados.
 *           El borde cambia a rojo cuando hay error, a azul cuando tiene foco.
 */
export function InputField({
  label,
  name,
  type = "text",
  error,
  value,
  placeholder,
  autoComplete,
  icon,
  onChange,
}: InputFieldProps) {
  // ¿Qué? Estado para mostrar/ocultar contraseña.
  // ¿Para qué? Permitir al usuario verificar lo que escribió en campos de password.
  // ¿Impacto? Mejora la UX — evita errores de tipeo al registrarse o cambiar contraseña.
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-4">
      {/* ¿Qué? Label asociada al input por htmlFor + id. */}
      {/* ¿Para qué? Accesibilidad — lectores de pantalla anuncian qué campo es. */}
      {/* ¿Impacto? Sin htmlFor, los usuarios con discapacidad no sabrían qué ingresar. */}
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        {/* ¿Qué? Icono decorativo a la izquierda del input. */}
        {/* ¿Para qué? Dar contexto visual inmediato del tipo de campo (email, password, etc.). */}
        {/* ¿Impacto? Mejora significativa de UX — el usuario identifica el campo de un vistazo. */}
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`block w-full rounded-lg border ${icon ? "pl-10" : "px-3"} ${isPassword ? "pr-10" : icon ? "pr-3" : ""} py-2.5 text-sm transition-colors duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400 dark:focus:ring-red-400/20"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
          }`}
        />
        {/* ¿Qué? Botón para mostrar/ocultar contraseña usando iconos de Lucide. */}
        {/* ¿Para qué? Toggle de visibilidad en campos de password. */}
        {/* ¿Impacto? Sin este botón, el usuario no puede verificar lo que escribe. */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {/* ¿Qué? Mensaje de error debajo del input. */}
      {/* ¿Para qué? Informar al usuario qué está mal en el campo. */}
      {/* ¿Impacto? aria-describedby conecta el mensaje con el input para accesibilidad. */}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
