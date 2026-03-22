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
  return (
    <LegalLayout title="Términos de Uso" lastUpdated="2026-02-01" version="1.0">
      {/* ── Introducción ───────────────────────────────────── */}
      <p className="text-sm leading-relaxed text-gray-400">
        Los presentes Términos de Uso regulan el acceso y la utilización del servicio{" "}
        <strong className="text-gray-300">NN Auth System</strong> (en adelante, «el Servicio»),
        operado por{" "}
        <strong className="text-gray-300">
          {RESPONSABLE.nombre} — {RESPONSABLE.nit}
        </strong>
        , con domicilio en {RESPONSABLE.domicilio}.
      </p>
      <p className="text-sm leading-relaxed text-gray-400">
        Al acceder o registrarse en el Servicio, el usuario acepta íntegramente estos Términos. Si
        no está de acuerdo, debe abstenerse de usar el Servicio. De conformidad con el{" "}
        <strong className="text-gray-300">artículo 45 de la Ley 1480 de 2011</strong>, estos
        términos se ponen a disposición antes de celebrar el contrato electrónico.
      </p>

      {/* ── Secciones legales ─────────────────────────────── */}

      <LegalSection id="objeto" number="1" heading="Objeto del Servicio">
        <p>
          NN Auth System es una plataforma de autenticación educativa que ofrece funcionalidades de
          registro de usuarios, inicio de sesión con tokens JWT, cambio y recuperación de
          contraseña, y verificación de correo electrónico.
        </p>
        <p>
          El Servicio es de carácter educativo (Proyecto SENA) y no procesa
          transacciones comerciales ni almacena información financiera de ningún tipo.
        </p>
        <p>
          Conforme a la <strong className="text-gray-300">Ley 527 de 1999</strong> (artículos 10 y
          14), la aceptación de estos Términos mediante clic o acción equivalente tiene plena
          validez jurídica como mensaje de datos.
        </p>
      </LegalSection>

      <LegalSection id="registro" number="2" heading="Registro y Cuenta de Usuario">
        <p>
          Para acceder a las funcionalidades del Servicio, el usuario debe crear una cuenta
          proporcionando los siguientes datos: nombre completo, dirección de correo electrónico y
          contraseña. El usuario declara que los datos suministrados son verídicos, completos y
          actualizados.
        </p>
        <p>
          El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.
          Cualquier uso de la cuenta con las credenciales del usuario es de su exclusiva
          responsabilidad. En caso de uso no autorizado, el usuario debe notificarlo inmediatamente
          a {RESPONSABLE.email}.
        </p>
        <p>
          El registro implica la verificación del correo electrónico mediante un enlace enviado al
          correo registrado. Mientras la cuenta no sea verificada, el acceso a funcionalidades
          protegidas estará restringido.
        </p>
      </LegalSection>

      <LegalSection id="uso-aceptable" number="3" heading="Uso Aceptable">
        <p>
          El usuario se compromete a usar el Servicio exclusivamente con fines lícitos y conforme a
          estos Términos. Son conductas <strong className="text-gray-300">prohibidas</strong>:
        </p>
        <ul className="ml-4 mt-2 list-disc space-y-2">
          <li>
            Intentar acceder a cuentas de otros usuarios o realizar pruebas de fuerza bruta sobre el
            sistema de autenticación.
          </li>
          <li>
            Suministrar datos falsos o de terceros sin su consentimiento expreso durante el
            registro.
          </li>
          <li>
            Realizar ataques de inyección (SQL, XSS, command injection) o cualquier intento de
            comprometer la integridad o disponibilidad del Servicio.
          </li>
          <li>
            Usar herramientas automatizadas para generar solicitudes masivas (ataques DDoS o
            scraping abusivo).
          </li>
          <li>
            Reproducir, modificar o distribuir el código fuente del Servicio sin autorización
            escrita, salvo en el contexto académico del Proyecto SENA autorizado.
          </li>
        </ul>
        <p>
          El incumplimiento de estas obligaciones podrá derivar en la suspensión o cancelación de la
          cuenta, sin perjuicio de las acciones legales correspondientes.
        </p>
      </LegalSection>

      <LegalSection id="propiedad-intelectual" number="4" heading="Propiedad Intelectual">
        <p>
          El código fuente, diseño, logotipos, textos y demás elementos del Servicio son propiedad
          del operador o de sus autores, protegidos por la{" "}
          <strong className="text-gray-300">Ley 23 de 1982</strong> sobre derechos de autor y la
          Decisión Andina 351 de la CAN. Queda prohibida su reproducción total o parcial sin
          autorización expresa.
        </p>
        <p>
          En el contexto del Proyecto SENA , los aprendices y docentes pueden
          utilizar el código con fines estrictamente académicos, citando la fuente original.
        </p>
      </LegalSection>

      <LegalSection id="privacidad" number="5" heading="Tratamiento de Datos Personales">
        <p>
          El tratamiento de los datos personales recolectados por el Servicio se rige por nuestra{" "}
          <a
            href="/privacidad"
            className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            Política de Privacidad
          </a>
          , la cual cumple con la <strong className="text-gray-300">Ley 1581 de 2012</strong> y el{" "}
          <strong className="text-gray-300">Decreto 1377 de 2013</strong>. Al registrarse, el
          usuario otorga autorización expresa para el tratamiento de sus datos conforme a dicha
          política.
        </p>
      </LegalSection>

      <LegalSection id="responsabilidad" number="6" heading="Limitación de Responsabilidad">
        <p>
          El Servicio se presta «tal como está» con fines educativos. El operador no garantiza
          disponibilidad ininterrumpida ni ausencia de errores. En ningún caso el operador será
          responsable por daños indirectos, lucro cesante o pérdida de datos derivados del uso o
          imposibilidad de uso del Servicio.
        </p>
        <p>
          En todo caso, la responsabilidad del operador estará limitada al monto máximo permitido
          por la legislación colombiana vigente, en particular la{" "}
          <strong className="text-gray-300">Ley 1480 de 2011</strong>.
        </p>
      </LegalSection>

      <LegalSection id="modificaciones" number="7" heading="Modificaciones">
        <p>
          El operador se reserva el derecho de modificar estos Términos en cualquier momento. Las
          modificaciones surtirán efecto a partir de su publicación en el Servicio. El uso
          continuado del Servicio tras la publicación de cambios implica la aceptación de los nuevos
          Términos.
        </p>
        <p>
          Para cambios sustanciales, el operador notificará mediante el correo electrónico
          registrado por el usuario, con al menos{" "}
          <strong className="text-gray-300">15 días de antelación</strong>, conforme al artículo 54
          de la Ley 1480 de 2011.
        </p>
      </LegalSection>

      <LegalSection id="ley-aplicable" number="8" heading="Ley Aplicable y Jurisdicción">
        <p>
          Estos Términos se rigen por las leyes de la{" "}
          <strong className="text-gray-300">República de Colombia</strong>. Cualquier controversia
          derivada de su interpretación o ejecución será resuelta por los tribunales competentes con
          sede en Bogotá D.C., previa instancia de conciliación ante un Centro de Conciliación
          autorizado por el Ministerio de Justicia y del Derecho.
        </p>
        <p>
          Para contratos electrónicos celebrados con consumidores colombianos, también aplican las
          disposiciones de la <strong className="text-gray-300">Ley 527 de 1999</strong> sobre
          mensajes de datos y comercio electrónico.
        </p>
      </LegalSection>

      <LegalSection id="contacto" number="9" heading="Contacto">
        <p>
          Para cualquier consulta, reclamación o ejercicio de derechos relacionados con estos
          Términos, puede comunicarse con el operador a través de:
        </p>
        <address className="not-italic">
          <ul className="mt-2 space-y-1">
            <li>
              <strong className="text-gray-300">Empresa:</strong> {RESPONSABLE.nombre} —{" "}
              {RESPONSABLE.nit}
            </li>
            <li>
              <strong className="text-gray-300">Correo electrónico:</strong>{" "}
              <a
                href={`mailto:${RESPONSABLE.email}`}
                className="text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                {RESPONSABLE.email}
              </a>
            </li>
            <li>
              <strong className="text-gray-300">Domicilio:</strong> {RESPONSABLE.domicilio}
            </li>
          </ul>
        </address>
      </LegalSection>
    </LegalLayout>
  );
}
