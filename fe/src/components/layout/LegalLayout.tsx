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
import { NNAuthLogo } from "@/pages/LandingPage";

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
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* ══════════════════════════════════════════════════════
          HEADER — navegación de retorno y wordmark
          ══════════════════════════════════════════════════════ */}
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          {/* Logo / wordmark — enlace al inicio */}
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

          {/* Botón de retorno a la página principal */}
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors duration-200 hover:bg-gray-800 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          MAIN — contenido del documento legal
          ══════════════════════════════════════════════════════ */}
      <main>
        <article className="mx-auto max-w-4xl px-6 py-14" aria-labelledby="legal-title">
          {/* Metadatos del documento */}
          <header className="mb-10 border-b border-gray-800 pb-8">
            <h1 id="legal-title" className="mb-3 text-3xl font-bold tracking-tight text-gray-100">
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
        className="mb-4 flex items-baseline gap-3 text-lg font-semibold text-gray-100"
      >
        {/* Número de sección con estilo badge sutil */}
        <span
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-blue-800 bg-blue-950 text-xs font-bold text-blue-400"
          aria-hidden="true"
        >
          {number}
        </span>
        {heading}
      </h2>

      {/* Contenido de la sección con tipografía legible */}
      <div className="space-y-3 pl-10 text-sm leading-relaxed text-gray-400">{children}</div>
    </section>
  );
}
