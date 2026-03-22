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

import { LegalLayout, LegalSection } from "@/components/layout/LegalLayout";

// ─────────────────────────────────────────────────────────────
// TIPOS LOCALES
// ─────────────────────────────────────────────────────────────

interface CookieEntry {
  /** Nombre de la cookie tal como aparece en el navegador. */
  readonly name: string;
  /** Propósito o descripción de lo que hace la cookie. */
  readonly purpose: string;
  /** Tiempo máximo de vida de la cookie. */
  readonly duration: string;
  /** Tipo de cookie según clasificación funcional. */
  readonly type: string;
}

// ─────────────────────────────────────────────────────────────
// DATOS — tabla de cookies usadas por el servicio
// ─────────────────────────────────────────────────────────────

/**
 * ¿Qué? Listado de todas las cookies establecidas por el servicio.
 * ¿Para qué? Source of truth para la tabla de cookies — cambiar aquí actualiza la página.
 * ¿Impacto? Mantener este listado actualizado es esencial para el cumplimiento legal.
 */
const SERVICE_COOKIES: readonly CookieEntry[] = [
  {
    name: "access_token",
    purpose:
      "Almacena el token JWT de acceso que autentica al usuario en cada solicitud. " +
      "Sin esta cookie, el usuario no puede acceder a rutas protegidas.",
    duration: "15 minutos",
    type: "Funcional / Autenticación",
  },
  {
    name: "refresh_token",
    purpose:
      "Almacena el token de renovación que permite obtener un nuevo access_token sin " +
      "que el usuario deba iniciar sesión nuevamente.",
    duration: "7 días",
    type: "Funcional / Autenticación",
  },
  {
    name: "theme_preference",
    purpose:
      "Guarda la preferencia de tema del usuario (dark/light) para mantenerla entre sesiones.",
    duration: "1 año",
    type: "Preferencias",
  },
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
  return (
    <LegalLayout title="Política de Uso de Cookies" lastUpdated="2026-02-01" version="1.0">
      {/* ── Introducción ───────────────────────────────────── */}
      <p className="text-sm leading-relaxed text-gray-400">
        Esta política explica qué son las cookies, cuáles utiliza{" "}
        <strong className="text-gray-300">NN Auth System</strong>, con qué finalidad y cómo puede el
        usuario gestionarlas o inhabilitarlas.
      </p>
      <p className="text-sm leading-relaxed text-gray-400">
        En la medida en que las cookies almacenen o accedan a datos personales, su tratamiento se
        rige por la <strong className="text-gray-300">Ley 1581 de 2012</strong> y el{" "}
        <strong className="text-gray-300">Decreto 1377 de 2013</strong>, así como por nuestra{" "}
        <a
          href="/privacidad"
          className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          Política de Privacidad
        </a>
        {"."}
      </p>

      {/* ── Secciones legales ─────────────────────────────── */}

      <LegalSection id="que-son" number="1" heading="¿Qué Son las Cookies?">
        <p>
          Las cookies son pequeños archivos de texto que un sitio web almacena en el dispositivo del
          usuario a través del navegador, conforme al estándar{" "}
          <strong className="text-gray-300">RFC 6265</strong>. Permiten que el sitio recuerde
          información entre páginas o visitas (como el estado de sesión o las preferencias).
        </p>
        <p>
          No toda cookie implica seguimiento de la actividad del usuario. Existen cookies
          estrictamente necesarias para el funcionamiento del servicio, sin las cuales el sitio no
          puede operar correctamente.
        </p>
      </LegalSection>

      <LegalSection id="tipos" number="2" heading="Tipos de Cookies que Utiliza el Servicio">
        <p>
          NN Auth System utiliza únicamente cookies propias (first-party). No integra cookies de
          terceros, redes de publicidad, análisis de comportamiento externos ni herramientas de
          rastreo publicitario.
        </p>

        {/* Categorías de cookies */}
        <div className="mt-4 space-y-4">
          {/* Categoría — Funcionales/Autenticación */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <h3 className="mb-1 text-sm font-semibold text-blue-400">
              Cookies Funcionales de Autenticación
            </h3>
            <p>
              Son <strong className="text-gray-300">estrictamente necesarias</strong> para que el
              servicio funcione. Sin ellas, el usuario no puede iniciar sesión ni mantener su sesión
              activa. No requieren consentimiento adicional conforme al principio de necesidad de la
              Ley 1581/2012.
            </p>
            <p className="mt-2">
              Almacenan los tokens JWT (access y refresh) de forma segura, con los atributos{" "}
              <code className="rounded bg-gray-800 px-1 text-xs text-blue-300">HttpOnly</code>,{" "}
              <code className="rounded bg-gray-800 px-1 text-xs text-blue-300">Secure</code> y{" "}
              <code className="rounded bg-gray-800 px-1 text-xs text-blue-300">
                SameSite=Strict
              </code>{" "}
              para prevenir ataques XSS y CSRF, conforme a las recomendaciones del{" "}
              <strong className="text-gray-300">OWASP Top 10</strong>.
            </p>
          </div>

          {/* Categoría — Preferencias */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <h3 className="mb-1 text-sm font-semibold text-blue-400">Cookies de Preferencias</h3>
            <p>
              Guardan configuraciones del usuario (como el tema visual dark/light) para personalizar
              la experiencia sin necesidad de reconfigurar en cada visita. No incluyen datos
              personales identificables.
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="tabla" number="3" heading="Listado Detallado de Cookies">
        <p>
          A continuación se describen todas las cookies establecidas por el Servicio, conforme al
          deber de información del{" "}
          <strong className="text-gray-300">Decreto 1377 de 2013, artículo 13</strong>:
        </p>

        {/* Tabla de cookies — responsive con scroll horizontal en móvil */}
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-900">
              <tr>
                {(["Nombre", "Finalidad", "Duración", "Tipo"] as const).map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                    scope="col"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {SERVICE_COOKIES.map((cookie) => (
                <tr key={cookie.name} className="bg-gray-950 hover:bg-gray-900 transition-colors">
                  <td className="px-4 py-3">
                    <code className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-blue-300">
                      {cookie.name}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{cookie.purpose}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-400">{cookie.duration}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-400">{cookie.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection id="seguridad-cookies" number="4" heading="Seguridad de las Cookies">
        <p>
          Los tokens almacenados en cookies están protegidos con los siguientes atributos de
          seguridad definidos en el <strong className="text-gray-300">RFC 6265bis</strong> y
          recomendados por el OWASP:
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <strong className="text-gray-300">HttpOnly</strong> — la cookie no es accesible desde
            JavaScript del lado del cliente, previniendo ataques XSS (Cross-Site Scripting).
          </li>
          <li>
            <strong className="text-gray-300">Secure</strong> — la cookie solo se transmite por
            conexiones HTTPS, evitando interceptación en redes no seguras.
          </li>
          <li>
            <strong className="text-gray-300">SameSite=Strict</strong> — la cookie no se envía en
            solicitudes cruzadas de sitios, mitigando ataques CSRF.
          </li>
          <li>
            <strong className="text-gray-300">Path=/</strong> — la cookie aplica a todas las rutas
            del servicio.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="gestion" number="5" heading="Gestión y Control de Cookies por el Usuario">
        <p>
          El usuario puede controlar, eliminar o bloquear las cookies del servicio a través de la
          configuración de su navegador. A continuación se indican los procedimientos para los
          navegadores más comunes:
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            <strong className="text-gray-300">Google Chrome:</strong> Configuración → Privacidad y
            seguridad → Cookies y otros datos de sitios.
          </li>
          <li>
            <strong className="text-gray-300">Mozilla Firefox:</strong> Opciones → Privacidad y
            seguridad → Cookies y datos del sitio.
          </li>
          <li>
            <strong className="text-gray-300">Microsoft Edge:</strong> Configuración → Privacidad,
            búsqueda y servicios → Cookies.
          </li>
          <li>
            <strong className="text-gray-300">Safari:</strong> Preferencias → Privacidad → Gestionar
            datos del sitio web.
          </li>
        </ul>
        <p>
          <strong className="text-gray-300">Advertencia:</strong> bloquear las cookies funcionales
          de autenticación impide el inicio de sesión en el Servicio y el acceso a rutas protegidas,
          ya que son técnicamente necesarias para la gestión de la sesión.
        </p>
      </LegalSection>

      <LegalSection
        id="no-tracking"
        number="6"
        heading="Sin Rastreo Publicitario ni Cookies de Terceros"
      >
        <p>
          NN Auth System <strong className="text-gray-300">no utiliza</strong> cookies de terceros,
          pixels de seguimiento, scripts de análisis externo (como Google Analytics) ni ninguna
          tecnología destinada al rastreo del comportamiento del usuario con fines comerciales o
          publicitarios.
        </p>
        <p>
          No se realizan perfiles de usuario basados en el historial de navegación ni se comparte
          información de comportamiento con redes de publicidad, conforme al principio de{" "}
          <strong className="text-gray-300">finalidad</strong> (Art. 4.b, Ley 1581/2012).
        </p>
      </LegalSection>

      <LegalSection
        id="relacion-privacidad"
        number="7"
        heading="Relación con la Política de Privacidad"
      >
        <p>
          Cuando las cookies almacenan o procesan datos personales (como el identificador del
          usuario cifrado en el token JWT), su tratamiento está sujeto a la{" "}
          <a
            href="/privacidad"
            className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            Política de Privacidad y Tratamiento de Datos Personales
          </a>{" "}
          del Servicio, que regula los derechos del titular, las finalidades del tratamiento y los
          plazos de conservación, conforme a la{" "}
          <strong className="text-gray-300">Ley 1581 de 2012</strong>.
        </p>
      </LegalSection>

      <LegalSection id="actualizacion" number="8" heading="Actualización de esta Política">
        <p>
          Esta política puede ser actualizada para reflejar cambios técnicos en el Servicio o
          adaptaciones normativas. La fecha de «última actualización» al inicio del documento indica
          la versión vigente.
        </p>
        <p>
          Para consultas sobre el uso de cookies en el Servicio, puede contactarnos en:{" "}
          <a
            href="mailto:legal@nn-company.co"
            className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            legal@nn-company.co
          </a>
          {"."}
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
