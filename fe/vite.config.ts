/**
 * Archivo: vite.config.ts
 * Descripción: Configuración de Vite — bundler y servidor de desarrollo.
 * ¿Para qué? Definir plugins (React, TailwindCSS), alias de paths y opciones del servidor.
 * ¿Impacto? Sin esta configuración, Vite no sabría cómo procesar JSX, TypeScript ni TailwindCSS.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// ¿Qué? Configuración principal de Vite con plugins y alias.
// ¿Para qué? React para JSX, TailwindCSS para estilos utility-first, alias para imports limpios.
// ¿Impacto? Permite usar `@/` como alias a `src/`, simplificando imports entre módulos.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
