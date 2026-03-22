/**
 * Archivo: LandingPage.tsx
 * Descripción: Página de aterrizaje pública del sistema NN Auth.
 * ¿Para qué? Presentar el proyecto, sus características y guiar al usuario hacia el registro
 *            o el inicio de sesión con una experiencia visual clara y profesional.
 * ¿Impacto? Es la primera impresión del sistema — define la percepción de calidad y confianza.
 */

import { Link } from "react-router-dom";
import { ShieldCheck, KeyRound, Mail, RefreshCw, Lock, UserCheck, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// LOGO COMPONENT
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Logo SVG del sistema — dos letras N dentro de un badge cuadrado redondeado.
 * ¿Para qué? Identidad visual única sin depender de fuentes externas ni imágenes rasterizadas.
 * ¿Impacto? Es la marca del sistema. Aparece en header, hero y footer para reforzar identidad.
 */
interface NNAuthLogoProps {
  readonly size?: number;
}

export function NNAuthLogo({ size = 36 }: NNAuthLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Fondo: badge cuadrado con bordes redondeados y borde azul */}
      <rect
        x="1"
        y="1"
        width="34"
        height="34"
        rx="8"
        fill="#0f172a"
        stroke="#3b82f6"
        strokeWidth="1.5"
      />

      {/* Primera letra N (izquierda) — trazos en azul claro */}
      <polyline
        points="7,27 7,9 15,27 15,9"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Segunda letra N (derecha) — misma proporción, desplazada 12px */}
      <polyline
        points="21,27 21,9 29,27 29,9"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Lista de características del sistema para renderizar dinámicamente.
 * ¿Para qué? Centralizar el contenido en un solo lugar facilita agregar o quitar features.
 * ¿Impacto? Cambiar aquí actualiza automáticamente la sección de features en la UI.
 */
const features = [
  {
    icon: UserCheck,
    title: "Registro seguro",
    description:
      "Validación de datos en tiempo real. Las contraseñas se almacenan hasheadas con bcrypt — nunca en texto plano.",
  },
  {
    icon: KeyRound,
    title: "Autenticación JWT",
    description:
      "Access tokens de 15 min y refresh tokens de 7 días. Stateless, eficiente y estándar en la industria.",
  },
  {
    icon: Mail,
    title: "Verificación de email",
    description:
      "Confirma la identidad antes de activar la cuenta. Enlace de un solo uso enviado automáticamente al registro.",
  },
  {
    icon: Lock,
    title: "Cambio de contraseña",
    description:
      "El usuario autenticado puede cambiar su contraseña ingresando la actual. Validación estricta en el backend.",
  },
  {
    icon: RefreshCw,
    title: "Recuperación por email",
    description: "Flujo completo de forgot/reset con token de un solo uso y expiración de 1 hora.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad OWASP",
    description:
      "Diseñado con seguridad primero: sin SQL injection, sin XSS, CORS configurado e inputs validados con Pydantic.",
  },
] as const;

/**
 * ¿Qué? Pasos del flujo principal que el usuario verá en "¿Cómo funciona?".
 * ¿Para qué? Mostrar el recorrido de uso de forma visual y ordenada.
 * ¿Impacto? Ayuda al usuario a entender el sistema antes de registrarse.
 */
const steps = [
  {
    number: "01",
    title: "Crea tu cuenta",
    description:
      "Registra tu email y contraseña. Recibirás un correo para verificar y activar tu cuenta.",
  },
  {
    number: "02",
    title: "Inicia sesión",
    description:
      "Autentícate con tus credenciales. El sistema emitirá un access token y un refresh token.",
  },
  {
    number: "03",
    title: "Accede al sistema",
    description: "Con tu sesión activa, gestiona tu perfil y contraseña desde el dashboard.",
  },
] as const;

/**
 * ¿Qué? Tecnologías usadas en el proyecto para mostrar en la sección de stack.
 * ¿Para qué? Transparencia técnica y reconocimiento de las herramientas involucradas.
 * ¿Impacto? Establece credibilidad técnica ante el usuario.
 */
const techStack = [
  "Python 3.12",
  "FastAPI",
  "PostgreSQL 17",
  "SQLAlchemy",
  "Alembic",
  "Pydantic",
  "JWT",
  "bcrypt",
  "React 18",
  "TypeScript",
  "Vite 6",
  "TailwindCSS 4",
  "Docker",
  "pytest",
  "Vitest",
] as const;

// ─────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Componente de página para la ruta raíz "/".
 * ¿Para qué? Servir como punto de entrada público que presenta el sistema y dirige al usuario
 *            a registrarse o iniciar sesión, sin necesidad de autenticación previa.
 * ¿Impacto? Primera impresión del sistema — define confianza, claridad y propuesta de valor.
 */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* ══════════════════════════════════════════════════════
          HEADER — navegación sticky con logo y acciones
          ══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
          aria-label="Navegación principal"
        >
          {/* Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
            aria-label="NN Auth System — ir al inicio"
          >
            <NNAuthLogo size={32} />
            <span className="text-lg font-semibold tracking-tight text-gray-100">
              NN <span className="text-blue-500">Auth</span> System
            </span>
          </Link>

          {/* Acciones */}
          <ul className="m-0 flex list-none items-center gap-2 p-0">
            <li>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-800 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Registrarse
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* ══════════════════════════════════════════════════════
            HERO — propuesta de valor principal
            ══════════════════════════════════════════════════════ */}
        <section
          className="border-b border-gray-800 px-6 py-28 text-center"
          aria-labelledby="hero-heading"
        >
          <div className="mx-auto max-w-3xl">
            {/* Logo grande en el hero */}
            <div className="mb-8 flex justify-center" aria-hidden="true">
              <NNAuthLogo size={72} />
            </div>

            <h1 id="hero-heading" className="mb-5 text-5xl font-bold tracking-tight text-gray-100">
              Autenticación segura, <span className="text-blue-500">lista para producción</span>
            </h1>

            <p className="mb-10 text-xl leading-relaxed text-gray-400">
              Registro, login, verificación de email, cambio y recuperación de contraseña. Un
              sistema completo construido con FastAPI, React y las mejores prácticas de seguridad.
            </p>

            {/* ¿Por qué justify-center? Los botones CTA en el hero son el punto focal,
                centrarlos maximiza la visibilidad y el ratio de conversión. */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Comenzar ahora
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-7 py-3 text-base font-medium text-gray-300 transition-colors duration-200 hover:border-gray-500 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FEATURES — tarjetas de características del sistema
            ══════════════════════════════════════════════════════ */}
        <section className="border-b border-gray-800 px-6 py-20" aria-labelledby="features-heading">
          <div className="mx-auto max-w-6xl">
            <header className="mb-12 text-center">
              <h2 id="features-heading" className="text-3xl font-bold text-gray-100">
                Características del sistema
              </h2>
              <p className="mt-3 text-gray-400">
                Todo lo necesario para un sistema de autenticación robusto y educativo.
              </p>
            </header>

            {/* Grid con 6 tarjetas — 1 col mobile, 2 tablet, 3 desktop */}
            <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li key={feature.title}>
                    <article className="h-full rounded-xl border border-gray-800 bg-gray-900 p-6 transition-colors duration-200 hover:border-gray-700">
                      {/* Ícono con fondo sutil */}
                      <div
                        className="mb-4 inline-flex rounded-lg bg-gray-800 p-3"
                        aria-hidden="true"
                      >
                        <Icon size={22} className="text-blue-500" />
                      </div>
                      <h3 className="mb-2 text-base font-semibold text-gray-100">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            HOW IT WORKS — flujo en 3 pasos
            ══════════════════════════════════════════════════════ */}
        <section className="border-b border-gray-800 px-6 py-20" aria-labelledby="how-heading">
          <div className="mx-auto max-w-6xl">
            <header className="mb-14 text-center">
              <h2 id="how-heading" className="text-3xl font-bold text-gray-100">
                ¿Cómo funciona?
              </h2>
              <p className="mt-3 text-gray-400">Tres pasos para empezar a usar el sistema.</p>
            </header>

            <ol className="m-0 grid list-none grid-cols-1 gap-10 p-0 sm:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.number} className="relative">
                  {/* Línea conectora entre pasos (solo visible en desktop, entre items) */}
                  {index < steps.length - 1 && (
                    <div
                      className="absolute top-7 left-full hidden h-px w-full -translate-x-5 bg-gray-800 sm:block"
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex flex-col items-center text-center">
                    {/* Número del paso con estilo de badge */}
                    <div
                      className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-blue-800 bg-blue-950 text-xl font-bold text-blue-400"
                      aria-hidden="true"
                    >
                      {step.number}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-100">{step.title}</h3>
                    <p className="max-w-xs text-sm leading-relaxed text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            TECH STACK — badges de tecnologías
            ══════════════════════════════════════════════════════ */}
        <section className="border-b border-gray-800 px-6 py-20" aria-labelledby="stack-heading">
          <div className="mx-auto max-w-4xl text-center">
            <h2 id="stack-heading" className="mb-3 text-3xl font-bold text-gray-100">
              Stack tecnológico
            </h2>
            <p className="mb-10 text-gray-400">
              Herramientas modernas, tipadas y probadas en la industria.
            </p>

            <ul
              className="m-0 flex list-none flex-wrap justify-center gap-3 p-0"
              aria-label="Tecnologías del proyecto"
            >
              {techStack.map((tech) => (
                <li key={tech}>
                  <span className="rounded-full border border-gray-700 bg-gray-900 px-4 py-1.5 text-sm text-gray-300">
                    {tech}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CTA FINAL — llamada a la acción de cierre
            ══════════════════════════════════════════════════════ */}
        <section className="px-6 py-28 text-center" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-2xl">
            <h2 id="cta-heading" className="mb-5 text-4xl font-bold text-gray-100">
              Listo para comenzar
            </h2>
            <p className="mb-10 text-lg text-gray-400">
              Crea tu cuenta y explora el sistema de autenticación completo. Aprende implementando.
            </p>

            <div className="flex justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Crear cuenta gratis
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════
          FOOTER — información del proyecto
          ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5">
          {/* Fila superior: logo + nombre y crédito */}
          <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3" aria-label="NN Auth System">
              <NNAuthLogo size={24} />
              <span className="text-sm text-gray-500">NN Auth System</span>
            </div>
            <p className="text-sm text-gray-600">
              Proyecto educativo — SENA &middot; {new Date().getFullYear()}
            </p>
          </div>

          {/* Fila inferior: enlaces legales */}
          <nav aria-label="Aviso legal" className="w-full border-t border-gray-800 pt-4">
            <ul className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-2 p-0">
              <li>
                <Link
                  to="/terminos-de-uso"
                  className="text-xs text-gray-600 transition-colors hover:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidad"
                  className="text-xs text-gray-600 transition-colors hover:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-xs text-gray-600 transition-colors hover:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="text-xs text-gray-600 transition-colors hover:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
