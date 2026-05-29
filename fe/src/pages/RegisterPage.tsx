/**
 * Archivo: pages/RegisterPage.tsx
 * Descripción: Página de registro — formulario para crear una nueva cuenta.
 * ¿Para qué? Permitir que nuevos usuarios se registren con email, nombre y contraseña.
 * ¿Impacto? Sin esta página, no habría forma de crear cuentas desde el frontend.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, MailCheck, Lock, KeyRound } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Modal } from "@/components/ui/Modal";
import { LandingPage } from "@/pages/LandingPage";
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
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    cookies: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // ¿Qué? Flag que indica que la cuenta se creó pero el email aún no fue verificado.
  // ¿Para qué? Mostrar un aviso informativo (amarillo) FUERA del formulario en lugar
  //            de un error rojo dentro del card, evitando confusión en el usuario.
  // ¿Impacto? El usuario entiende que el proceso fue exitoso y solo debe revisar su correo.
  const [verifyEmailPending, setVerifyEmailPending] = useState(false);

  /**
   * ¿Qué? Actualiza el campo del formulario cuando el usuario escribe y limpia el error de ese campo.
   * ¿Para qué? Mantener el estado sincronizado con los inputs y dar feedback inmediato al limpiar errores.
   * ¿Impacto? Patrón controlled component — React controla el valor de cada input.
   *           El error del campo desaparece en cuanto el usuario empieza a corregirlo.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Limpiar error del campo cuando el usuario escribe
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setGeneralError(null);
    setVerifyEmailPending(false);
  };

  // ¿Qué? Handler para los checkboxes de consentimiento legal.
  // ¿Para qué? Actualizar el estado de cada casilla individualmente.
  // ¿Impacto? El botón se habilita solo cuando las tres casillas estén marcadas
  //           y todos los campos del formulario tengan algún valor.
  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsents((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  // ¿Qué? Computed: habilita el botón de envío en tiempo real.
  // ¿Para qué? Dar feedback inmediato al usuario sin esperar el submit.
  // ¿Impacto? El botón permanece deshabilitado hasta que se cumplan AMBAS condiciones:
  //           1) todos los campos tienen algún valor, 2) los tres consentimientos están marcados.
  const allFieldsFilled =
    formData.email.trim() !== "" &&
    formData.confirmEmail.trim() !== "" &&
    formData.first_name.trim() !== "" &&
    formData.last_name.trim() !== "" &&
    formData.password !== "" &&
    formData.confirmPassword !== "";
  const allConsentsAccepted = consents.terms && consents.privacy && consents.cookies;
  const isButtonEnabled = allFieldsFilled && allConsentsAccepted;

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

    // ¿Qué? Validación de consentimientos legales obligatorios.
    // ¿Para qué? Garantizar que el usuario explícitamente aceptó los documentos legales antes de registrarse.
    // ¿Impacto? Sin esta verificación, el registro podría procesarse sin consentimiento válido,
    //           lo cual viola la Ley 1581/2012 (protección de datos) y la Ley 1480/2011 (estatuto del consumidor).
    if (!consents.terms) newErrors.terms = t("auth.register.validation.termsRequired");
    if (!consents.privacy) newErrors.privacy = t("auth.register.validation.privacyRequired");
    if (!consents.cookies) newErrors.cookies = t("auth.register.validation.cookiesRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * ¿Qué? Envía los datos del formulario al backend para crear la cuenta.
   * ¿Para qué? Ejecutar la secuencia: validar → registrar → login automático → redirigir al dashboard.
   * ¿Impacto? Tras un registro exitoso, el usuario queda autenticado inmediatamente
   *           sin necesidad de ir al formulario de login.
   */
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
      // ¿Qué? Distingue entre un error de verificación de email y un error real del registro.
      // ¿Para qué? Si la cuenta se creó pero el login automático falló por email no verificado,
      //            es un flujo esperado — se muestra un aviso informativo, no un error rojo.
      // ¿Impacto? El usuario no confunde el aviso de "revisa tu correo" con un fallo en el registro.
      if (
        err instanceof Error &&
        (err as Error & { requiresEmailVerification?: boolean }).requiresEmailVerification
      ) {
        setVerifyEmailPending(true);
      } else {
        const message = err instanceof Error ? err.message : t("auth.register.errorDefault");
        setGeneralError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LandingPage />
      <Modal onClose={() => navigate("/")} wide aria-label={t("auth.register.title")}>
        <div className="p-6 sm:p-8">
          {verifyEmailPending && (
            <div className="mb-4">
              <Alert
                type="warning"
                message={t("auth.register.verifyEmailNotice", { email: formData.email })}
              />
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("auth.register.title")}
            </h2>
            {!verifyEmailPending && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t("auth.register.subtitle")}
              </p>
            )}
          </div>

          {generalError && (
            <div className="mb-4">
              <Alert type="error" message={generalError} onClose={() => setGeneralError(null)} />
            </div>
          )}

          {verifyEmailPending ? (
            // ¿Qué? Estado de confirmación dentro del card — reemplaza el formulario.
            // ¿Para qué? Una vez creada la cuenta, el formulario ya no tiene utilidad inmediata.
            //            Se muestra un mensaje claro con la siguiente acción del usuario.
            // ¿Impacto? El usuario no puede reenviar el formulario accidentalmente.
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <svg
                className="h-12 w-12 text-accent-600 dark:text-accent-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("auth.register.verifyEmailCardTitle")}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {t("auth.register.verifyEmailCardBody")}
                </p>
              </div>
              <Link
                to="/login"
                className="mt-2 text-sm font-medium text-accent-600 hover:text-accent-700
              dark:text-accent-400 dark:hover:text-accent-300 transition-colors"
              >
                {t("auth.register.loginLink")}
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} noValidate>
                {/* Fila 1: Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label={t("common.firstName")}
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    placeholder="Juan"
                    autoComplete="given-name"
                    autoFocus
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

                {/* Fila 2: Email y Confirmar email en paralelo */}
                {/* ¿Qué? Dos columnas para los campos de correo. */}
                {/* ¿Para qué? Reducir el scroll al agrupar campos relacionados en la misma fila. */}
                {/* ¿Impacto? El usuario ve ambos campos juntos, reforzando visualmente que deben coincidir. */}
                <div className="grid grid-cols-2 gap-3">
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
                </div>

                {/* Fila 3: Contraseña y Confirmar contraseña en paralelo */}
                {/* ¿Qué? Dos columnas para los campos de contraseña. */}
                {/* ¿Para qué? Igual que los emails — relacionados visualmente y más compactos. */}
                {/* ¿Impacto? El indicador de fortaleza ocupa toda la fila debajo, siempre visible. */}
                <div className="grid grid-cols-2 gap-3">
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
                </div>

                {/* Indicador de fortaleza ocupa el ancho completo debajo de la fila de contraseñas */}
                <PasswordStrengthIndicator password={formData.password} />

                {/* ¿Qué? Bloque de checkboxes de consentimiento legal obligatorio. */}
                {/* ¿Para qué? Obtener el consentimiento explícito del usuario antes de enviar el formulario, */}
                {/*            cumpliendo con la Ley 1581/2012 (datos personales), Ley 527/1999 y Ley 1480/2011. */}
                {/* ¿Impacto? El botón de crear cuenta permanece deshabilitado hasta que los tres estén marcados. */}
                <div className="mt-3 space-y-2">
                  {(["terms", "privacy", "cookies"] as const).map((key) => {
                    const i18nKeyMap = {
                      terms: { text: "auth.register.acceptTerms", to: "/terminos-de-uso" },
                      privacy: { text: "auth.register.acceptPrivacy", to: "/privacidad" },
                      cookies: { text: "auth.register.acceptCookies", to: "/cookies" },
                    } as const;
                    const { text, to } = i18nKeyMap[key];
                    return (
                      <div key={key}>
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            name={key}
                            checked={consents[key]}
                            onChange={handleConsentChange}
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-accent-600
                      focus:ring-2 focus:ring-accent-500 focus:ring-offset-0
                      dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-accent-500
                      cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                            <Trans
                              i18nKey={text}
                              components={{
                                link: (
                                  <Link
                                    to={to}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-accent-600 hover:text-accent-700
                              dark:text-accent-400 dark:hover:text-accent-300 underline"
                                  />
                                ),
                              }}
                            />
                          </span>
                        </label>
                        {errors[key] && (
                          <p className="mt-1 ml-6.5 text-xs text-red-600 dark:text-red-400">
                            {errors[key]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex justify-end">
                  <Button type="submit" fullWidth isLoading={isLoading} disabled={!isButtonEnabled}>
                    {t("auth.register.submit")}
                  </Button>
                </div>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {t("auth.register.haveAccount")}{" "}
                <Link
                  to="/login"
                  className="font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
                >
                  {t("auth.register.loginLink")}
                </Link>
              </p>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
