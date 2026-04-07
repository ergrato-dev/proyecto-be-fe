/**
 * Archivo: LandingPage.tsx
 * Descripción: Página de aterrizaje pública del sistema NN Auth.
 * ¿Para qué? Presentar el proyecto, sus características y guiar al usuario hacia el registro
 *            o el inicio de sesión con una experiencia visual clara y profesional.
 * ¿Impacto? Es la primera impresión del sistema — define la percepción de calidad y confianza.
 */

import { Link } from "react-router-dom";
import { ShieldCheck, KeyRound, Mail, RefreshCw, Lock, UserCheck, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
        stroke="#059669"
        strokeWidth="1.5"
      />

      {/* Primera letra N (izquierda) — trazos en azul claro */}
      <polyline
        points="7,27 7,9 15,27 15,9"
        fill="none"
        stroke="#34d399"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Segunda letra N (derecha) — misma proporción, desplazada 12px */}
      <polyline
        points="21,27 21,9 29,27 29,9"
        fill="none"
        stroke="#34d399"
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
 * ¿Qué? Iconos y claves de traducción para las características del sistema.
 * ¿Para qué? Separar la estructura de datos del texto traducido — el texto se resuelve en runtime.
 * ¿Impacto? Al cambiar de idioma, los textos se actualizan automáticamente sin recargar.
 */
const featureIcons = [UserCheck, KeyRound, Mail, Lock, RefreshCw, ShieldCheck] as const;
const featureKeys = ["register", "jwt", "email", "password", "recovery", "security"] as const;

/**
 * ¿Qué? Números y claves de traducción para los pasos del flujo principal.
 * ¿Para qué? Igual que featureIcons — estructura sin texto hardcodeado.
 * ¿Impacto? El texto de "¿Cómo funciona?" cambia de idioma sin necesidad de duplicar arrays.
 */
const stepNumbers = ["01", "02", "03"] as const;
const stepKeys = ["step1", "step2", "step3"] as const;

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
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* ══════════════════════════════════════════════════════
          HEADER — navegación sticky con logo y acciones
          ══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
          aria-label="Navegación principal"
        >
          {/* Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-lg"
            aria-label="NN Auth System — ir al inicio"
          >
            <NNAuthLogo size={32} />
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              NN <span className="text-accent-500">Auth</span> System
            </span>
          </Link>

          {/* Acciones */}
          <ul className="m-0 flex list-none items-center gap-2 p-0">
            <li>
              <LanguageSwitcher />
            </li>
            <li>
              <ThemeToggle />
            </li>
            <li>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                {t("landing.nav.login")}
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                {t("landing.nav.register")}
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
          className="border-b border-gray-200 px-6 py-28 text-center dark:border-gray-800"
          aria-labelledby="hero-heading"
        >
          <div className="mx-auto max-w-3xl">
            {/* Logo grande en el hero */}
            <div className="mb-8 flex justify-center" aria-hidden="true">
              <NNAuthLogo size={72} />
            </div>

            <h1
              id="hero-heading"
              className="mb-5 text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
            >
              {t("landing.hero.title")}{" "}
              <span className="text-accent-500">{t("landing.hero.titleHighlight")}</span>
            </h1>

            <p className="mb-10 text-xl leading-relaxed text-gray-600 dark:text-gray-400">
              {t("landing.hero.subtitle")}
            </p>

            {/* ¿Por qué justify-center? Los botones CTA en el hero son el punto focal,
                centrarlos maximiza la visibilidad y el ratio de conversión. */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-7 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                {t("landing.hero.ctaPrimary")}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-7 py-3 text-base font-medium text-gray-700 transition-colors duration-200 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
              >
                {t("landing.hero.ctaSecondary")}
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FEATURES — tarjetas de características del sistema
            ══════════════════════════════════════════════════════ */}
        <section
          className="border-b border-gray-200 px-6 py-20 dark:border-gray-800"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-6xl">
            <header className="mb-12 text-center">
              <h2
                id="features-heading"
                className="text-3xl font-bold text-gray-900 dark:text-gray-100"
              >
                {t("landing.features.title")}
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                {t("landing.features.subtitle")}
              </p>
            </header>

            {/* Grid con 6 tarjetas — 1 col mobile, 2 tablet, 3 desktop */}
            <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {featureKeys.map((key, i) => {
                const Icon = featureIcons[i];
                return (
                  <li key={key}>
                    <article className="h-full rounded-xl border border-gray-200 bg-gray-50 p-6 transition-colors duration-200 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
                      {/* Ícono con fondo sutil */}
                      <div
                        className="mb-4 inline-flex rounded-lg bg-gray-100 p-3 dark:bg-gray-800"
                        aria-hidden="true"
                      >
                        <Icon size={22} className="text-accent-500" />
                      </div>
                      <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                        {t(`landing.features.${key}.title`)}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {t(`landing.features.${key}.description`)}
                      </p>
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
        <section
          className="border-b border-gray-200 px-6 py-20 dark:border-gray-800"
          aria-labelledby="how-heading"
        >
          <div className="mx-auto max-w-6xl">
            <header className="mb-14 text-center">
              <h2 id="how-heading" className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {t("landing.howItWorks.title")}
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                {t("landing.howItWorks.subtitle")}
              </p>
            </header>

            <ol className="m-0 grid list-none grid-cols-1 gap-10 p-0 sm:grid-cols-3">
              {stepKeys.map((key, index) => (
                <li key={stepNumbers[index]} className="relative">
                  {/* Línea conectora entre pasos (solo visible en desktop, entre items) */}
                  {index < stepKeys.length - 1 && (
                    <div
                      className="absolute top-7 left-full hidden h-px w-full -translate-x-5 bg-gray-200 dark:bg-gray-800 sm:block"
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex flex-col items-center text-center">
                    {/* Número del paso con estilo de badge */}
                    <div
                      className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-accent-300 bg-accent-50 text-xl font-bold text-accent-600 dark:border-accent-800 dark:bg-accent-950 dark:text-accent-400"
                      aria-hidden="true"
                    >
                      {stepNumbers[index]}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {t(`landing.howItWorks.${key}.title`)}
                    </h3>
                    <p className="max-w-xs text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {t(`landing.howItWorks.${key}.description`)}
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
        <section
          className="border-b border-gray-200 px-6 py-20 dark:border-gray-800"
          aria-labelledby="stack-heading"
        >
          <div className="mx-auto max-w-4xl text-center">
            <h2
              id="stack-heading"
              className="mb-3 text-3xl font-bold text-gray-900 dark:text-gray-100"
            >
              {t("landing.techStack.title")}
            </h2>
            <p className="mb-10 text-gray-600 dark:text-gray-400">
              {t("landing.techStack.subtitle")}
            </p>

            <ul
              className="m-0 flex list-none flex-wrap justify-center gap-3 p-0"
              aria-label={t("landing.techStack.ariaLabel")}
            >
              {techStack.map((tech) => (
                <li key={tech}>
                  <span className="rounded-full border border-gray-300 bg-gray-100 px-4 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
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
            <h2
              id="cta-heading"
              className="mb-5 text-4xl font-bold text-gray-900 dark:text-gray-100"
            >
              {t("landing.cta.title")}
            </h2>
            <p className="mb-10 text-lg text-gray-600 dark:text-gray-400">
              {t("landing.cta.subtitle")}
            </p>

            <div className="flex justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-8 py-3.5 text-base font-medium text-white transition-colors duration-200 hover:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                {t("landing.cta.button")}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════
          FOOTER — información del proyecto
          ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-gray-200 px-6 py-8 dark:border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5">
          {/* Fila superior: logo + nombre y crédito */}
          <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3" aria-label="NN Auth System">
              <NNAuthLogo size={24} />
              <span className="text-sm text-gray-500">NN Auth System</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-600">
              {t("landing.footer.credit")} &middot; {new Date().getFullYear()}
            </p>
          </div>

          {/* Fila inferior: enlaces legales */}
          <nav
            aria-label="Aviso legal"
            className="w-full border-t border-gray-200 pt-4 dark:border-gray-800"
          >
            <ul className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-2 p-0">
              <li>
                <Link
                  to="/terminos-de-uso"
                  className="rounded text-xs text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  {t("landing.footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidad"
                  className="rounded text-xs text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  {t("landing.footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="rounded text-xs text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  {t("landing.footer.cookies")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="rounded text-xs text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  {t("landing.footer.contact")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
