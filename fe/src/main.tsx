/**
 * Archivo: main.tsx
 * Descripción: Punto de entrada de la aplicación React.
 * ¿Para qué? Monta el componente raíz (App) en el elemento #root del DOM,
 *            inicializa el sistema de i18n y configura el modo estricto de React.
 * ¿Impacto? Sin este archivo, React no se inicializaría y la pantalla quedaría en blanco.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// ¿Qué? Importar la configuración de i18next ANTES de App.
// ¿Para qué? Garantizar que el motor de traducción esté inicializado antes de que
//            cualquier componente intente usar useTranslation().
//            El import tiene el efecto secundario de llamar a i18n.init() al ejecutarse.
// ¿Impacto? Si App importara antes que i18n, los primeros renders usarían la clave
//            literal en lugar del texto traducido (ej: "auth.login.title" en pantalla).
import "./i18n";

import App from "./App";

// ¿Qué? Renderiza la app React dentro del elemento HTML con id="root".
// ¿Para qué? StrictMode activa validaciones adicionales en desarrollo (detecta bugs).
// ¿Impacto? Si se omite StrictMode, errores sutiles podrían pasar desapercibidos.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
