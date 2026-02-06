/**
 * Archivo: __tests__/pages/ChangePasswordPage.test.tsx
 * Descripción: Tests de la página de cambio de contraseña — validación, envío, mensajes.
 * ¿Para qué? Asegurar que el usuario autenticado puede cambiar su contraseña correctamente.
 * ¿Impacto? Funcionalidad de seguridad crítica — debe validar la contraseña actual.
 */

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChangePasswordPage } from "@/pages/ChangePasswordPage";
import { renderWithProviders, mockUser } from "../helpers";

describe("ChangePasswordPage", () => {
  // ¿Qué? Verifica que el formulario se renderiza completo.
  it("renderiza el formulario de cambio de contraseña", () => {
    renderWithProviders(<ChangePasswordPage />, {
      authContext: { user: mockUser, isAuthenticated: true },
    });

    expect(screen.getByText("Cambiar contraseña")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña actual")).toBeInTheDocument();
    expect(screen.getByLabelText("Nueva contraseña")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar nueva contraseña")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
  });

  // ¿Qué? Verifica que existe botón para cancelar (volver al dashboard).
  it("tiene botón de cancelar", () => {
    renderWithProviders(<ChangePasswordPage />, {
      authContext: { user: mockUser, isAuthenticated: true },
    });

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  });

  // ¿Qué? Verifica validación de contraseña actual vacía.
  it("muestra error si la contraseña actual está vacía", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePasswordPage />, {
      authContext: { user: mockUser, isAuthenticated: true },
    });

    await user.type(screen.getByLabelText("Nueva contraseña"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirmar nueva contraseña"), "NewPass1!");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText("La contraseña actual es obligatoria")).toBeInTheDocument();
  });

  // ¿Qué? Verifica validación de contraseña nueva débil.
  it("muestra error si la nueva contraseña es muy corta", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePasswordPage />, {
      authContext: { user: mockUser, isAuthenticated: true },
    });

    await user.type(screen.getByLabelText("Contraseña actual"), "OldPass1");
    await user.type(screen.getByLabelText("Nueva contraseña"), "Aa1");
    await user.type(screen.getByLabelText("Confirmar nueva contraseña"), "Aa1");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText("Mínimo 8 caracteres")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que las contraseñas nuevas deben coincidir.
  it("muestra error si las contraseñas nuevas no coinciden", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePasswordPage />, {
      authContext: { user: mockUser, isAuthenticated: true },
    });

    await user.type(screen.getByLabelText("Contraseña actual"), "OldPass1");
    await user.type(screen.getByLabelText("Nueva contraseña"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirmar nueva contraseña"), "Different1");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText("Las contraseñas no coinciden")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que changePassword() se ejecuta con datos correctos.
  it("ejecuta changePassword al enviar formulario válido", async () => {
    const changePasswordMock = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders(<ChangePasswordPage />, {
      authContext: {
        user: mockUser,
        isAuthenticated: true,
        changePassword: changePasswordMock,
      },
    });

    await user.type(screen.getByLabelText("Contraseña actual"), "OldPass1");
    await user.type(screen.getByLabelText("Nueva contraseña"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirmar nueva contraseña"), "NewPass1!");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(changePasswordMock).toHaveBeenCalledWith({
      current_password: "OldPass1",
      new_password: "NewPass1!",
    });
  });

  // ¿Qué? Verifica que muestra mensaje de éxito tras cambio exitoso.
  it("muestra mensaje de éxito al cambiar contraseña", async () => {
    const changePasswordMock = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders(<ChangePasswordPage />, {
      authContext: {
        user: mockUser,
        isAuthenticated: true,
        changePassword: changePasswordMock,
      },
    });

    await user.type(screen.getByLabelText("Contraseña actual"), "OldPass1");
    await user.type(screen.getByLabelText("Nueva contraseña"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirmar nueva contraseña"), "NewPass1!");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByText("Contraseña actualizada exitosamente")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que muestra error del backend.
  it("muestra error cuando changePassword falla", async () => {
    const changePasswordMock = vi.fn().mockRejectedValue(new Error("Contraseña actual incorrecta"));
    const user = userEvent.setup();

    renderWithProviders(<ChangePasswordPage />, {
      authContext: {
        user: mockUser,
        isAuthenticated: true,
        changePassword: changePasswordMock,
      },
    });

    await user.type(screen.getByLabelText("Contraseña actual"), "WrongPass1");
    await user.type(screen.getByLabelText("Nueva contraseña"), "NewPass1!");
    await user.type(screen.getByLabelText("Confirmar nueva contraseña"), "NewPass1!");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByText("Contraseña actual incorrecta")).toBeInTheDocument();
  });
});
