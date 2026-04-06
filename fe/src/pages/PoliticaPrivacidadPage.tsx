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
  return (
    <LegalLayout
      title="Política de Privacidad y Tratamiento de Datos Personales"
      lastUpdated="2026-02-01"
      version="1.0"
    >
      {/* ── Introducción y base legal ─────────────────────── */}
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        En cumplimiento de la <strong className="text-gray-700 dark:text-gray-300">Ley 1581 de 2012</strong> —Régimen
        General de Protección de Datos Personales— y el{" "}
        <strong className="text-gray-700 dark:text-gray-300">Decreto 1377 de 2013</strong> reglamentario, la empresa{" "}
        <strong className="text-gray-700 dark:text-gray-300">
          {RESPONSABLE.nombre} — {RESPONSABLE.nit}
        </strong>{" "}
        (en adelante, «el Responsable») informa al titular de los datos sobre las condiciones que
        rigen el tratamiento de su información personal en el servicio{" "}
        <strong className="text-gray-700 dark:text-gray-300">NN Auth System</strong>.
      </p>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Esta política aplica a todos los datos personales recolectados a través del Servicio y
        delimita los derechos y mecanismos de que dispone el titular para ejercerlos ante el
        Responsable o ante la{" "}
        <strong className="text-gray-700 dark:text-gray-300">Superintendencia de Industria y Comercio (SIC)</strong>{" "}
        como autoridad de vigilancia y control.
      </p>

      {/* ── Secciones legales ─────────────────────────────── */}

      <LegalSection id="responsable" number="1" heading="Responsable del Tratamiento">
        <p>Los datos personales serán tratados bajo la responsabilidad de:</p>
        <address className="not-italic">
          <ul className="mt-2 space-y-1">
            <li>
              <strong className="text-gray-700 dark:text-gray-300">Razón social:</strong> {RESPONSABLE.nombre}
            </li>
            <li>
              <strong className="text-gray-700 dark:text-gray-300">NIT:</strong> {RESPONSABLE.nit}
            </li>
            <li>
              <strong className="text-gray-700 dark:text-gray-300">Domicilio:</strong> {RESPONSABLE.domicilio}
            </li>
            <li>
              <strong className="text-gray-700 dark:text-gray-300">Canal de atención — datos personales:</strong>{" "}
              <a
                href={`mailto:${RESPONSABLE.email}`}
                className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                {RESPONSABLE.email}
              </a>
            </li>
            <li>
              <strong className="text-gray-700 dark:text-gray-300">Teléfono:</strong> {RESPONSABLE.telefono}
            </li>
          </ul>
        </address>
      </LegalSection>

      <LegalSection id="datos-recolectados" number="2" heading="Datos Personales Recolectados">
        <p>
          El Responsable recolecta exclusivamente los datos necesarios para el funcionamiento del
          Servicio, de conformidad con el principio de{" "}
          <strong className="text-gray-700 dark:text-gray-300">finalidad</strong> (Art. 4.b, Ley 1581/2012) y el
          principio de <strong className="text-gray-700 dark:text-gray-300">necesidad</strong> (Art. 4.d, Ley
          1581/2012):
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Nombre completo</strong> — nombre y apellido del
            usuario registrado.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Dirección de correo electrónico</strong> — utilizada
            como identificador único y canal de comunicación (verificación de cuenta, recuperación
            de contraseña).
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Contraseña hasheada</strong> — almacenada únicamente
            como hash bcrypt; nunca en texto plano. El Responsable no puede recuperar ni ver la
            contraseña original.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Dirección IP y datos de sesión</strong> — registrados
            automáticamente en los logs del servidor por razones técnicas y de seguridad, conforme
            al Decreto 1078 de 2015.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Fecha y hora de registro</strong> — metadato técnico
            generado automáticamente en la creación de la cuenta.
          </li>
        </ul>
        <p>
          <strong className="text-gray-700 dark:text-gray-300">No se recolectan</strong> datos sensibles (Art. 5, Ley
          1581/2012) como origen racial, orientación sexual, datos biométricos, datos de salud ni
          afiliación política.
        </p>
      </LegalSection>

      <LegalSection id="finalidad" number="3" heading="Finalidad del Tratamiento">
        <p>
          Los datos personales se tratan exclusivamente para las siguientes finalidades, conforme al{" "}
          <strong className="text-gray-700 dark:text-gray-300">artículo 13 del Decreto 1377 de 2013</strong>:
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Autenticación y seguridad:</strong> verificar la
            identidad del usuario y gestionar el acceso al Servicio mediante tokens JWT.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Comunicaciones del servicio:</strong> enviar correos
            de verificación de cuenta y recuperación de contraseña.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mantenimiento de la cuenta:</strong> permitir al
            usuario actualizar su perfil y gestionar su contraseña.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Seguridad y auditoría:</strong> detectar y prevenir
            accesos no autorizados, fraudes o abusos del Servicio.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Propósito educativo:</strong> demostración de buenas
            prácticas de autenticación en el contexto del Proyecto SENA.
          </li>
        </ul>
        <p>
          Los datos <strong className="text-gray-700 dark:text-gray-300">no serán usados</strong> para perfilamiento
          comercial, publicidad dirigida ni vendidos/cedidos a terceros con fines comerciales.
        </p>
      </LegalSection>

      <LegalSection id="autorizacion" number="4" heading="Autorización del Titular">
        <p>
          De conformidad con el{" "}
          <strong className="text-gray-700 dark:text-gray-300">artículo 9 de la Ley 1581 de 2012</strong> y el{" "}
          <strong className="text-gray-700 dark:text-gray-300">artículo 7 del Decreto 1377 de 2013</strong>, el
          tratamiento de datos personales requiere autorización previa, expresa e informada del
          titular.
        </p>
        <p>
          Dicha autorización se obtiene en el momento del registro, cuando el usuario acepta esta
          Política de Privacidad y los Términos de Uso. La autorización queda registrada
          electrónicamente con marca de tiempo (timestamp) conforme a la{" "}
          <strong className="text-gray-700 dark:text-gray-300">Ley 527 de 1999</strong>.
        </p>
        <p>
          El titular puede revocar su autorización en cualquier momento mediante los canales
          indicados en la sección{" "}
          <a
            href="#derechos"
            className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            Derechos del Titular
          </a>{" "}
          sin efecto retroactivo.
        </p>
      </LegalSection>

      <LegalSection id="derechos" number="5" heading="Derechos del Titular (Art. 8, Ley 1581/2012)">
        <p>
          El titular de los datos personales tiene los siguientes derechos, ejercibles en cualquier
          momento y de forma gratuita:
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Conocer</strong> los datos personales que obran en las
            bases de datos del Responsable y la información relativa a su tratamiento.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Actualizar y rectificar</strong> sus datos cuando sean
            inexactos, incompletos o desactualizados.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Suprimir (derecho al olvido)</strong> sus datos cuando
            no sean necesarios para los fines que justificaron el tratamiento, o cuando haya vencido
            el plazo de conservación, salvo obligación legal de conservarlos.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Revocar la autorización</strong> para el tratamiento
            de sus datos, en los términos del artículo 9 de la Ley 1581/2012.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Acceder gratuitamente</strong> a sus datos personales
            que hayan sido objeto de tratamiento (al menos una vez por mes calendario, o cada vez
            que existan modificaciones sustanciales).
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Presentar quejas</strong> ante la SIC por infracción a
            la Ley 1581/2012 y las normas concordantes (previa presentación de consulta/reclamo al
            Responsable).
          </li>
        </ul>
        <p>
          Para ejercer estos derechos, el titular debe remitir solicitud escrita al correo{" "}
          <a
            href={`mailto:${RESPONSABLE.email}`}
            className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            {RESPONSABLE.email}
          </a>{" "}
          indicando: nombre completo, documento de identidad, descripción clara de la solicitud y,
          en su caso, documentos que la acrediten.
        </p>
        <p>
          El Responsable atenderá la solicitud en un plazo máximo de{" "}
          <strong className="text-gray-700 dark:text-gray-300">10 días hábiles</strong> (consultas, Art. 14 Ley
          1581/2012) o <strong className="text-gray-700 dark:text-gray-300">15 días hábiles</strong> (reclamos, Art. 15
          Ley 1581/2012), prorrogables por igual término en casos justificados.
        </p>
      </LegalSection>

      <LegalSection id="conservacion" number="6" heading="Tiempo de Conservación de los Datos">
        <p>
          Los datos personales serán conservados durante el tiempo que la cuenta permanezca activa y
          por un período adicional de <strong className="text-gray-700 dark:text-gray-300">5 años</strong> a partir de
          la cancelación de la cuenta, con el fin de:
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>Atender obligaciones legales de conservación de registros electrónicos.</li>
          <li>Resolver disputas o reclamaciones derivadas del uso del Servicio.</li>
          <li>Dar cumplimiento a órdenes de autoridades judiciales o administrativas.</li>
        </ul>
        <p>
          Transcurrido dicho plazo, los datos serán eliminados o anonimizados de forma irreversible,
          salvo que la ley exija conservarlos por más tiempo.
        </p>
      </LegalSection>

      <LegalSection id="transferencias" number="7" heading="Transferencias y Transmisiones">
        <p>
          Los datos personales{" "}
          <strong className="text-gray-700 dark:text-gray-300">no son transferidos ni transmitidos</strong> a terceros
          con fines comerciales. Podrán compartirse únicamente en los siguientes casos, conforme al{" "}
          <strong className="text-gray-700 dark:text-gray-300">artículo 26 de la Ley 1581/2012</strong>:
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Encargados del tratamiento</strong> (proveedores de
            infraestructura técnica), quienes quedan vinculados por contrato al cumplimiento de la
            Ley 1581/2012.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Autoridades competentes</strong> (judiciales,
            fiscales, administrativas) cuando medie orden legal o requerimiento oficial.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Terceros con autorización expresa</strong> del
            titular, previa solicitud y consentimiento libre e informado.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="seguridad" number="8" heading="Medidas de Seguridad">
        <p>
          El Responsable adopta medidas técnicas, organizativas y administrativas para proteger los
          datos personales contra acceso no autorizado, alteración, pérdida o destrucción, en
          cumplimiento del principio de <strong className="text-gray-700 dark:text-gray-300">seguridad</strong> (Art.
          4.g, Ley 1581/2012):
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            Hashing de contraseñas con <strong className="text-gray-700 dark:text-gray-300">bcrypt</strong> — las
            contraseñas nunca se almacenan en texto plano.
          </li>
          <li>
            Comunicaciones cifradas con <strong className="text-gray-700 dark:text-gray-300">HTTPS/TLS</strong>.
          </li>
          <li>
            Tokens JWT de corta duración (15 minutos) y refresh tokens con expiración de 7 días.
          </li>
          <li>Controles de acceso por roles y validación estricta de entradas (Pydantic).</li>
          <li>
            Diseño siguiendo las recomendaciones del{" "}
            <strong className="text-gray-700 dark:text-gray-300">OWASP Top 10</strong>.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="rnbd" number="9" heading="Registro Nacional de Bases de Datos (RNBD)">
        <p>
          Conforme al <strong className="text-gray-700 dark:text-gray-300">Decreto 886 de 2014</strong> y el{" "}
          <strong className="text-gray-700 dark:text-gray-300">Decreto 090 de 2018</strong>, las bases de datos que
          contengan datos personales deben inscribirse en el Registro Nacional de Bases de Datos
          administrado por la SIC.
        </p>
        <p>
          La base de datos de usuarios del NN Auth System está inscrita (o en proceso de
          inscripción) en el RNBD, con la información exigida por el artículo 4 del Decreto 886 de
          2014.
        </p>
        <p>
          Para mayor información sobre el RNBD, puede consultar el portal de la SIC:{" "}
          <a
            href="https://www.sic.gov.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            www.sic.gov.co
          </a>
          {"."}{" "}
        </p>
      </LegalSection>

      <LegalSection id="autoridad" number="10" heading="Autoridad de Control">
        <p>
          La{" "}
          <strong className="text-gray-700 dark:text-gray-300">Superintendencia de Industria y Comercio (SIC)</strong>{" "}
          es la autoridad nacional encargada de velar por el cumplimiento de la Ley 1581 de 2012 en
          Colombia. El titular que considere vulnerados sus derechos puede presentar queja ante la
          SIC, previa presentación de reclamo directo al Responsable del Tratamiento (Art. 15, Ley
          1581/2012).
        </p>
        <address className="not-italic mt-2 space-y-1">
          <p>
            <strong className="text-gray-700 dark:text-gray-300">Portal web:</strong>{" "}
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
            <strong className="text-gray-700 dark:text-gray-300">Línea gratuita:</strong> 01 8000 910 165
          </p>
          <p>
            <strong className="text-gray-700 dark:text-gray-300">Dirección:</strong> Carrera 13 N° 27-00, Bogotá D.C.
          </p>
        </address>
      </LegalSection>

      <LegalSection id="vigencia" number="11" heading="Vigencia y Modificaciones">
        <p>
          Esta política entra en vigencia el{" "}
          <strong className="text-gray-700 dark:text-gray-300">1 de febrero de 2026</strong>. El Responsable se reserva
          el derecho de actualizarla cuando sea necesario para adaptarse a cambios normativos o en
          el Servicio.
        </p>
        <p>
          Toda modificación será publicada en esta misma página y comunicada al titular mediante
          correo electrónico con al menos{" "}
          <strong className="text-gray-700 dark:text-gray-300">10 días hábiles de antelación</strong>. El uso
          continuado del Servicio tras la publicación implica la aceptación de los cambios.
        </p>
        <p>
          Para consultas sobre esta Política, contáctenos en:{" "}
          <a
            href={`mailto:${RESPONSABLE.email}`}
            className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            {RESPONSABLE.email}
          </a>
          {"."}
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
