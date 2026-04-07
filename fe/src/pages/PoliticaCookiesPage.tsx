/**
 * Archivo: PoliticaCookiesPage.tsx
 * Descripción: Política de Uso de Cookies del servicio NN Auth System.
 * ¿Para qué? Informar al usuario qué cookies se usan, para qué sirven y cómo puede
 *            gestionarlas, en cumplimiento del deber de información y transparencia.
 * ¿Impacto? Aunque Colombia no tiene una ley específica de cookies como la Directiva
 *           ePrivacy de la UE, el uso de cookies que recojan datos personales está
 *           sujeto a la Ley 1581 de 2012 y el Decreto 1377 de 2013.
 *           La transparencia sobre cookies es un requisito de buenas prácticas (OWASP)
 *           y de la Circular Externa 002 de 2015 de la SIC.
 *
 * Marco normativo aplicable:
 *   - Ley 1581 de 2012     — Protección de datos personales (aplica a cookies con datos personales).
 *   - Decreto 1377 de 2013 — Deber de información al titular.
 *   - OWASP Top 10         — A05: Security Misconfiguration (flags de cookies: HttpOnly, Secure).
 *   - RFC 6265             — HTTP State Management Mechanism (estándar técnico de cookies).
 */

import { Trans, useTranslation } from "react-i18next";

import { LegalLayout, LegalSection } from "@/components/layout/LegalLayout";

// ─────────────────────────────────────────────────────────────
// TIPOS LOCALES
// ─────────────────────────────────────────────────────────────

interface CookieEntry {
  /** Nombre de la cookie tal como aparece en el navegador. */
  readonly name: string;
}

// ─────────────────────────────────────────────────────────────
// DATOS — nombres de cookies usadas por el servicio
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Listado de nombres de cookies — contenido descriptivo viene del i18n.
 * ¿Para qué? Source of truth para la tabla de cookies — cambiar aquí actualiza la página.
 * ¿Impacto? Mantener este listado actualizado es esencial para el cumplimiento legal.
 */
const SERVICE_COOKIES: readonly CookieEntry[] = [
  { name: "access_token" },
  { name: "refresh_token" },
  { name: "theme_preference" },
] as const;

// ─────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Página con la Política de Uso de Cookies del NN Auth System.
 * ¿Para qué? Informar al usuario qué cookies almacena el sistema, su finalidad, duración
 *            y cómo puede inhabilitarlas, conforme al deber de transparencia de la Ley 1581/2012.
 * ¿Impacto? La falta de información sobre cookies puede generar desconfianza en el usuario
 *           y exponer al operador ante reclamaciones por tratamiento indebido de datos personales.
 */
export function PoliticaCookiesPage() {
  const { t } = useTranslation();

  /** Elemento <strong> reutilizable para Trans — aplica colores responsivos. */
  const S = <strong className="text-gray-700 dark:text-gray-300" />;
  /** Elemento <code> reutilizable para Trans — estilo inline monoespaciado. */
  const C = (
    <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 text-xs text-accent-600 dark:text-accent-300" />
  );
  /** Enlace a la Política de Privacidad. */
  const privacyLink = (
    <a
      href="/privacidad"
      className="text-accent-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
    />
  );
  /** Enlace al email de contacto legal. */
  const emailLink = (
    <a
      href="mailto:legal@nn-company.co"
      className="text-accent-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
    />
  );

  return (
    <LegalLayout title={t("legal.cookies.title")} lastUpdated="2026-02-01" version="1.0">
      {/* ── Introducción ───────────────────────────────────── */}
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <Trans i18nKey="legal.cookies.intro1" components={{ strong: S }} />
      </p>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <Trans i18nKey="legal.cookies.intro2" components={{ strong: S, privacyLink }} />
      </p>

      {/* ── Secciones legales ─────────────────────────────── */}

      <LegalSection id="que-son" number="1" heading={t("legal.cookies.s1.heading")}>
        <p>
          <Trans i18nKey="legal.cookies.s1.p1" components={{ strong: S }} />
        </p>
        <p>{t("legal.cookies.s1.p2")}</p>
      </LegalSection>

      <LegalSection id="tipos" number="2" heading={t("legal.cookies.s2.heading")}>
        <p>{t("legal.cookies.s2.p1")}</p>

        {/* Categorías de cookies */}
        <div className="mt-4 space-y-4">
          {/* Categoría — Funcionales/Autenticación */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 p-4">
            <h3 className="mb-1 text-sm font-semibold text-accent-400">
              {t("legal.cookies.s2.authCategory.title")}
            </h3>
            <p>
              <Trans i18nKey="legal.cookies.s2.authCategory.p1" components={{ strong: S }} />
            </p>
            <p className="mt-2">
              <Trans
                i18nKey="legal.cookies.s2.authCategory.p2"
                components={{ strong: S, code: C }}
              />
            </p>
          </div>

          {/* Categoría — Preferencias */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 p-4">
            <h3 className="mb-1 text-sm font-semibold text-accent-400">
              {t("legal.cookies.s2.prefCategory.title")}
            </h3>
            <p>{t("legal.cookies.s2.prefCategory.p1")}</p>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="tabla" number="3" heading={t("legal.cookies.s3.heading")}>
        <p>
          <Trans i18nKey="legal.cookies.s3.intro" components={{ strong: S }} />
        </p>

        {/* Tabla de cookies — responsive con scroll horizontal en móvil */}
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                {(["name", "purpose", "duration", "type"] as const).map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400"
                    scope="col"
                  >
                    {t(`legal.cookies.s3.tableHeaders.${header}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {SERVICE_COOKIES.map((cookie) => (
                <tr
                  key={cookie.name}
                  className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-4 py-3">
                    <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-accent-600 dark:text-accent-300">
                      {cookie.name}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {t(`legal.cookies.s3.cookies.${cookie.name}.purpose`)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-400">
                    {t(`legal.cookies.s3.cookies.${cookie.name}.duration`)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-400">
                    {t(`legal.cookies.s3.cookies.${cookie.name}.type`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection id="seguridad-cookies" number="4" heading={t("legal.cookies.s4.heading")}>
        <p>
          <Trans i18nKey="legal.cookies.s4.intro" components={{ strong: S }} />
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <Trans i18nKey="legal.cookies.s4.li1" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.cookies.s4.li2" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.cookies.s4.li3" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.cookies.s4.li4" components={{ strong: S }} />
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="gestion" number="5" heading={t("legal.cookies.s5.heading")}>
        <p>{t("legal.cookies.s5.intro")}</p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <Trans i18nKey="legal.cookies.s5.li1" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.cookies.s5.li2" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.cookies.s5.li3" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.cookies.s5.li4" components={{ strong: S }} />
          </li>
        </ul>
        <p>
          <Trans i18nKey="legal.cookies.s5.warning" components={{ strong: S }} />
        </p>
      </LegalSection>

      <LegalSection id="no-tracking" number="6" heading={t("legal.cookies.s6.heading")}>
        <p>
          <Trans i18nKey="legal.cookies.s6.p1" components={{ strong: S }} />
        </p>
        <p>
          <Trans i18nKey="legal.cookies.s6.p2" components={{ strong: S }} />
        </p>
      </LegalSection>

      <LegalSection id="relacion-privacidad" number="7" heading={t("legal.cookies.s7.heading")}>
        <p>
          <Trans i18nKey="legal.cookies.s7.p1" components={{ strong: S, privacyLink }} />
        </p>
      </LegalSection>

      <LegalSection id="actualizacion" number="8" heading={t("legal.cookies.s8.heading")}>
        <p>{t("legal.cookies.s8.p1")}</p>
        <p>
          <Trans i18nKey="legal.cookies.s8.p2" components={{ emailLink }} />
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
