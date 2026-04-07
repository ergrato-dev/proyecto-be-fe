/**
 * Archivo: LegalLayout.tsx
 * Descripción: Componente de layout reutilizable para las páginas de contenido legal.
 * ¿Para qué? Proveer una estructura visual consistente (encabezado, navegación de regreso,
 *            tipografía) a las tres páginas legales sin duplicar código.
 * ¿Impacto? Si se modifica el diseño de las páginas legales, basta con editar este archivo
 *           y el cambio se refleja en todas las páginas que lo usen.
 */

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NNAuthLogo } from "@/pages/LandingPage";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface LegalLayoutProps {
  /** Título principal del documento legal (h1). */
  readonly title: string;
  /** Fecha de última actualización mostrada debajo del título. */
  readonly lastUpdated: string;
  /** Versión del documento (ej. "1.0"). */
  readonly version: string;
  /** Contenido de la página — secciones del documento legal. */
  readonly children: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Componente de layout para páginas legales: encabezado, logo, navegación de retorno
 *       y contenedor tipográfico normalizado para el contenido.
 * ¿Para qué? Unificar la apariencia de las tres páginas legales (Términos de Uso,
 *            Privacidad y Cookies) y centralizar los estilos comunes.
 * ¿Impacto? Cambios de diseño en el wrapper legal solo requieren editar este componente.
 */
export function LegalLayout({ title, lastUpdated, version, children }: LegalLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* ══════════════════════════════════════════════════════
          HEADER — navegación de retorno y wordmark
          ══════════════════════════════════════════════════════ */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          {/* Logo / wordmark — enlace al inicio */}
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            aria-label="NN Auth System — volver al inicio"
          >
            <NNAuthLogo size={28} />
            <span className="text-sm font-semibold tracking-tight text-gray-700 dark:text-gray-300">
              NN <span className="text-accent-500">Auth</span> System
            </span>
          </Link>

          {/* Botón de retorno a la página principal + selector de idioma + toggle de tema */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              {t("legal.backToHome")}
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          MAIN — contenido del documento legal
          ══════════════════════════════════════════════════════ */}
      <main>
        <article className="mx-auto max-w-4xl px-6 py-14" aria-labelledby="legal-title">
          {/* Metadatos del documento */}
          <header className="mb-10 border-b border-gray-200 pb-8 dark:border-gray-800">
            <h1
              id="legal-title"
              className="mb-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
            >
              {title}
            </h1>
            <p className="text-sm text-gray-500">
              Última actualización: <time dateTime={lastUpdated}>{lastUpdated}</time> · Versión{" "}
              {version}
            </p>
          </header>

          {/* Cuerpo del documento legal */}
          <div className="space-y-10">{children}</div>
        </article>
      </main>

      {/* ══════════════════════════════════════════════════════
          FOOTER — nav entre páginas legales + crédito
          ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-gray-200 px-6 py-5 dark:border-gray-800">
        {/* ¿Qué? Navegación entre las páginas legales y la de contacto.
            ¿Para qué? Evitar que el usuario tenga que volver al inicio para llegar
                       a otro documento legal — acceso directo en un solo clic.
            ¿Impacto? Mejora la UX; también es una buena práctica legal (GDPR, Ley 1581). */}
        <nav
          className="mb-3 flex flex-wrap justify-center gap-x-5 gap-y-1"
          aria-label="Páginas legales"
        >
          <Link
            to="/terminos-de-uso"
            className="text-xs text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
          >
            {t("landing.footer.terms")}
          </Link>
          <Link
            to="/privacidad"
            className="text-xs text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
          >
            {t("landing.footer.privacy")}
          </Link>
          <Link
            to="/cookies"
            className="text-xs text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
          >
            {t("landing.footer.cookies")}
          </Link>
          <Link
            to="/contacto"
            className="text-xs text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
          >
            {t("landing.footer.contact")}
          </Link>
        </nav>
        <p className="text-center text-xs text-gray-400 dark:text-gray-600">
          NN Auth System — {t("legal.footerCredit")} &middot; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS — bloques reutilizables dentro de un documento legal
// ─────────────────────────────────────────────────────────────

interface LegalSectionProps {
  /** Identificador HTML único para anclar la sección (sin "#"). */
  readonly id: string;
  /** Número de artículo o sección mostrado en el encabezado. */
  readonly number: string;
  /** Título descriptivo de la sección. */
  readonly heading: string;
  /** Contenido de la sección (párrafos, listas, etc.). */
  readonly children: React.ReactNode;
}

/**
 * ¿Qué? Sección numerada de un documento legal con encabezado y cuerpo.
 * ¿Para qué? Estructurar cada artículo o cláusula del documento de forma semántica
 *            y visualmente coherente con el resto del layout.
 * ¿Impacto? Facilita la lectura del documento y la navegación por anclas (#).
 */
export function LegalSection({ id, number, heading, children }: LegalSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        className="mb-4 flex items-baseline gap-3 text-lg font-semibold text-gray-900 dark:text-gray-100"
      >
        {/* Número de sección con estilo badge sutil */}
        <span
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-accent-300 bg-accent-50 text-xs font-bold text-accent-600 dark:border-accent-800 dark:bg-accent-950 dark:text-accent-400"
          aria-hidden="true"
        >
          {number}
        </span>
        {heading}
      </h2>

      {/* Contenido de la sección con tipografía legible */}
      <div className="space-y-3 pl-10 text-sm leading-relaxed text-gray-700 dark:text-gray-400">
        {children}
      </div>
    </section>
  );
}
