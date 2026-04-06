/**
 * Archivo: pages/ChangePasswordPage.tsx
 * Descripción: Página para cambiar la contraseña del usuario autenticado.
 * ¿Para qué? Permitir al usuario actualizar su contraseña ingresando la actual y la nueva.
 * ¿Impacto? Requiere contraseña actual como verificación — previene cambios no autorizados.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, KeyRound, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";

/**
 * ¿Qué? Formulario de cambio de contraseña con validación y feedback.
 * ¿Para qué? El usuario autenticado puede actualizar su contraseña.
 * ¿Impacto? Si la contraseña actual es incorrecta, el backend retorna 400.
 */
export function ChangePasswordPage() {
  const { changePassword } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    current_password: "",
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
    setSuccess(null);
  };

  /**
   * ¿Qué? Validación del lado del cliente para la nueva contraseña.
   * ¿Para qué? Verificar fortaleza y coincidencia antes de enviar al backend.
   * ¿Impacto? Mismas reglas que el registro: 8+ chars, mayúscula, minúscula, número.
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.current_password) {
      newErrors.current_password = t("auth.changePassword.validation.currentRequired");
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
      await changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
      });
      setSuccess(t("auth.changePassword.successMessage"));
      setFormData({ current_password: "", new_password: "", confirmPassword: "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : t("auth.changePassword.errorDefault");
      setGeneralError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t("auth.changePassword.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {t("auth.changePassword.subtitle")}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {success && (
          <div className="mb-4">
            <Alert type="success" message={success} onClose={() => setSuccess(null)} />
          </div>
        )}
        {generalError && (
          <div className="mb-4">
            <Alert type="error" message={generalError} onClose={() => setGeneralError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <InputField
            label={t("auth.changePassword.currentPassword")}
            name="current_password"
            type="password"
            value={formData.current_password}
            placeholder="••••••••"
            autoComplete="current-password"
            autoFocus
            icon={<Lock className="h-5 w-5" />}
            error={errors.current_password}
            onChange={handleChange}
          />

          <InputField
            label={t("auth.changePassword.newPassword")}
            name="new_password"
            type="password"
            value={formData.new_password}
            placeholder={t("common.passwordPlaceholder")}
            autoComplete="new-password"
            icon={<KeyRound className="h-5 w-5" />}
            error={errors.new_password}
            onChange={handleChange}
          />

          {/* ¿Qué? Indicador de fortaleza para la nueva contraseña. */}
          {/* ¿Para qué? El usuario puede ver si su nueva contraseña es suficientemente segura. */}
          {/* ¿Impacto? Misma lógica que en registro — 4 niveles de fortaleza. */}
          <PasswordStrengthIndicator password={formData.new_password} />

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

          {/* ¿Qué? Botones de acción: cancelar (volver) y guardar. */}
          {/* ¿Para qué? Cancelar regresa al dashboard; guardar envía el formulario. */}
          {/* ¿Impacto? Botones alineados a la derecha según reglas de diseño. */}
          <div className="mt-2 flex justify-end gap-3">
            <Link to="/dashboard">
              <Button variant="secondary">{t("common.cancel")}</Button>
            </Link>
            <Button type="submit" isLoading={isLoading}>
              {t("common.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
