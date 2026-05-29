/**
 * Archivo: components/layout/AppShell.tsx
 * Descripción: Shell principal para la zona autenticada — sidebar colapsible + área de contenido.
 * ¿Para qué? Proveer navegación lateral, identidad de marca y controles de preferencias
 *            para todas las páginas que requieren sesión activa.
 * ¿Impacto? Reemplaza el layout de navbar superior por un patrón de aplicación más moderno
 *           con sidebar colapsible, permitiendo más espacio horizontal para contenido tabular.
 */

import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  ShieldCheck,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { NNAuthLogo } from "@/pages/LandingPage";

interface AppShellProps {
  children: ReactNode;
}

// ¿Qué? Definición declarativa de los ítems de navegación del sidebar.
// ¿Para qué? Separar la estructura del menú del JSX de renderizado, facilitando agregar o quitar ítems.
// ¿Impacto? Cambiar el menú no requiere modificar el HTML del sidebar — solo este array.
const NAV_ITEMS = [
  {
    icon: LayoutDashboard,
    labelKey: "nav.sidebar.dashboard",
    href: "/dashboard",
    enabled: true,
  },
  {
    icon: Users,
    labelKey: "nav.sidebar.employees",
    href: null,
    enabled: false,
  },
  {
    icon: Package,
    labelKey: "nav.sidebar.products",
    href: null,
    enabled: false,
  },
  {
    icon: BarChart3,
    labelKey: "nav.sidebar.reports",
    href: null,
    enabled: false,
  },
  {
    icon: ShieldCheck,
    labelKey: "nav.sidebar.security",
    href: "/change-password",
    enabled: true,
  },
] as const;

/**
 * ¿Qué? Layout principal para páginas autenticadas con sidebar colapsible siempre oscuro.
 * ¿Para qué? Proveer estructura visual consistente — navegación a la izquierda, contenido a la derecha.
 * ¿Impacto? El sidebar es siempre dark (bg-gray-950) independientemente del tema de la app,
 *           lo que crea un contraste visual claro entre navegación y área de trabajo.
 */
export function AppShell({ children }: AppShellProps) {
  // ¿Qué? Estado booleano que controla si el sidebar está colapsado (solo íconos) o expandido.
  // ¿Para qué? Dar al usuario control sobre el espacio horizontal disponible para el contenido.
  // ¿Impacto? Al colapsar, el sidebar pasa de w-60 a w-16, liberando ~176px de ancho.
  const [collapsed, setCollapsed] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* ════════════════════════════════════════════════════
          SIDEBAR — navegación lateral siempre oscura
          ════════════════════════════════════════════════════ */}
      <aside
        className={`
          flex shrink-0 flex-col bg-gray-950
          transition-[width] duration-200 ease-in-out
          ${collapsed ? "w-16" : "w-60"}
        `}
      >
        {/* ── Logo / wordmark ── */}
        <div
          className={`
            flex h-14 shrink-0 items-center border-b border-gray-800
            ${collapsed ? "justify-center px-0" : "gap-3 px-4"}
          `}
        >
          <NNAuthLogo size={26} />
          {!collapsed && (
            <span className="truncate text-sm font-semibold text-gray-100">NN Auth System</span>
          )}
        </div>

        {/* ── Ítems de navegación ── */}
        {/*
          ¿Qué? Lista de ítems de navegación con soporte para rutas reales y placeholders.
          ¿Para qué? Mostrar las secciones disponibles de la aplicación y las que vendrán.
          ¿Impacto? Los ítems deshabilitados muestran un indicador "pronto" cuando el sidebar
                     está expandido, o el título completo en tooltip cuando está colapsado.
        */}
        <nav className="flex-1 overflow-y-auto py-3" aria-label="Navegación de la aplicación">
          <ul className="space-y-0.5 px-2" role="list">
            {NAV_ITEMS.map(({ icon: Icon, labelKey, href, enabled }) => {
              const label = t(labelKey);

              // Ítem con ruta real → NavLink detecta el estado activo automáticamente
              if (enabled && href) {
                return (
                  <li key={labelKey}>
                    <NavLink
                      to={href}
                      title={collapsed ? label : undefined}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors
                        ${collapsed ? "justify-center" : ""}
                        ${
                          isActive
                            ? "bg-accent-600/20 text-accent-400"
                            : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                        }`
                      }
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </NavLink>
                  </li>
                );
              }

              // Ítem placeholder (funcionalidad próxima) → div no interactivo
              return (
                <li key={labelKey}>
                  <div
                    className={`
                      flex cursor-not-allowed items-center gap-3 rounded-lg px-2.5 py-2
                      text-sm font-medium text-gray-700
                      ${collapsed ? "justify-center" : ""}
                    `}
                    title={collapsed ? `${label} — ${t("nav.sidebar.comingSoon")}` : undefined}
                    aria-disabled="true"
                    role="presentation"
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {!collapsed && (
                      <span className="flex flex-1 items-center justify-between">
                        <span className="truncate">{label}</span>
                        <span className="ml-2 shrink-0 rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-normal text-gray-600">
                          {t("nav.sidebar.comingSoon")}
                        </span>
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Usuario + cerrar sesión ── */}
        <div className="border-t border-gray-800 px-2 py-3">
          {!collapsed && user && (
            <div className="mb-2 rounded-lg bg-gray-900 px-3 py-2">
              <p className="truncate text-xs font-semibold text-gray-100">
                {user.first_name} {user.last_name}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? t("nav.logout") : undefined}
            className={`
              flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium
              text-gray-400 transition-colors hover:bg-gray-800 hover:text-red-400
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!collapsed && <span>{t("nav.logout")}</span>}
          </button>
        </div>

        {/* ── Botón de colapsar/expandir ──
            ¿Qué? Botón al fondo del sidebar que alterna entre estado colapsado y expandido.
            ¿Para qué? Dar al usuario control explícito sobre el espacio de navegación.
            ¿Impacto? Al colapsar se liberan ~176px de ancho para el área de contenido.
        */}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex h-9 w-full shrink-0 items-center justify-center border-t border-gray-800
            text-gray-600 transition-colors hover:bg-gray-900 hover:text-gray-400"
          aria-label={collapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </aside>

      {/* ════════════════════════════════════════════════════
          ÁREA PRINCIPAL — topbar + contenido de la página
          ════════════════════════════════════════════════════ */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar — controles de preferencias */}
        {/*
          ¿Qué? Barra superior minimalista con selector de idioma y alternador de tema.
          ¿Para qué? Mantener acceso rápido a preferencias sin ocupar el área de navegación lateral.
          ¿Impacto? El sidebar oscuro fijo + esta barra clara crean jerarquía visual clara.
        */}
        <header
          className="flex h-14 shrink-0 items-center justify-end gap-2 border-b border-gray-200
            bg-white px-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <LanguageSwitcher />
          <ThemeToggle />
        </header>

        {/* Área de contenido — renderiza la página activa */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-5 py-7">{children}</div>
        </main>
      </div>
    </div>
  );
}
