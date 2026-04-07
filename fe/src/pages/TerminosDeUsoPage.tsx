/**
 * Archivo: TerminosDeUsoPage.tsx
 * Descripción: Página de Términos de Uso del sistema NN Auth System.
 * ¿Para qué? Informar al usuario, antes de usar el servicio, las condiciones legales que
 *            regulan el acceso y uso de la plataforma, conforme a la legislación colombiana.
 * ¿Impacto? Es un requisito legal para operar un servicio web en Colombia. Su ausencia
 *           expone al operador a reclamaciones bajo la Ley 1480 de 2011 (Estatuto del Consumidor)
 *           y la Ley 527 de 1999 (Comercio electrónico).
 *
 * Marco normativo aplicable:
 *   - Ley 527 de 1999     — Comercio electrónico: validez de mensajes de datos y contratos electrónicos.
 *   - Ley 1480 de 2011    — Estatuto del Consumidor: derechos y deberes en servicios digitales.
 *   - Ley 1581 de 2012    — Protección de datos personales (referencia a Política de Privacidad).
 *   - Ley 23 de 1982      — Derechos de autor sobre el código fuente y contenidos del sistema.
 */

import { Trans, useTranslation } from "react-i18next";

import { LegalLayout, LegalSection } from "@/components/layout/LegalLayout";

// ─────────────────────────────────────────────────────────────
// CONSTANTES DEL DOCUMENTO
// ─────────────────────────────────────────────────────────────

/** Datos de identificación del responsable del servicio (empresa ficticia educativa). */
const RESPONSABLE = {
  nombre: "Empresa NN S.A.S.",
  nit: "NIT 900.000.000-0",
  domicilio: "Bogotá D.C., Colombia",
  email: "legal@nn-company.co",
} as const;

// ─────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Página con los Términos de Uso del servicio NN Auth System.
 * ¿Para qué? Establecer el contrato de uso entre el operador y el usuario, conforme a las
 *            leyes colombianas de comercio electrónico y protección al consumidor.
 * ¿Impacto? Sin este documento, el usuario no tiene claridad sobre sus derechos/deberes
 *           ni el operador puede hacer valer las condiciones del servicio.
 */
export function TerminosDeUsoPage() {
  const { t } = useTranslation();

  /** Elemento <strong> reutilizable para Trans — aplica colores responsivos. */
  const S = <strong className="text-gray-700 dark:text-gray-300" />;
  /** Elemento <a> que apunta a la Política de Privacidad. */
  const privacyLink = (
    <a
      href="/privacidad"
      className="text-accent-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
    />
  );

  return (
    <LegalLayout title={t("legal.terms.title")} lastUpdated="2026-02-01" version="1.0">
      {/* ── Introducción ───────────────────────────────────── */}
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <Trans
          i18nKey="legal.terms.intro1"
          values={{
            responsable: RESPONSABLE.nombre,
            nit: RESPONSABLE.nit,
            domicilio: RESPONSABLE.domicilio,
          }}
          components={{ strong: S }}
        />
      </p>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <Trans i18nKey="legal.terms.intro2" components={{ strong: S }} />
      </p>

      {/* ── Secciones legales ─────────────────────────────── */}

      <LegalSection id="objeto" number="1" heading={t("legal.terms.s1.heading")}>
        <p>{t("legal.terms.s1.p1")}</p>
        <p>{t("legal.terms.s1.p2")}</p>
        <p>
          <Trans i18nKey="legal.terms.s1.p3" components={{ strong: S }} />
        </p>
      </LegalSection>

      <LegalSection id="registro" number="2" heading={t("legal.terms.s2.heading")}>
        <p>{t("legal.terms.s2.p1")}</p>
        <p>{t("legal.terms.s2.p2", { email: RESPONSABLE.email })}</p>
        <p>{t("legal.terms.s2.p3")}</p>
      </LegalSection>

      <LegalSection id="uso-aceptable" number="3" heading={t("legal.terms.s3.heading")}>
        <p>
          <Trans i18nKey="legal.terms.s3.intro" components={{ strong: S }} />
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>{t("legal.terms.s3.li1")}</li>
          <li>{t("legal.terms.s3.li2")}</li>
          <li>{t("legal.terms.s3.li3")}</li>
          <li>{t("legal.terms.s3.li4")}</li>
          <li>{t("legal.terms.s3.li5")}</li>
        </ul>
        <p>{t("legal.terms.s3.closing")}</p>
      </LegalSection>

      <LegalSection id="propiedad-intelectual" number="4" heading={t("legal.terms.s4.heading")}>
        <p>
          <Trans i18nKey="legal.terms.s4.p1" components={{ strong: S }} />
        </p>
        <p>{t("legal.terms.s4.p2")}</p>
      </LegalSection>

      <LegalSection id="privacidad" number="5" heading={t("legal.terms.s5.heading")}>
        <p>
          <Trans i18nKey="legal.terms.s5.p1" components={{ strong: S, privacyLink }} />
        </p>
      </LegalSection>

      <LegalSection id="responsabilidad" number="6" heading={t("legal.terms.s6.heading")}>
        <p>{t("legal.terms.s6.p1")}</p>
        <p>
          <Trans i18nKey="legal.terms.s6.p2" components={{ strong: S }} />
        </p>
      </LegalSection>

      <LegalSection id="modificaciones" number="7" heading={t("legal.terms.s7.heading")}>
        <p>{t("legal.terms.s7.p1")}</p>
        <p>
          <Trans i18nKey="legal.terms.s7.p2" components={{ strong: S }} />
        </p>
      </LegalSection>

      <LegalSection id="ley-aplicable" number="8" heading={t("legal.terms.s8.heading")}>
        <p>
          <Trans i18nKey="legal.terms.s8.p1" components={{ strong: S }} />
        </p>
        <p>
          <Trans i18nKey="legal.terms.s8.p2" components={{ strong: S }} />
        </p>
      </LegalSection>

      <LegalSection id="contacto" number="9" heading={t("legal.terms.s9.heading")}>
        <p>{t("legal.terms.s9.intro")}</p>
        <address className="not-italic">
          <ul className="mt-2 space-y-1">
            <li>
              <strong className="text-gray-700 dark:text-gray-300">
                {t("legal.terms.s9.companyLabel")}
              </strong>{" "}
              {RESPONSABLE.nombre} — {RESPONSABLE.nit}
            </li>
            <li>
              <strong className="text-gray-700 dark:text-gray-300">
                {t("legal.terms.s9.emailLabel")}
              </strong>{" "}
              <a
                href={`mailto:${RESPONSABLE.email}`}
                className="text-accent-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
              >
                {RESPONSABLE.email}
              </a>
            </li>
            <li>
              <strong className="text-gray-700 dark:text-gray-300">
                {t("legal.terms.s9.domicilioLabel")}
              </strong>{" "}
              {RESPONSABLE.domicilio}
            </li>
          </ul>
        </address>
      </LegalSection>
    </LegalLayout>
  );
}
