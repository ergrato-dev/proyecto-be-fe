/**
 * Archivo: pages/ForgotPasswordPage.tsx
 * Descripción: Página para solicitar recuperación de contraseña por email.
 * ¿Para qué? Iniciar el flujo de recuperación: el usuario ingresa su email
 *            y el backend envía un enlace de reset si el email existe.
 * ¿Impacto? La respuesta siempre es la misma — no revela si el email está registrado.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

/**
 * ¿Qué? Formulario de solicitud de recuperación de contraseña.
 * ¿Para qué? El usuario ingresa su email y el backend envía un enlace de reset.
 * ¿Impacto? Siempre muestra mensaje de éxito (por seguridad, sin revelar si el email existe).
 */
export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError(t("auth.forgotPassword.validation.emailRequired"));
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword({ email });
      setSuccess(t("auth.forgotPassword.successMessage"));
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("auth.forgotPassword.errorDefault");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t("auth.forgotPassword.title")} subtitle={t("auth.forgotPassword.subtitle")}>
      {success && (
        <div className="mb-4">
          <Alert type="success" message={success} />
        </div>
      )}
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
          value={email}
          placeholder={t("common.emailPlaceholder")}
          autoComplete="email"
          icon={<Mail className="h-5 w-5" />}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
        />

        <div className="mt-2 flex justify-end">
          <Button type="submit" fullWidth isLoading={isLoading}>
            {t("auth.forgotPassword.submit")}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t("auth.forgotPassword.backToLogin")}
        </Link>
      </p>
    </AuthLayout>
  );
}
