/**
 * Archivo: components/layout/AppLayout.tsx
 * Descripción: Layout principal para páginas autenticadas (con navbar).
 * ¿Para qué? Proveer estructura con navbar + contenido para Dashboard, ChangePassword, etc.
 * ¿Impacto? Sin este layout, las páginas autenticadas no tendrían navegación ni cierre de sesión.
 */

import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

// ¿Qué? Props opcionales para permitir pasar children directamente al layout.
// ¿Para qué? Soportar dos patrones de uso: rutas anidadas (Outlet) y children directos.
// ¿Impacto? Si se pasan children, los renderiza en lugar de Outlet (evita conflictos de routing).
interface AppLayoutProps {
  children?: ReactNode;
}

/**
 * ¿Qué? Layout con barra de navegación y slot para el contenido de la página.
 * ¿Para qué? Envolver todas las rutas protegidas con el navbar y estructura común.
 * ¿Impacto? Acepta children directos o usa <Outlet /> para rutas anidadas.
 */
export function AppLayout({ children }: AppLayoutProps = {}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      {/* ¿Qué? Contenedor del contenido principal con max-width y padding. */}
      {/* ¿Para qué? Centrar el contenido y darle espaciado responsivo. */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
