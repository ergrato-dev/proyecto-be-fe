/**
 * Archivo: components/ui/InputField.tsx
 * Descripción: Campo de entrada reutilizable con label, validación y mensajes de error.
 * ¿Para qué? Estandarizar todos los inputs del formulario de auth con un diseño consistente.
 * ¿Impacto? Sin este componente, cada formulario tendría su propia implementación de inputs,
 *           resultando en inconsistencias visuales y duplicación de lógica de validación.
 */

import { useState } from "react";

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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * ¿Qué? Componente de input con label, borde de error y mensaje de validación.
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
          className={`block w-full rounded-lg border px-3 py-2.5 text-sm transition-colors duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400 dark:focus:ring-red-400/20"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
          }`}
        />
        {/* ¿Qué? Botón para mostrar/ocultar contraseña. */}
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
              // Icono ojo cerrado (ocultar)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.092 1.092a4 4 0 00-5.558-5.558z"
                  clipRule="evenodd"
                />
                <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
              </svg>
            ) : (
              // Icono ojo abierto (mostrar)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                <path
                  fillRule="evenodd"
                  d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
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
