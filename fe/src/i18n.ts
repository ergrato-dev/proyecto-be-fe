/**
 * Archivo: i18n.ts
 * Descripción: Configuración central de i18next para el sistema de internacionalización (i18n).
 * ¿Para qué? Inicializar el motor de traducción con los recursos de cada idioma,
 *            el detector de idioma del navegador y el comportamiento de fallback.
 * ¿Impacto? Sin este archivo, react-i18next no sabría qué traducciones usar ni en qué idioma.
 *            Este archivo se importa en main.tsx (punto de entrada) para que i18next
 *            esté listo antes de que cualquier componente se renderice.
 *
 * Conceptos pedagógicos:
 *   - i18n (internacionalización): preparar el código para soporte multiidioma SIN cambiar código.
 *   - l10n (localización): los archivos JSON con las traducciones (src/locales/es/ y src/locales/en/).
 *   - locale: código de idioma estándar ISO 639-1 (ej: "es" para español, "en" para inglés).
 *   - fallback: idioma al que se recurre cuando una clave no tiene traducción en el idioma activo.
 *   - namespace: agrupación lógica de traducciones (usamos "translation" como namespace único).
 */

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// ¿Qué? Importar los archivos JSON de traducción directamente (recursos estáticos).
// ¿Para qué? Cargar todas las traducciones en memoria al iniciar la app.
//            En proyectos grandes se usaría lazy-loading, pero para aprendizaje
//            esta forma es más directa y entendible.
// ¿Impacto? Ambos idiomas están disponibles al instante — sin peticiones HTTP adicionales.
import esTranslation from "./locales/es/translation.json";
import enTranslation from "./locales/en/translation.json";

// ¿Qué? Objeto de recursos con las traducciones de cada idioma.
// ¿Para qué? Centralizar los recursos antes de pasarlos a i18n.init().
// ¿Impacto? Para agregar un tercer idioma (ej: "pt") bastaría con importar su JSON aquí
//           y agregarlo al objeto resources. Sin cambios en los componentes.
const resources = {
  es: {
    // ¿Qué? El "namespace" es la categoría de traducciones (usamos "translation" por defecto).
    // ¿Para qué? En proyectos grandes, diferentes módulos tienen namespaces separados
    //            (ej: "auth", "admin", "dashboard"). Aquí usamos uno solo para simplificar.
    // ¿Impacto? Al usar t("auth.login.title"), i18next busca en resources.es.translation.auth.login.title.
    translation: esTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

// ¿Qué? Inicialización de i18next con plugins y configuración.
// ¿Para qué? Configurar el motor de traducción con:
//   1. LanguageDetector: detecta automáticamente el idioma del navegador
//   2. initReactI18next: integra i18next con el sistema de hooks de React
// ¿Impacto? El orden de .use() importa — LanguageDetector debe ir antes de initReactI18next.
i18n
  // ¿Qué? Plugin que detecta el idioma del usuario automáticamente.
  // ¿Para qué? Lee (en orden de prioridad):
  //   1. localStorage["i18nextLng"] — preferencia guardada previamente
  //   2. navigator.language — idioma configurado en el navegador
  //   3. Fallback a "es" si ninguno de los anteriores está soportado
  // ¿Impacto? La primera vez que un usuario visita la app, ve el idioma de su navegador.
  //            Las visitas siguientes mantienen el último idioma seleccionado.
  .use(LanguageDetector)

  // ¿Qué? Plugin que conecta i18next con React.
  // ¿Para qué? Habilita el hook useTranslation() en los componentes React.
  //            Sin este plugin, i18next funcionaría pero los componentes no re-renderizarían
  //            al cambiar de idioma.
  // ¿Impacto? Gracias a initReactI18next, un cambio de idioma → React re-renderiza los
  //            componentes que usan useTranslation() automáticamente.
  .use(initReactI18next)

  // ¿Qué? Inicialización sincrónica con la configuración completa.
  // ¿Para qué? Definir todos los parámetros de comportamiento del sistema i18n.
  // ¿Impacto? void porque no necesitamos manejar la promesa — los recursos son estáticos
  //           y están disponibles de inmediato (no hay carga asíncrona de archivos).
  .init({
    resources,

    // ¿Qué? Idioma por defecto si el detector no encuentra una preferencia guardada
    //        o si detecta un idioma no soportado (ej: "fr", "de").
    // ¿Para qué? El proyecto es de contexto colombiano (SENA) → español por defecto.
    // ¿Impacto? Un usuario con navegador en francés verá la app en español al entrar por primera vez.
    fallbackLng: "es",

    // ¿Qué? Namespace por defecto al llamar t("clave") sin especificar namespace.
    // ¿Para qué? Simplificación pedagógica — no hay que hacer t("translation:clave"),
    //            solo t("clave") y i18next busca en el namespace "translation".
    // ¿Impacto? Todos los componentes usan el mismo namespace — simple y consistente.
    defaultNS: "translation",

    // ¿Qué? Desactiva el modo debug en producción (actívalo con "true" para ver logs en consola).
    // ¿Para qué? En desarrollo, debug: true muestra en consola qué claves se cargan y cuáles faltan.
    // ¿Impacto? En producción, false evita llenar la consola con mensajes innecesarios.
    debug: false,

    // ¿Qué? Configuración del detector de idioma.
    // ¿Para qué? Controlar el orden en que se busca la preferencia de idioma.
    // ¿Impacto? "localStorage" primero: respeta la elección del usuario.
    //            "navigator" segundo: usa el idioma del sistema si no hay elección previa.
    //            "htmlTag" tercero: lee el atributo lang del <html> como último recurso.
    detection: {
      // ¿Qué? Orden de fuentes donde buscar el idioma preferido del usuario.
      // ¿Para qué? localStorage es la preferencia guardada; navigator es el idioma del S.O.
      // ¿Impacto? localStorage tiene más prioridad — la elección explícita del usuario
      //            supera la configuración del sistema operativo.
      order: ["localStorage", "navigator", "htmlTag"],

      // ¿Qué? Clave de localStorage donde se guarda el locale.
      // ¿Para qué? Cuando el usuario cambia idioma, se guarda en esta clave.
      //            Al recargar la página, el detector lee esta clave primero.
      // ¿Impacto? Cambiar este valor invalidaría las preferencias guardadas de todos los usuarios.
      lookupLocalStorage: "i18nextLng",

      // ¿Qué? Guarda automáticamente el idioma detectado en localStorage.
      // ¿Para qué? Así la siguiente visita recuerda el idioma sin volver a detectarlo.
      // ¿Impacto? El usuario siempre ve el mismo idioma entre sesiones en el mismo navegador.
      caches: ["localStorage"],
    },

    // ¿Qué? Desactiva el modo de escape de HTML en los valores.
    // ¿Para qué? react-i18next maneja el escape de HTML por React — este flag evita
    //            doble escape que convierte caracteres como "&amp;" en literal en pantalla.
    // ¿Impacto? Sin interpolation.escapeValue: false, los textos con "&" o "<" se verían
    //            como "&amp;" y "&lt;" en la interfaz.
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
