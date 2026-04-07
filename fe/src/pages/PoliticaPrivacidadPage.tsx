/**
 * Archivo: PoliticaPrivacidadPage.tsx
 * Descripción: Política de Privacidad y Tratamiento de Datos Personales del NN Auth System.
 * ¿Para qué? Cumplir con la obligación legal de informar al titular sobre el tratamiento
 *            de sus datos personales, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.
 * ¿Impacto? La ausencia o incumplimiento de esta política puede dar lugar a sanciones por parte
 *           de la Superintendencia de Industria y Comercio (SIC), que es la autoridad de control
 *           en Colombia para la protección de datos personales.
 *
 * Marco normativo aplicable:
 *   - Ley 1581 de 2012        — Régimen General de Protección de Datos Personales.
 *   - Decreto 1377 de 2013    — Reglamentario parcial de la Ley 1581 (autorización, aviso de privacidad).
 *   - Decreto 886 de 2014     — Registro Nacional de Bases de Datos (RNBD) ante la SIC.
 *   - Decreto 1074 de 2015    — Decreto Único Reglamentario del Sector Comercio.
 *   - Circular Externa 002/2015 SIC — Instrucciones sobre autorización de tratamiento.
 *   - Ley 1266 de 2008        — Habeas Data para datos financieros (referencia complementaria).
 */

import { Trans, useTranslation } from "react-i18next";

import { LegalLayout, LegalSection } from "@/components/layout/LegalLayout";

// ─────────────────────────────────────────────────────────────
// CONSTANTES DEL DOCUMENTO
// ─────────────────────────────────────────────────────────────

/** Identificación del Responsable del Tratamiento conforme al Decreto 1377/2013. */
const RESPONSABLE = {
  nombre: "Empresa NN S.A.S.",
  nit: "NIT 900.000.000-0",
  domicilio: "Bogotá D.C., Colombia",
  email: "datospersonales@nn-company.co",
  telefono: "(+57) 601 000 0000",
} as const;

// ─────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Página con la Política de Privacidad y Tratamiento de Datos Personales.
 * ¿Para qué? Informar al titular (usuario) sobre qué datos se recolectan, con qué finalidad,
 *            cuánto tiempo se conservan y cómo puede ejercer sus derechos (Art. 8, Ley 1581/2012).
 * ¿Impacto? Es un documento de cumplimiento obligatorio en Colombia para cualquier operador
 *           de datos personales que recolecte, almacene o procese datos de personas naturales.
 */
export function PoliticaPrivacidadPage() {
  const { t } = useTranslation();

  /** Elemento <strong> reutilizable para Trans — aplica colores responsivos. */
  const S = <strong className="text-gray-700 dark:text-gray-300" />;
  /** Elemento <a> que apunta a la sección de derechos del titular. */
  const rightsLink = (
    <a
      href="#derechos"
      className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
    />
  );
  /** Enlace al email del responsable de datos. */
  const emailLink = (
    <a
      href={`mailto:${RESPONSABLE.email}`}
      className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
    />
  );
  /** Enlace externo a www.sic.gov.co. */
  const sicLink = (
    <a
      href="https://www.sic.gov.co"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
    />
  );

  return (
    <LegalLayout title={t("legal.privacy.title")} lastUpdated="2026-02-01" version="1.0">
      {/* ── Introducción y base legal ─────────────────────── */}
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <Trans
          i18nKey="legal.privacy.intro1"
          values={{ responsable: RESPONSABLE.nombre, nit: RESPONSABLE.nit }}
          components={{ strong: S }}
        />
      </p>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <Trans i18nKey="legal.privacy.intro2" components={{ strong: S }} />
      </p>

      {/* ── Secciones legales ─────────────────────────────── */}

      <LegalSection id="responsable" number="1" heading={t("legal.privacy.s1.heading")}>
        <p>{t("legal.privacy.s1.intro")}</p>
        <address className="not-italic">
          <ul className="mt-2 space-y-1">
            <li>
              <strong className="text-gray-700 dark:text-gray-300">
                {t("legal.privacy.s1.companyLabel")}
              </strong>{" "}
              {RESPONSABLE.nombre}
            </li>
            <li>
              <strong className="text-gray-700 dark:text-gray-300">
                {t("legal.privacy.s1.nitLabel")}
              </strong>{" "}
              {RESPONSABLE.nit}
            </li>
            <li>
              <strong className="text-gray-700 dark:text-gray-300">
                {t("legal.privacy.s1.domicilioLabel")}
              </strong>{" "}
              {RESPONSABLE.domicilio}
            </li>
            <li>
              <strong className="text-gray-700 dark:text-gray-300">
                {t("legal.privacy.s1.contactLabel")}
              </strong>{" "}
              <a
                href={`mailto:${RESPONSABLE.email}`}
                className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                {RESPONSABLE.email}
              </a>
            </li>
            <li>
              <strong className="text-gray-700 dark:text-gray-300">
                {t("legal.privacy.s1.phoneLabel")}
              </strong>{" "}
              {RESPONSABLE.telefono}
            </li>
          </ul>
        </address>
      </LegalSection>

      <LegalSection id="datos-recolectados" number="2" heading={t("legal.privacy.s2.heading")}>
        <p>
          <Trans i18nKey="legal.privacy.s2.intro" components={{ strong: S }} />
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <Trans i18nKey="legal.privacy.s2.li1" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s2.li2" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s2.li3" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s2.li4" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s2.li5" components={{ strong: S }} />
          </li>
        </ul>
        <p>
          <Trans i18nKey="legal.privacy.s2.noCollect" components={{ strong: S }} />
        </p>
      </LegalSection>

      <LegalSection id="finalidad" number="3" heading={t("legal.privacy.s3.heading")}>
        <p>
          <Trans i18nKey="legal.privacy.s3.intro" components={{ strong: S }} />
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <Trans i18nKey="legal.privacy.s3.li1" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s3.li2" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s3.li3" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s3.li4" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s3.li5" components={{ strong: S }} />
          </li>
        </ul>
        <p>
          <Trans i18nKey="legal.privacy.s3.closing" components={{ strong: S }} />
        </p>
      </LegalSection>

      <LegalSection id="autorizacion" number="4" heading={t("legal.privacy.s4.heading")}>
        <p>
          <Trans i18nKey="legal.privacy.s4.p1" components={{ strong: S }} />
        </p>
        <p>
          <Trans i18nKey="legal.privacy.s4.p2" components={{ strong: S }} />
        </p>
        <p>
          <Trans i18nKey="legal.privacy.s4.p3" components={{ rightsLink }} />
        </p>
      </LegalSection>

      <LegalSection id="derechos" number="5" heading={t("legal.privacy.s5.heading")}>
        <p>{t("legal.privacy.s5.intro")}</p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <Trans i18nKey="legal.privacy.s5.li1" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s5.li2" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s5.li3" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s5.li4" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s5.li5" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s5.li6" components={{ strong: S }} />
          </li>
        </ul>
        <p>
          <Trans
            i18nKey="legal.privacy.s5.procedure"
            values={{ email: RESPONSABLE.email }}
            components={{ emailLink }}
          />
        </p>
        <p>
          <Trans i18nKey="legal.privacy.s5.timeframe" components={{ strong: S }} />
        </p>
      </LegalSection>

      <LegalSection id="conservacion" number="6" heading={t("legal.privacy.s6.heading")}>
        <p>
          <Trans i18nKey="legal.privacy.s6.intro" components={{ strong: S }} />
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>{t("legal.privacy.s6.li1")}</li>
          <li>{t("legal.privacy.s6.li2")}</li>
          <li>{t("legal.privacy.s6.li3")}</li>
        </ul>
        <p>{t("legal.privacy.s6.closing")}</p>
      </LegalSection>

      <LegalSection id="transferencias" number="7" heading={t("legal.privacy.s7.heading")}>
        <p>
          <Trans i18nKey="legal.privacy.s7.intro" components={{ strong: S }} />
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <Trans i18nKey="legal.privacy.s7.li1" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s7.li2" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s7.li3" components={{ strong: S }} />
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="seguridad" number="8" heading={t("legal.privacy.s8.heading")}>
        <p>
          <Trans i18nKey="legal.privacy.s8.intro" components={{ strong: S }} />
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <Trans i18nKey="legal.privacy.s8.li1" components={{ strong: S }} />
          </li>
          <li>
            <Trans i18nKey="legal.privacy.s8.li2" components={{ strong: S }} />
          </li>
          <li>{t("legal.privacy.s8.li3")}</li>
          <li>{t("legal.privacy.s8.li4")}</li>
          <li>
            <Trans i18nKey="legal.privacy.s8.li5" components={{ strong: S }} />
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="rnbd" number="9" heading={t("legal.privacy.s9.heading")}>
        <p>
          <Trans i18nKey="legal.privacy.s9.p1" components={{ strong: S }} />
        </p>
        <p>{t("legal.privacy.s9.p2")}</p>
        <p>
          <Trans i18nKey="legal.privacy.s9.p3" components={{ sicLink }} />
        </p>
      </LegalSection>

      <LegalSection id="autoridad" number="10" heading={t("legal.privacy.s10.heading")}>
        <p>
          <Trans i18nKey="legal.privacy.s10.p1" components={{ strong: S }} />
        </p>
        <address className="not-italic mt-2 space-y-1">
          <p>
            <strong className="text-gray-700 dark:text-gray-300">
              {t("legal.privacy.s10.portalLabel")}
            </strong>{" "}
            <a
              href="https://www.sic.gov.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              www.sic.gov.co
            </a>
          </p>
          <p>
            <strong className="text-gray-700 dark:text-gray-300">
              {t("legal.privacy.s10.phoneLabel")}
            </strong>{" "}
            01 8000 910 165
          </p>
          <p>
            <strong className="text-gray-700 dark:text-gray-300">
              {t("legal.privacy.s10.addressLabel")}
            </strong>{" "}
            Carrera 13 N° 27-00, Bogotá D.C.
          </p>
        </address>
      </LegalSection>

      <LegalSection id="vigencia" number="11" heading={t("legal.privacy.s11.heading")}>
        <p>
          <Trans i18nKey="legal.privacy.s11.p1" components={{ strong: S }} />
        </p>
        <p>
          <Trans i18nKey="legal.privacy.s11.p2" components={{ strong: S }} />
        </p>
        <p>
          <Trans
            i18nKey="legal.privacy.s11.p3"
            values={{ email: RESPONSABLE.email }}
            components={{ emailLink }}
          />
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
