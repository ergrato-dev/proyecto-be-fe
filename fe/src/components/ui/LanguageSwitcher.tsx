/**
 * Archivo: components/ui/LanguageSwitcher.tsx
 * Descripción: Selector de idioma para cambiar entre español e inglés en tiempo real.
 * ¿Para qué? Permitir al usuario cambiar el idioma de la interfaz sin recargar la página,
 *            persistiendo la preferencia en localStorage y sincronizando con el backend.
 * ¿Impacto? Es el punto de entrada del usuario al sistema i18n. Sin este componente,
 *            el idioma solo se cambiaría modificando localStorage manualmente.
 *
 * Conceptos i18n pedagógicos en este componente:
 *   - useTranslation(): hook de react-i18next que provee t() e i18n.
 *   - i18n.changeLanguage(locale): cambia el idioma de toda la app al instante.
 *   - i18n.language: idioma actualmente activo (ej: "es" o "en").
 *   - Los textos del selector se muestran en el idioma PROPIO de cada opción,
 *     no en el idioma activo (por eso siempre ves "Español" y "English").
 */

import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { updateLocale } from "@/api/auth";

// ¿Qué? Tipo que define los idiomas soportados por el sistema.
// ¿Para qué? TypeScript garantiza que solo se puedan usar "es" o "en".
// ¿Impacto? Si en el futuro se agrega "pt", solo hay que agregar aquí y en los archivos de traducción.
type SupportedLocale = "es" | "en";

// ¿Qué? Configuración declarativa de los idiomas disponibles.
// ¿Para qué? Centralizar los datos de cada opción — etiqueta, código y accesibilidad.
// ¿Impacto? Para agregar un nuevo idioma, solo se agrega un objeto a este array.
const SUPPORTED_LOCALES: Array<{ code: SupportedLocale; label: string; langAttr: string }> = [
  // ¿Qué? langAttr es el valor del atributo HTML `lang` para esta opción.
  // ¿Para qué? WCAG 3.1.2 Language of Parts — lectores de pantalla usan este atributo
  //            para pronunciar correctamente en el idioma de la opción.
  // ¿Impacto? Sin lang, NVDA/VoiceOver pronunciaría "Español" con acento del idioma activo.
  { code: "es", label: "Español", langAttr: "es" },
  { code: "en", label: "English", langAttr: "en" },
];

/**
 * ¿Qué? Componente selector de idioma con dos opciones: Español / English.
 * ¿Para qué? Cambiar el idioma de la interfaz y persistir la preferencia.
 * ¿Impacto? Integrado en la Navbar — accesible desde cualquier página de la app.
 *            La lógica de sincronización con el backend es transparente al usuario.
 */
export function LanguageSwitcher() {
  // ¿Qué? Hook de react-i18next que da acceso a t() (función de traducción) e i18n (instancia).
  // ¿Para qué? t() para los textos accesibles; i18n.language para saber el idioma activo.
  // ¿Impacto? Al llamar i18n.changeLanguage(), React re-renderiza los componentes con useTranslation().
  const { i18n, t } = useTranslation();

  // ¿Qué? Hook de autenticación para saber si el usuario está logueado.
  // ¿Para qué? Solo sincronizamos el locale con el backend si hay sesión activa.
  //            Un usuario anónimo solo guarda en localStorage.
  // ¿Impacto? Separar los casos anónimo y autenticado evita llamadas API innecesarias
  //            y errores 401 cuando no hay sesión.
  const { isAuthenticated } = useAuth();

  /**
   * ¿Qué? Maneja el cambio de idioma al hacer clic en una opción.
   * ¿Para qué? Ejecuta la cadena completa del cambio de idioma:
   *   1. Evitar cambios innecesarios si ya está en ese idioma.
   *   2. Cambiar i18next (actualiza la UI al instante + guarda en localStorage).
   *   3. Si el usuario está autenticado, sincronizar con el backend.
   * ¿Impacto? El cambio en la UI es INMEDIATO (sin esperar la respuesta del backend).
   *            Si la llamada API falla (red caída, token expirado), el cambio en UI persiste
   *            — el usuario ya eligió su idioma y eso debe respetarse.
   */
  const handleLanguageChange = async (locale: SupportedLocale) => {
    // ¿Qué? Evitar operación innecesaria si el idioma ya está activo.
    // ¿Para qué? Optimización — sin este check, cada clic dispararía i18n.changeLanguage()
    //            aunque el idioma sea el mismo.
    // ¿Impacto? Mejora rendimiento y evita llamadas API duplicadas.
    if (i18n.language === locale) return;

    // ¿Qué? Cambiar el idioma en i18next.
    // ¿Para qué? i18n.changeLanguage() hace tres cosas automáticamente:
    //   1. Actualiza i18n.language al nuevo locale.
    //   2. Guarda en localStorage["i18nextLng"] = locale (via LanguageDetector).
    //   3. Dispara re-render en todos los componentes que usan useTranslation().
    // ¿Impacto? La UI cambia de idioma en menos de 16ms (el tiempo de un frame).
    await i18n.changeLanguage(locale);

    // ¿Qué? Sincronizar la preferencia con el backend si hay sesión activa.
    // ¿Para qué? Persistir en la BD para que otros dispositivos restauren el idioma al hacer login.
    // ¿Impacto? Error silencioso con catch vacío — un fallo en esta sincronización
    //            NO debe impedir que el cambio de idioma se aplique en la UI.
    //            OWASP A09: registrar el error sería ideal, pero no bloquearlo.
    if (isAuthenticated) {
      try {
        await updateLocale(locale);
      } catch {
        // ¿Qué? Error silencioso — no reverter el cambio de idioma si falla la API.
        // ¿Para qué? El usuario eligió su idioma — su elección debe respetarse
        //            independientemente del estado del servidor.
        // ¿Impacto? La preferencia está en localStorage (persiste). La BD se sincronizará
        //            la próxima vez que el usuario tenga conexión y cambie idioma.
      }
    }
  };

  // ¿Qué? Extraer el base-language code (ej: "es-CO" → "es", "en-US" → "en").
  // ¿Para qué? i18n.language puede retornar el locale completo del navegador.
  //            Normalizamos a los dos caracteres base para comparar correctamente.
  // ¿Impacto? Sin esto, i18n.language === "en" fallaría cuando el valor es "en-US".
  const currentLocale = i18n.language?.split("-")[0] as SupportedLocale;

  return (
    // ¿Qué? Contenedor del selector con aria-label para accesibilidad.
    // ¿Para qué? WCAG 1.3.1 — el propósito del grupo debe ser identificable por tecnologías asistivas.
    // ¿Impacto? Los lectores de pantalla anuncian "Selector de idioma" al entrar al grupo.
    <div
      className="flex items-center gap-1 rounded-lg border border-gray-200 p-1 dark:border-gray-700"
      role="group"
      aria-label={t("language.selector")}
    >
      {SUPPORTED_LOCALES.map((locale) => {
        // ¿Qué? Determinar si esta opción es el idioma activo.
        // ¿Para qué? Resaltar visualmente el idioma seleccionado.
        // ¿Impacto? El usuario siempre sabe qué idioma está activo sin necesidad de texto adicional.
        const isActive = currentLocale === locale.code;

        return (
          <button
            key={locale.code}
            onClick={() => void handleLanguageChange(locale.code)}
            // ¿Qué? lang attribute en el botón.
            // ¿Para qué? WCAG 3.1.2 — el lector de pantalla pronuncia la etiqueta
            //            en el idioma del botón (ej: "Español" con pronunciación española).
            // ¿Impacto? Sin esto, "Español" se pronunciaría con el acento del idioma activo.
            lang={locale.langAttr}
            // ¿Qué? aria-pressed indica si el idioma está activo (patrón toggle button).
            // ¿Para qué? WCAG 4.1.2 — el estado del botón es comunicado a tecnologías asistivas.
            // ¿Impacto? Un usuario con lector de pantalla escucha "Español, seleccionado" o
            //            "English, no seleccionado" — sin esto, no sabría cuál está activo.
            aria-pressed={isActive}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              isActive
                ? "bg-accent-600 text-white dark:bg-accent-500"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {locale.label}
          </button>
        );
      })}
    </div>
  );
}
