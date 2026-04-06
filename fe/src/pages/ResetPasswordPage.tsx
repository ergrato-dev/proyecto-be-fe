/**
 * Archivo: pages/ResetPasswordPage.tsx
 * Descripción: Página para restablecer la contraseña usando el token recibido por email.
 * ¿Para qué? Completar el flujo de recuperación: el usuario ingresa la nueva contraseña
 *            junto con el token que recibió en el enlace del email.
 * ¿Impacto? Una vez restablecida, el token se marca como usado y el usuario puede hacer login.
 */

import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

/**
 * ¿Qué? Formulario de restablecimiento de contraseña con token de email.
 * ¿Para qué? El token viene como query param: /reset-password?token=xxx.
 * ¿Impacto? Si el token es inválido, expirado o ya usado, el backend retorna error.
 */
export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  // ¿Qué? Lee el token del query param de la URL.
  // ¿Para qué? El enlace del email tiene formato: /reset-password?token=<uuid>.
  // ¿Impacto? Sin el token, no se puede completar el reset.
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    new_password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setGeneralError(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!token) {
      setGeneralError(t("auth.resetPassword.tokenMissing"));
      return false;
    }

    if (formData.new_password.length < 8) {
      newErrors.new_password = t("auth.register.validation.passwordMin");
    } else if (!/[A-Z]/.test(formData.new_password)) {
      newErrors.new_password = t("auth.register.validation.passwordUppercase");
    } else if (!/[a-z]/.test(formData.new_password)) {
      newErrors.new_password = t("auth.register.validation.passwordLowercase");
    } else if (!/\d/.test(formData.new_password)) {
      newErrors.new_password = t("auth.register.validation.passwordNumber");
    }

    if (formData.new_password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.register.validation.passwordsMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccess(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      await resetPassword({
        token,
        new_password: formData.new_password,
      });
      setSuccess(t("auth.resetPassword.successMessage"));
      setFormData({ new_password: "", confirmPassword: "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : t("auth.resetPassword.errorDefault");
      setGeneralError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ¿Qué? Si no hay token en la URL, mostrar mensaje de error.
  if (!token) {
    return (
      <AuthLayout title={t("auth.resetPassword.invalidLinkTitle")}>
        <Alert type="error" message={t("auth.resetPassword.invalidLinkMessage")} />
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link
            to="/forgot-password"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {t("auth.resetPassword.requestNewLink")}
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("auth.resetPassword.title")} subtitle={t("auth.resetPassword.subtitle")}>
      {success && (
        <div className="mb-4">
          <Alert type="success" message={success} />
        </div>
      )}
      {generalError && (
        <div className="mb-4">
          <Alert type="error" message={generalError} onClose={() => setGeneralError(null)} />
        </div>
      )}

      {!success ? (
        <form onSubmit={handleSubmit} noValidate>
          <InputField
            label={t("auth.changePassword.newPassword")}
            name="new_password"
            type="password"
            value={formData.new_password}
            placeholder={t("common.passwordPlaceholder")}
            autoComplete="new-password"
            autoFocus
            icon={<KeyRound className="h-5 w-5" />}
            error={errors.new_password}
            onChange={handleChange}
          />

          <InputField
            label={t("auth.changePassword.confirmPassword")}
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            placeholder={t("common.passwordPlaceholder")}
            autoComplete="new-password"
            icon={<ShieldCheck className="h-5 w-5" />}
            error={errors.confirmPassword}
            onChange={handleChange}
          />

          <div className="mt-2 flex justify-end">
            <Button type="submit" fullWidth isLoading={isLoading}>
              {t("auth.resetPassword.submit")}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex justify-end">
          <Link to="/login">
            <Button>{t("auth.resetPassword.loginLink")}</Button>
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
