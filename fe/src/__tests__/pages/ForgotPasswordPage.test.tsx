/**
 * Archivo: __tests__/pages/ForgotPasswordPage.test.tsx
 * Descripción: Tests de la página de recuperación de contraseña — envío del email.
 * ¿Para qué? Verificar que el flujo forgot-password envía el email y muestra feedback.
 * ¿Impacto? Es el paso 1 de la recuperación — si falla, el usuario no recibe el enlace.
 */

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { renderWithProviders } from "../helpers";

describe("ForgotPasswordPage", () => {
  // ¿Qué? Verifica que el formulario tiene los elementos necesarios.
  it("renderiza el formulario de recuperación", () => {
    renderWithProviders(<ForgotPasswordPage />, { initialRoute: "/forgot-password" });

    expect(screen.getByText("Recuperar contraseña")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar enlace" })).toBeInTheDocument();
  });

  // ¿Qué? Verifica enlace para volver al login.
  it("muestra enlace para volver al login", () => {
    renderWithProviders(<ForgotPasswordPage />, { initialRoute: "/forgot-password" });
    expect(screen.getByText("Volver al inicio de sesión")).toBeInTheDocument();
  });

  // ¿Qué? Verifica validación de email vacío.
  it("muestra error si el email está vacío", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPasswordPage />, { initialRoute: "/forgot-password" });

    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(screen.getByText("El correo es obligatorio")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que forgotPassword() se ejecuta correctamente.
  it("ejecuta forgotPassword al enviar email válido", async () => {
    const forgotPasswordMock = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders(<ForgotPasswordPage />, {
      initialRoute: "/forgot-password",
      authContext: { forgotPassword: forgotPasswordMock },
    });

    await user.type(screen.getByLabelText("Correo electrónico"), "test@nn.com");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(forgotPasswordMock).toHaveBeenCalledWith({ email: "test@nn.com" });
  });

  // ¿Qué? Verifica que muestra mensaje de éxito genérico (por seguridad).
  it("muestra mensaje de éxito tras enviar solicitud", async () => {
    const forgotPasswordMock = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders(<ForgotPasswordPage />, {
      initialRoute: "/forgot-password",
      authContext: { forgotPassword: forgotPasswordMock },
    });

    await user.type(screen.getByLabelText("Correo electrónico"), "test@nn.com");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(
      await screen.findByText(
        "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.",
      ),
    ).toBeInTheDocument();
  });

  // ¿Qué? Verifica que muestra error del backend.
  it("muestra error si forgotPassword falla", async () => {
    const forgotPasswordMock = vi.fn().mockRejectedValue(new Error("Error del servidor"));
    const user = userEvent.setup();

    renderWithProviders(<ForgotPasswordPage />, {
      initialRoute: "/forgot-password",
      authContext: { forgotPassword: forgotPasswordMock },
    });

    await user.type(screen.getByLabelText("Correo electrónico"), "test@nn.com");
    await user.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(await screen.findByText("Error del servidor")).toBeInTheDocument();
  });
});
