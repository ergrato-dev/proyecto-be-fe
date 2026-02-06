/**
 * Archivo: __tests__/components/ProtectedRoute.test.tsx
 * Descripción: Tests del componente ProtectedRoute — guarda contra acceso no autorizado.
 * ¿Para qué? Verificar que redirige al login si no hay sesión,
 *           muestra spinner durante carga, y renderiza children si autenticado.
 * ¿Impacto? Si ProtectedRoute falla, las rutas privadas quedan expuestas.
 */

import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { mockUser, renderWithProviders } from "../helpers";

describe("ProtectedRoute", () => {
  // ¿Qué? Componente hijo para verificar que se renderiza.
  const ProtectedContent = () => <div>Contenido protegido</div>;
  const LoginFallback = () => <div>Página de login</div>;

  /**
   * ¿Qué? Helper para renderizar ProtectedRoute dentro de Routes.
   * ¿Para qué? Simular el sistema de rutas real con fallback al login.
   */
  function renderProtected(authOverrides = {}) {
    return renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginFallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedContent />
            </ProtectedRoute>
          }
        />
      </Routes>,
      { authContext: authOverrides, initialRoute: "/dashboard" },
    );
  }

  // ¿Qué? Verifica que muestra spinner mientras se valida la sesión.
  it("muestra spinner mientras isLoading es true", () => {
    renderProtected({ isLoading: true });
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que redirige al login si no está autenticado.
  it("redirige a /login si no está autenticado", () => {
    renderProtected({ isAuthenticated: false, isLoading: false });
    expect(screen.getByText("Página de login")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  // ¿Qué? Verifica que renderiza children si está autenticado.
  it("renderiza children si está autenticado", () => {
    renderProtected({
      isAuthenticated: true,
      isLoading: false,
      user: mockUser,
      accessToken: "fake-token",
    });
    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que NO renderiza children durante la carga.
  it("no renderiza children mientras carga", () => {
    renderProtected({ isLoading: true, isAuthenticated: false });
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });
});
