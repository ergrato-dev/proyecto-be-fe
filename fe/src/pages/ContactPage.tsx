/**
 * Archivo: ContactPage.tsx
 * Descripción: Formulario de contacto público del NN Auth System.
 * ¿Para qué? Proveer un canal formal para consultas, soporte técnico y ejercicio de
 *            derechos sobre datos personales (Ley 1581/2012, Art. 8), sin exponer
 *            correos reales en el frontend.
 * ¿Impacto? Sin canal de contacto, el operador no podría cumplir con los plazos de
 *           respuesta exigidos por la Ley 1581/2012: 10 días hábiles para consultas
 *           y 15 días hábiles para reclamos (Arts. 14–15).
 *
 * ⚠️ AVISO EDUCATIVO — PROYECTO SENA:
 *   Este formulario es DEMOSTRATIVO. No envía datos a ningún servidor real.
 *   Los correos de contacto son FICTICIOS (empresa NN S.A.S. no existe).
 *   NUNCA colocar correos reales de personas en el código fuente.
 *
 * Marco normativo de referencia:
 *   - Ley 1581/2012  — Derecho del titular a presentar consultas y reclamos (Arts. 14–15).
 *   - Decreto 1377/2013 — Obligación del responsable de disponer canales de atención.
 *   - Ley 1480/2011  — Derecho del consumidor a recibir atención y respuesta.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, User, Send, CheckCircle, AlertCircle } from "lucide-react";
import { NNAuthLogo } from "@/pages/LandingPage";

// ─────────────────────────────────────────────────────────────
// CONSTANTES — correos ficticios del proyecto educativo
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Información de contacto FICTICIA usada exclusivamente en entornos educativos.
 * ¿Para qué? Demostrar el patrón de cómo se expone la información de contacto sin
 *            comprometer datos reales de personas o empresas.
 * ¿Impacto? NUNCA deben ser correos reales. Si este proyecto se desplegara en producción,
 *           estos valores deben venir de variables de entorno, nunca hardcodeados.
 */
const CONTACT_INFO = {
  emailGeneral: "contacto@nn-company.co",
  emailDatosPersonales: "datospersonales@nn-company.co",
  emailSoporte: "soporte@nn-company.co",
  telefono: "(+57) 601 000 0000",
  direccion: "Bogotá D.C., Colombia",
  horario: "Lunes a viernes, 8:00 am – 5:00 pm (hora Colombia)",
} as const;

/** Opciones del selector de asunto — mapeo valor → etiqueta legible. */
const SUBJECT_OPTIONS = [
  { value: "", label: "— Selecciona un asunto —" },
  { value: "consulta-general", label: "Consulta general" },
  { value: "soporte-tecnico", label: "Soporte técnico" },
  { value: "derechos-datos", label: "Ejercer derechos (Ley 1581/2012 — Habeas Data)" },
  { value: "sistema-autenticacion", label: "Sistema de autenticación" },
  { value: "bugs-errores", label: "Reporte de bugs o errores" },
  { value: "otro", label: "Otro" },
] as const;

// ─────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────

interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
  readonly acceptsPrivacy: boolean;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  acceptsPrivacy?: string;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/** Regex RFC 5322 simplificado — valida formato básico de email. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ¿Qué? Función que valida todos los campos del formulario de contacto.
 * ¿Para qué? Detectar errores antes de "enviar" y mostrarlos al usuario con
 *            mensajes descriptivos en español.
 * ¿Impacto? Validación en el cliente previene envíos incompletos y mejora la UX.
 *           No reemplaza la validación del servidor en una implementación real.
 */
function validateForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (data.name.trim().length < 3) {
    errors.name = "El nombre debe tener al menos 3 caracteres.";
  }
  if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Ingresa una dirección de correo electrónico válida.";
  }
  if (!data.subject) {
    errors.subject = "Selecciona un asunto para tu mensaje.";
  }
  if (data.message.trim().length < 20) {
    errors.message = "El mensaje debe tener al menos 20 caracteres.";
  }
  if (!data.acceptsPrivacy) {
    errors.acceptsPrivacy = "Debes aceptar la Política de Privacidad para continuar.";
  }

  return errors;
}

// ─────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  acceptsPrivacy: false,
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Calcula las clases CSS de un campo input/textarea según si tiene error.
 * ¿Para qué? Centralizar el patrón de clases para no repetirlo en cada campo.
 * ¿Impacto? Si el diseño de los inputs cambia, basta con editar esta función.
 */
function fieldInputCls(error?: string): string {
  const base =
    "w-full rounded-lg border bg-gray-900 px-4 py-2.5 text-sm text-gray-100 " +
    "placeholder-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 " +
    "disabled:cursor-not-allowed disabled:opacity-50 ";
  return error
    ? base + "border-red-700 focus:ring-red-500/30"
    : base + "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20";
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENT — panel de confirmación de envío exitoso
// ─────────────────────────────────────────────────────────────

interface ContactSuccessPanelProps {
  readonly onReset: () => void;
}

/**
 * ¿Qué? Panel verde que reemplaza el formulario tras un envío simulado exitoso.
 * ¿Para qué? Proveer feedback claro al usuario de que su mensaje fue "enviado".
 * ¿Impacto? Extraído de ContactPage para reducir la complejidad cognitiva del componente.
 */
function ContactSuccessPanel({ onReset }: ContactSuccessPanelProps) {
  return (
    <div
      className="flex flex-col items-center gap-4 rounded-xl border border-green-800 bg-green-950/40 px-8 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <CheckCircle size={48} className="text-green-500" aria-hidden="true" />
      <div>
        <p className="text-lg font-semibold text-green-300">Mensaje enviado correctamente</p>
        <p className="mt-2 text-sm text-green-500">
          (Simulación — no se envió ningún correo real.)
          <br />
          En producción, responderíamos en un plazo máximo de <strong>10 días hábiles</strong> para
          consultas o <strong>15 días hábiles</strong> para reclamos, conforme a la Ley 1581 de
          2012.
        </p>
      </div>
      <button
        onClick={onReset}
        className="mt-2 rounded-lg border border-green-700 px-4 py-2 text-sm text-green-400 transition-colors hover:bg-green-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      >
        Enviar otro mensaje
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENT — campos del formulario de contacto
// ─────────────────────────────────────────────────────────────

interface ContactFormFieldsProps {
  readonly formData: ContactFormData;
  readonly errors: ContactFormErrors;
  readonly isSubmitting: boolean;
  readonly submitResult: "success" | "error" | null;
  readonly onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  readonly onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onSubmit: (e: React.SyntheticEvent) => void;
}

/**
 * ¿Qué? Renderiza los cinco campos del formulario de contacto y el botón de envío.
 * ¿Para qué? Encapsular toda la lógica de renderizado de campos para reducir la
 *            complejidad cognitiva de ContactPage.
 * ¿Impacto? Si se añaden campos o cambia la validación visual, se edita solo aquí.
 */
function ContactFormFields({
  formData,
  errors,
  isSubmitting,
  submitResult,
  onChange,
  onCheckboxChange,
  onSubmit,
}: ContactFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} noValidate aria-label="Formulario de contacto">
      {/* Mensaje de error general del envío */}
      {submitResult === "error" && (
        <div
          className="mb-5 flex items-start gap-3 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          Hubo un error al procesar tu mensaje. Por favor intenta de nuevo.
        </div>
      )}

      {/* Campo: Nombre completo */}
      <div className="mb-5">
        <label
          htmlFor="contact-name"
          className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-300"
        >
          <User size={14} aria-hidden="true" />
          Nombre completo
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={onChange}
          placeholder="Ej. Ana García"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "error-name" : undefined}
          disabled={isSubmitting}
          className={fieldInputCls(errors.name)}
        />
        {errors.name && (
          <p id="error-name" className="mt-1.5 text-xs text-red-400" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Campo: Correo electrónico */}
      <div className="mb-5">
        <label
          htmlFor="contact-email"
          className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-300"
        >
          <Mail size={14} aria-hidden="true" />
          Correo electrónico de respuesta
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="tu-correo@ejemplo.com"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "error-email" : "hint-email"}
          disabled={isSubmitting}
          className={fieldInputCls(errors.email)}
        />
        <p id="hint-email" className="mt-1 text-xs text-gray-600">
          Usaremos este correo únicamente para responderte. No envíes datos sensibles.
        </p>
        {errors.email && (
          <p id="error-email" className="mt-1.5 text-xs text-red-400" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Campo: Asunto (select) */}
      <div className="mb-5">
        <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-gray-300">
          Asunto{" "}<span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <select
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={onChange}
          required
          aria-required="true"
          aria-invalid={errors.subject ? "true" : "false"}
          aria-describedby={errors.subject ? "error-subject" : undefined}
          disabled={isSubmitting}
          className={`${fieldInputCls(errors.subject)} ${formData.subject ? "text-gray-100" : "text-gray-600"}`}
        >
          {SUBJECT_OPTIONS.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.value === ""}
              className="bg-gray-900 text-gray-100"
            >
              {opt.label}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p id="error-subject" className="mt-1.5 text-xs text-red-400" role="alert">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Campo: Mensaje (textarea) */}
      <div className="mb-5">
        <label
          htmlFor="contact-message"
          className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-300"
        >
          <MessageSquare size={14} aria-hidden="true" />
          Mensaje
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={onChange}
          rows={5}
          placeholder="Describe detalladamente tu consulta, reporte o solicitud..."
          required
          aria-required="true"
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "error-message" : "hint-message"}
          disabled={isSubmitting}
          className={`resize-y ${fieldInputCls(errors.message)}`}
        />
        {/* Contador de caracteres — feedback visual del mínimo requerido */}
        <p
          id="hint-message"
          className={`mt-1 text-xs ${
            formData.message.trim().length < 20 && formData.message.length > 0
              ? "text-amber-500"
              : "text-gray-600"
          }`}
          aria-live="polite"
        >
          {formData.message.trim().length} / 20 caracteres mínimos
        </p>
        {errors.message && (
          <p id="error-message" className="mt-1.5 text-xs text-red-400" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Campo: Aceptar Política de Privacidad (checkbox obligatorio) */}
      {/* ¿Qué? Autorización expresa del titular conforme a Ley 1581/2012 Art. 9. */}
      {/* ¿Para qué? Recolectar nombre y email implica tratar datos personales — */}
      {/*           se requiere consentimiento previo e informado. */}
      {/* ¿Impacto? Sin este checkbox, el formulario violaría el principio de */}
      {/*           autorización (Art. 4.c, Ley 1581/2012). */}
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <input
            id="contact-privacy"
            name="acceptsPrivacy"
            type="checkbox"
            checked={formData.acceptsPrivacy}
            onChange={onCheckboxChange}
            required
            aria-required="true"
            aria-invalid={errors.acceptsPrivacy ? "true" : "false"}
            aria-describedby={errors.acceptsPrivacy ? "error-privacy" : undefined}
            disabled={isSubmitting}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-600 bg-gray-900 text-blue-600 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <label htmlFor="contact-privacy" className="cursor-pointer text-sm text-gray-400">
            He leído y acepto la{" "}
            <Link
              to="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Política de Privacidad y Tratamiento de Datos Personales
            </Link>{" "}
            (Ley 1581 de 2012). Autorizo que mis datos sean utilizados únicamente para responder mi
            solicitud.
          </label>
        </div>
        {errors.acceptsPrivacy && (
          <p id="error-privacy" className="mt-1.5 pl-7 text-xs text-red-400" role="alert">
            {errors.acceptsPrivacy}
          </p>
        )}
      </div>

      {/* ¿Qué? Botón de envío alineado a la derecha — regla de diseño del proyecto. */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          aria-label={isSubmitting ? "Enviando mensaje..." : "Enviar mensaje"}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Enviando...
            </>
          ) : (
            <>
              <Send size={15} aria-hidden="true" />
              Enviar mensaje
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Página de formulario de contacto público.
 * ¿Para qué? Recibir consultas, reportes y solicitudes de ejercicio de derechos de datos.
 *            En una implementación real, enviaría un correo al equipo a través de un
 *            servicio backend (ej. FastAPI + fastapi-mail). En este contexto educativo,
 *            simula el envío con un estado de éxito después de 1.5 segundos.
 * ¿Impacto? Provee el canal de atención exigido por Ley 1581/2012 Art. 15
 *           (reclamos) y Decreto 1377/2013 Art. 13 (información del responsable).
 */
export function ContactPage() {
  // ¿Qué? Estado del formulario — un objeto con todos los campos.
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  // ¿Qué? Errores de validación por campo.
  const [errors, setErrors] = useState<ContactFormErrors>({});
  // ¿Qué? Flag de carga — activo mientras se simula el envío.
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ¿Qué? Estado del resultado del envío: null = sin intentar, success / error.
  const [submitResult, setSubmitResult] = useState<"success" | "error" | null>(null);

  /**
   * ¿Qué? Actualiza un campo de texto o email en el estado del formulario.
   * ¿Para qué? Patrón controlled component — React controla el valor de cada input.
   * ¿Impacto? Al escribir se limpia el error del campo correspondiente para dar feedback
   *           inmediato de que el usuario está corrigiendo el problema.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar el error del campo que el usuario está editando
    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * ¿Qué? Actualiza el campo booleano del checkbox de privacidad.
   * ¿Para qué? El checkbox necesita manejar `checked` en lugar de `value`.
   * ¿Impacto? Si el usuario marca el checkbox, se limpia el error de privacidad.
   */
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, acceptsPrivacy: e.target.checked }));
    if (errors.acceptsPrivacy) {
      setErrors((prev) => ({ ...prev, acceptsPrivacy: undefined }));
    }
  };

  /**
   * ¿Qué? Maneja el envío del formulario: valida → simula envío → muestra resultado.
   * ¿Para qué? En producción, aquí se haría un fetch/axios a POST /api/v1/contact.
   *            En este proyecto educativo, simula la operación con un setTimeout.
   * ¿Impacto? Si la validación falla, se muestran todos los errores y el foco va
   *           al primer campo inválido (accesibilidad WCAG 3.3.1 Error Identification).
   */
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    // Validar todos los campos
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Desplazar al primer error visible
      const firstErrorField = document.querySelector<HTMLElement>("[aria-invalid='true']");
      firstErrorField?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      /**
       * ¿Qué? Simulación del envío — en producción sería:
       *   await axios.post('/api/v1/contact', formData);
       * ¿Para qué? Demostrar el patrón async con loading state y manejo de resultado.
       * ¿Impacto? El usuario ve el spinner, luego el mensaje de éxito — UX completa.
       */
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitResult("success");
      setFormData(INITIAL_FORM);
      setErrors({});
    } catch {
      // En producción, el catch manejaría errores de red (500, timeout, etc.)
      setSubmitResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* ══════════════════════════════════════════════════════
          HEADER — navegación de retorno y wordmark
          ══════════════════════════════════════════════════════ */}
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          {/* Logo / wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="NN Auth System — volver al inicio"
          >
            <NNAuthLogo size={28} />
            <span className="text-sm font-semibold tracking-tight text-gray-300">
              NN <span className="text-blue-500">Auth</span> System
            </span>
          </Link>

          {/* Botón de retorno */}
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors duration-200 hover:bg-gray-800 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-5xl px-6 py-14">
          {/* ══════════════════════════════════════════════════════
              TÍTULO DE LA PÁGINA
              ══════════════════════════════════════════════════════ */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-gray-100">
              Formulario de Contacto
            </h1>
            <p className="mt-2 text-gray-500">
              Envíanos tu consulta, reporte o solicitud. Respondemos en los plazos establecidos por
              la Ley 1581 de 2012.
            </p>
          </div>
          {/* ══════════════════════════════════════════════════════
              AVISO EDUCATIVO — visible y prominente
              ══════════════════════════════════════════════════════ */}
          <div
            className="mb-10 flex gap-3 rounded-xl border border-amber-800 bg-amber-950/40 px-5 py-4"
            role="note"
            aria-label="Aviso educativo"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
            <div className="text-sm text-amber-300">
              <p className="font-semibold">Proyecto educativo — SENA</p>
              <p className="mt-1 text-amber-400">
                Este formulario es <strong>demostrativo</strong>. Los mensajes{" "}
                <strong>no se envían a ningún servidor real</strong> y los datos que ingreses{" "}
                <strong>no se almacenan</strong>. Los correos de contacto son ficticios. En una
                implementación real, el formulario enviaría los datos a{" "}
                <code className="rounded bg-amber-900/50 px-1 font-mono text-xs">
                  POST /api/v1/contact
                </code>{" "}
                en el backend.
              </p>
            </div>
          </div>{" "}
          {/* ══════════════════════════════════════════════════════
              GRID — formulario (izquierda) + info de contacto (derecha)
              ══════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* ── FORMULARIO ──────────────────────────────────── */}
            <section className="lg:col-span-2" aria-labelledby="form-heading">
              <h2 id="form-heading" className="mb-6 text-lg font-semibold text-gray-100">
                Enviar mensaje
              </h2>

              {/* Condicional: panel de éxito vs. formulario */}
              {submitResult === "success" ? (
                <ContactSuccessPanel onReset={() => setSubmitResult(null)} />
              ) : (
                <ContactFormFields
                  formData={formData}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  submitResult={submitResult}
                  onChange={handleChange}
                  onCheckboxChange={handleCheckboxChange}
                  onSubmit={handleSubmit}
                />
              )}
            </section>

            {/* ── INFORMACIÓN DE CONTACTO ──────────────────────── */}
            <aside className="space-y-6" aria-labelledby="contact-info-heading">
              <h2 id="contact-info-heading" className="text-lg font-semibold text-gray-100">
                Información de contacto
              </h2>

              {/* Aviso: correos ficticios */}
              <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-4 text-xs text-gray-500">
                <p className="font-semibold text-gray-400">⚠️ Correos ficticios</p>
                <p className="mt-1">
                  Los siguientes correos corresponden a una empresa educativa ficticia. No envíes
                  mensajes reales a estas direcciones.
                </p>
              </div>

              {/* Tarjetas de contacto */}
              <div className="space-y-4">
                <ContactInfoCard
                  icon={<Mail size={16} aria-hidden="true" />}
                  label="Consultas generales"
                  value={CONTACT_INFO.emailGeneral}
                  isEmail
                />
                <ContactInfoCard
                  icon={<Mail size={16} aria-hidden="true" />}
                  label="Datos personales (Ley 1581)"
                  value={CONTACT_INFO.emailDatosPersonales}
                  isEmail
                />
                <ContactInfoCard
                  icon={<Mail size={16} aria-hidden="true" />}
                  label="Soporte técnico"
                  value={CONTACT_INFO.emailSoporte}
                  isEmail
                />
              </div>

              {/* Información adicional */}
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Teléfono
                  </dt>
                  <dd className="mt-1 text-gray-400">{CONTACT_INFO.telefono}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Domicilio
                  </dt>
                  <dd className="mt-1 text-gray-400">{CONTACT_INFO.direccion}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Horario de atención
                  </dt>
                  <dd className="mt-1 text-gray-400">{CONTACT_INFO.horario}</dd>
                </div>
              </dl>

              {/* Plazos de respuesta — referencia legal */}
              <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Plazos de respuesta (Ley 1581/2012)
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-gray-400">
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span>
                      <strong className="text-gray-300">Consultas:</strong> 10 días hábiles (Art.
                      14, Ley 1581/2012)
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span>
                      <strong className="text-gray-300">Reclamos:</strong> 15 días hábiles (Art. 15,
                      Ley 1581/2012)
                    </span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════
          FOOTER — crédito mínimo
          ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-gray-800 px-6 py-6">
        <p className="text-center text-xs text-gray-600">
          NN Auth System — Proyecto educativo SENA &middot;{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENT — tarjeta de información de contacto
// ─────────────────────────────────────────────────────────────

interface ContactInfoCardProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: string;
  readonly isEmail?: boolean;
}

/**
 * ¿Qué? Tarjeta de una información de contacto (correo ficticio, teléfono, etc.).
 * ¿Para qué? Reutilizar el diseño visual de cada fila de contacto sin repetir clases.
 * ¿Impacto? Si cambia el diseño de las tarjetas de contacto, basta con editar aquí.
 */
function ContactInfoCard({ icon, label, value, isEmail = false }: ContactInfoCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-900 p-3">
      <div className="mt-0.5 shrink-0 text-blue-500">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        {isEmail ? (
          // ¿Qué? href="mailto:" muestra el cliente de correo, pero el correo es ficticio.
          // ¿Para qué? Patrón correcto de marcado semántico para emails.
          // ¿Impacto? En producción, se reemplazaría por un correo real gestionado por el equipo.
          <a
            href={`mailto:${value}`}
            className="mt-0.5 block truncate text-sm text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            aria-label={`Correo ficticio: ${value}`}
          >
            {value}
          </a>
        ) : (
          <p className="mt-0.5 text-sm text-gray-300">{value}</p>
        )}
      </div>
    </div>
  );
}
