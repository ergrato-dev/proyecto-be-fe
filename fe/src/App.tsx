/**
 * Archivo: App.tsx
 * Descripción: Componente raíz de la aplicación — define el enrutamiento principal.
 * ¿Para qué? Centralizar la estructura de rutas y proveer los contexts globales (theme, auth).
 * ¿Impacto? Sin este componente, la app no tendría navegación ni estructura de páginas.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";

/**
 * ¿Qué? Componente raíz que configura el router y las rutas de la aplicación.
 * ¿Para qué? Definir qué página se muestra según la URL del navegador.
 * ¿Impacto? Es el punto de entrada visual — toda la interfaz se renderiza dentro de este componente.
 */
function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {/* ¿Qué? Contenedor principal con soporte para dark mode */}
        {/* ¿Para qué? Aplicar estilos base y asegurar que el contenido ocupe toda la pantalla */}
        {/* ¿Impacto? Sin este wrapper, el dark mode y el layout base no funcionarían correctamente */}
        <main className="flex flex-1 items-center justify-center">
          <Routes>
            {/* Ruta temporal — será reemplazada por las páginas de auth en Fase 6 */}
            <Route
              path="/"
              element={
                <div className="text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    NN Auth System
                  </h1>
                  <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                    Sistema de autenticación — Fase 5 completada
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                    React + Vite + TypeScript + TailwindCSS
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
