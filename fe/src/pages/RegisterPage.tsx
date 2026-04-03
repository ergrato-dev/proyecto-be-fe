/**
 * Archivo: pages/RegisterPage.tsx
 * Descripción: Página de registro — formulario para crear una nueva cuenta.
 * ¿Para qué? Permitir que nuevos usuarios se registren con email, nombre y contraseña.
 * ¿Impacto? Sin esta página, no habría forma de crear cuentas desde el frontend.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, MailCheck, Lock, KeyRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";

/**
 * ¿Qué? Página de registro con validación de campos y feedback de errores.
 * ¿Para qué? Crear cuenta → login automático → redirección al dashboard.
 * ¿Impacto? Tras un registro exitoso, el usuario queda logueado automáticamente.
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    confirmEmail: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Limpiar error del campo cuando el usuario escribe
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setGeneralError(null);
  };

  /**
   * ¿Qué? Validación del lado del cliente antes de enviar al backend.
   * ¿Para qué? Dar feedback inmediato sin esperar la respuesta del servidor.
   * ¿Impacto? Reduce peticiones innecesarias y mejora la UX.
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t("auth.register.validation.emailRequired");
    }

    // ¿Qué? Validar que el correo de confirmación coincida con el principal.
    // ¿Para qué? El usuario debe haber escrito el mismo correo dos veces de forma manual.
    // ¿Impacto? Previene registros con errores tipográficos que bloquearían la cuenta
    //           (el email de verificación llegaría a una dirección incorrecta).
    if (!formData.confirmEmail) {
      newErrors.confirmEmail = t("auth.register.validation.confirmEmailRequired");
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = t("auth.register.validation.emailsMismatch");
    }

    if (!formData.first_name || formData.first_name.trim().length < 2) {
      newErrors.first_name = t("auth.register.validation.firstNameMin");
    }

    if (!formData.last_name || formData.last_name.trim().length < 2) {
      newErrors.last_name = t("auth.register.validation.lastNameMin");
    }

    if (formData.password.length < 8) {
      newErrors.password = t("auth.register.validation.passwordMin");
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = t("auth.register.validation.passwordUppercase");
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = t("auth.register.validation.passwordLowercase");
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = t("auth.register.validation.passwordNumber");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.register.validation.passwordsMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        password: formData.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : t("auth.register.errorDefault");
      setGeneralError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t("auth.register.title")} subtitle={t("auth.register.subtitle")}>
      {generalError && (
        <div className="mb-4">
          <Alert type="error" message={generalError} onClose={() => setGeneralError(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* ¿Qué? Fila con dos inputs en paralelo: nombre y apellido. */}
        {/* ¿Para qué? Separar nombres y apellidos para mayor claridad y flexibilidad en el sistema. */}
        {/* ¿Impacto? El backend almacena ambos campos por separado en la BD. */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label={t("common.firstName")}
            name="first_name"
            type="text"
            value={formData.first_name}
            placeholder="Juan"
            autoComplete="given-name"
            icon={<User className="h-5 w-5" />}
            error={errors.first_name}
            onChange={handleChange}
          />

          <InputField
            label={t("common.lastName")}
            name="last_name"
            type="text"
            value={formData.last_name}
            placeholder="Pérez"
            autoComplete="family-name"
            icon={<User className="h-5 w-5" />}
            error={errors.last_name}
            onChange={handleChange}
          />
        </div>

        <InputField
          label={t("common.email")}
          name="email"
          type="email"
          value={formData.email}
          placeholder={t("common.emailPlaceholder")}
          autoComplete="email"
          icon={<Mail className="h-5 w-5" />}
          error={errors.email}
          onChange={handleChange}
        />

        {/* ¿Qué? Campo de confirmación del correo electrónico con pegado deshabilitado. */}
        {/* ¿Para qué? Obligar al usuario a escribir el correo dos veces de forma manual, */}
        {/*            garantizando que la dirección es la correcta y que la conoce de memoria. */}
        {/* ¿Impacto? Evita el error clásico de registrarse con un typo en el email — */}
        {/*            lo que impediría recibir el enlace de verificación. */}
        <InputField
          label={t("auth.register.confirmEmail")}
          name="confirmEmail"
          type="email"
          value={formData.confirmEmail}
          placeholder={t("common.emailPlaceholder")}
          autoComplete="off"
          icon={<MailCheck className="h-5 w-5" />}
          error={errors.confirmEmail}
          onChange={handleChange}
          disablePaste
        />

        <InputField
          label={t("common.password")}
          name="password"
          type="password"
          value={formData.password}
          placeholder={t("common.passwordPlaceholder")}
          autoComplete="new-password"
          icon={<Lock className="h-5 w-5" />}
          error={errors.password}
          onChange={handleChange}
        />

        {/* ¿Qué? Indicador visual de fortaleza de contraseña en tiempo real. */}
        {/* ¿Para qué? Guiar al usuario a construir una contraseña segura antes de enviar. */}
        {/* ¿Impacto? No se muestra si el campo está vacío — se activa al primer carácter. */}
        <PasswordStrengthIndicator password={formData.password} />

        <InputField
          label={t("auth.register.confirmPassword")}
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          placeholder={t("common.passwordPlaceholder")}
          autoComplete="new-password"
          icon={<KeyRound className="h-5 w-5" />}
          error={errors.confirmPassword}
          onChange={handleChange}
          disablePaste
        />

        <div className="mt-2 flex justify-end">
          <Button type="submit" fullWidth isLoading={isLoading}>
            {t("auth.register.submit")}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {t("auth.register.haveAccount")}{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t("auth.register.loginLink")}
        </Link>
      </p>
    </AuthLayout>
  );
}
