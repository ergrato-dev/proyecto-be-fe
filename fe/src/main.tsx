/**
 * Archivo: main.tsx
 * Descripción: Punto de entrada de la aplicación React.
 * ¿Para qué? Monta el componente raíz (App) en el elemento #root del DOM.
 * ¿Impacto? Sin este archivo, React no se inicializaría y la pantalla quedaría en blanco.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// ¿Qué? Renderiza la app React dentro del elemento HTML con id="root".
// ¿Para qué? StrictMode activa validaciones adicionales en desarrollo (detecta bugs).
// ¿Impacto? Si se omite StrictMode, errores sutiles podrían pasar desapercibidos.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
