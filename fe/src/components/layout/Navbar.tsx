/**
 * Archivo: components/layout/Navbar.tsx
 * Descripción: Barra de navegación superior con logo, selector de idioma, toggle de tema y logout.
 * ¿Para qué? Proveer navegación consistente y acceso al toggle dark/light y cambio de idioma.
 * ¿Impacto? Sin navbar, el usuario no tendría forma de cerrar sesión, cambiar tema ni idioma.
 */

import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

/**
 * ¿Qué? Barra de navegación con logo, nombre de usuario, toggle de tema, selector de idioma y logout.
 * ¿Para qué? Presente en todas las páginas autenticadas (Dashboard, ChangePassword, etc.).
 * ¿Impacto? Diseño: fondo sólido (sin degradado), bordes sutiles, botones a la derecha.
 */
export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  // ¿Qué? Hook de traducción para los textos de la navbar.
  // ¿Para qué? Los textos "Salir" / "Sign out", "NN Auth" son traducibles.
  // ¿Impacto? Al cambiar idioma, la navbar se actualiza automáticamente sin recarga.
  const { t } = useTranslation();

  /**
   * ¿Qué? Handler de logout — cierra sesión y redirige al login.
   * ¿Para qué? Limpiar tokens y enviar al usuario a la página de login.
   * ¿Impacto? Sin la redirección, el usuario quedaría en una página protegida sin sesión.
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    // ¿Qué? aria-label en <nav> para identificarla como "navegación principal".
    // ¿Para qué? WCAG 2.4.1 — cuando una página tiene múltiples elementos <nav>
    //            (ej: navbar + paginación en la tabla), el lector de pantalla no puede
    //            distinguirlas sin un aria-label. Con él, el usuario escucha
    //            "Navegación principal" y sabe exactamente dónde está.
    // ¿Impacto? Sin aria-label, NVDA/VoiceOver anuncian solo "nav" para todas las
    //           instancias, confundiendo al usuario al navegar por landmarks.
    <nav
      aria-label="Navegación principal"
      className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ¿Qué? Logo/nombre de la app — enlace al dashboard o login. */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {t("nav.brand")}
        </Link>

        {/* ¿Qué? Acciones de la derecha: info del usuario, toggle de tema, selector de idioma y logout. */}
        {/* ¿Para qué? Agrupar acciones secundarias y los controles de preferencias juntos. */}
        {/* ¿Impacto? Botones alineados a la derecha según las reglas de diseño. */}
        <div className="flex items-center gap-3">
          {/* ¿Qué? Selector de idioma accesible con Español / English. */}
          {/* ¿Para qué? Permite cambiar el idioma de toda la interfaz sin recargar. */}
          {/* ¿Impacto? Usa i18n.changeLanguage() → todos los componentes se actualizan al instante. */}
          <LanguageSwitcher />

          <ThemeToggle />

          {isAuthenticated && user && (
            <>
              {/* ¿Qué? Nombre del usuario autenticado. */}
              <span className="hidden text-sm text-gray-600 dark:text-gray-400 sm:block">
                {user.first_name} {user.last_name}
              </span>

              {/* ¿Qué? Botón de cerrar sesión con icono de Lucide y texto traducible. */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {t("nav.logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
