/**
 * Archivo: pages/LoginPage.tsx
 * Descripción: Página de inicio de sesión — formulario de email y contraseña.
 * ¿Para qué? Permitir que usuarios registrados se autentiquen en el sistema.
 * ¿Impacto? Es la puerta de entrada a la app — sin login, no se puede acceder a nada protegido.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

/**
 * ¿Qué? Página de login con formulario, manejo de errores y redirección post-login.
 * ¿Para qué? Autenticar al usuario con email + password y obtener tokens JWT.
 * ¿Impacto? Una vez autenticado, se redirige al dashboard automáticamente.
 *
 * i18n pedagógico:
 *   useTranslation() provee t() — función que recibe una clave y retorna el texto
 *   en el idioma activo. Ejemplo: t("auth.login.title") → "Iniciar sesión" (es) | "Sign in" (en).
 *   Si el usuario cambia idioma, este componente se re-renderiza automáticamente.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  // ¿Qué? Hook de traducción — desestructuramos solo t() ya que no necesitamos i18n aquí.
  // ¿Para qué? t("clave") retorna el texto en el idioma activo según los archivos de locales/.
  // ¿Impacto? Cada vez que el idioma cambia, React re-renderiza y t() retorna el nuevo texto.
  const { t } = useTranslation();

  // ¿Qué? Estado del formulario — email y password.
  const [formData, setFormData] = useState({ email: "", password: "" });
  // ¿Qué? Error general del formulario (credenciales inválidas, servidor caído, etc.).
  const [error, setError] = useState<string | null>(null);
  // ¿Qué? Flag de carga — deshabilita el botón mientras se procesa el login.
  const [isLoading, setIsLoading] = useState(false);

  /**
   * ¿Qué? Actualiza el campo correspondiente cuando el usuario escribe.
   * ¿Para qué? Mantener el estado sincronizado con los inputs del formulario.
   * ¿Impacto? Patrón controlled component — React controla el valor de cada input.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null); // Limpiar error al escribir
  };

  /**
   * ¿Qué? Envía las credenciales al backend y maneja la respuesta.
   * ¿Para qué? Autenticar al usuario y navegar al dashboard si es exitoso.
   * ¿Impacto? Si falla, muestra el mensaje de error. Si tiene éxito, redirige.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(formData);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : t("auth.login.errorDefault");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t("auth.login.title")} subtitle={t("auth.login.subtitle")}>
      {/* ¿Qué? Alerta de error visible cuando el login falla. */}
      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          label={t("common.email")}
          name="email"
          type="email"
          value={formData.email}
          placeholder={t("common.emailPlaceholder")}
          autoComplete="email"
          icon={<Mail className="h-5 w-5" />}
          onChange={handleChange}
        />

        <InputField
          label={t("common.password")}
          name="password"
          type="password"
          value={formData.password}
          placeholder={t("common.passwordPlaceholder")}
          autoComplete="current-password"
          icon={<Lock className="h-5 w-5" />}
          onChange={handleChange}
        />

        {/* ¿Qué? Enlace a recuperación de contraseña. */}
        <div className="mb-6 flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {t("auth.login.forgotPassword")}
          </Link>
        </div>

        {/* ¿Qué? Botón de submit con estado de carga. */}
        {/* ¿Para qué? Enviar el formulario y deshabilitarse mientras se procesa. */}
        <div className="flex justify-end">
          <Button type="submit" fullWidth isLoading={isLoading}>
            {t("auth.login.submit")}
          </Button>
        </div>
      </form>

      {/* ¿Qué? Enlace a la página de registro. */}
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {t("auth.login.noAccount")}{" "}
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t("auth.login.createAccountLink")}
        </Link>
      </p>
    </AuthLayout>
  );
}
