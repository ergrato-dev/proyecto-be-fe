/**
 * Archivo: __tests__/pages/DashboardPage.test.tsx
 * Descripción: Tests de la página de dashboard — información del perfil y acciones.
 * ¿Para qué? Verificar que el usuario autenticado ve su info correctamente.
 * ¿Impacto? Es la pantalla principal post-login — debe reflejar datos del usuario.
 */

import { screen } from "@testing-library/react";
import { DashboardPage } from "@/pages/DashboardPage";
import { renderWithProviders, mockUser } from "../helpers";

describe("DashboardPage", () => {
  // ¿Qué? Verifica que se muestra el saludo con el nombre del usuario.
  it("muestra el nombre del usuario en el saludo", () => {
    renderWithProviders(<DashboardPage />, {
      authContext: { user: mockUser, isAuthenticated: true },
    });

    expect(screen.getByText(`Bienvenido, ${mockUser.full_name}`)).toBeInTheDocument();
  });

  // ¿Qué? Verifica que se muestra el email del usuario.
  it("muestra el correo del usuario", () => {
    renderWithProviders(<DashboardPage />, {
      authContext: { user: mockUser, isAuthenticated: true },
    });

    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  // ¿Qué? Verifica que se muestra el estado "Activo".
  it("muestra el estado activo del usuario", () => {
    renderWithProviders(<DashboardPage />, {
      authContext: { user: mockUser, isAuthenticated: true },
    });

    expect(screen.getByText("Activo")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que se muestra la fecha de registro formateada.
  // ¿Para qué? Confirmar que el componente formatea la fecha correctamente.
  // ¿Impacto? La fecha depende de la zona horaria del entorno de test.
  it("muestra la fecha de registro formateada", () => {
    // Usar una fecha que no cambie de día por diferencia horaria UTC
    const userWithSafeDate = { ...mockUser, created_at: "2026-06-15T12:00:00Z" };
    renderWithProviders(<DashboardPage />, {
      authContext: { user: userWithSafeDate, isAuthenticated: true },
    });

    // Esperamos el mes junio y el año 2026 en el texto
    const dateCell = screen.getByText(/junio/i);
    expect(dateCell).toBeInTheDocument();
    expect(dateCell.textContent).toContain("2026");
  });

  // ¿Qué? Verifica que existe enlace a cambiar contraseña.
  it("tiene enlace a cambiar contraseña", () => {
    renderWithProviders(<DashboardPage />, {
      authContext: { user: mockUser, isAuthenticated: true },
    });

    expect(screen.getByText("Cambiar contraseña")).toBeInTheDocument();
  });

  // ¿Qué? Verifica estado "Inactivo" para usuarios desactivados.
  it("muestra Inactivo si el usuario no está activo", () => {
    renderWithProviders(<DashboardPage />, {
      authContext: { user: { ...mockUser, is_active: false }, isAuthenticated: true },
    });

    expect(screen.getByText("Inactivo")).toBeInTheDocument();
  });
});
