/**
 * Archivo: __tests__/pages/LoginPage.test.tsx
 * Descripción: Tests de la página de login — formulario, validación, errores, navegación.
 * ¿Para qué? Verificar que el formulario de login envía credenciales correctamente,
 *           muestra errores del backend, y redirecciona al dashboard al autenticarse.
 * ¿Impacto? El login es la puerta de entrada — si falla, nadie accede a la app.
 */

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "@/pages/LoginPage";
import { renderWithProviders } from "../helpers";

describe("LoginPage", () => {
  // ¿Qué? Verifica que el formulario se renderiza con todos los campos.
  it("renderiza el formulario de login completo", () => {
    renderWithProviders(<LoginPage />, { initialRoute: "/login" });

    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeInTheDocument();
  });

  // ¿Qué? Verifica que el enlace a "¿Olvidaste tu contraseña?" existe.
  it("muestra enlace a recuperación de contraseña", () => {
    renderWithProviders(<LoginPage />, { initialRoute: "/login" });
    expect(screen.getByText("¿Olvidaste tu contraseña?")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que el enlace a registro existe.
  it("muestra enlace a crear cuenta", () => {
    renderWithProviders(<LoginPage />, { initialRoute: "/login" });
    expect(screen.getByText("Crear cuenta")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que los campos aceptan entrada del usuario.
  it("permite escribir en los campos de email y password", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { initialRoute: "/login" });

    const emailInput = screen.getByLabelText("Correo electrónico");
    const passwordInput = screen.getByLabelText("Contraseña");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password1");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("Password1");
  });

  // ¿Qué? Verifica que al enviar el formulario se ejecuta login().
  it("ejecuta login al enviar el formulario", async () => {
    const loginMock = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />, {
      initialRoute: "/login",
      authContext: { login: loginMock },
    });

    await user.type(screen.getByLabelText("Correo electrónico"), "test@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "Password1");
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    expect(loginMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "Password1",
    });
  });

  // ¿Qué? Verifica que muestra error cuando login falla.
  it("muestra alerta de error cuando login falla", async () => {
    const loginMock = vi.fn().mockRejectedValue(new Error("Credenciales incorrectas"));
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />, {
      initialRoute: "/login",
      authContext: { login: loginMock },
    });

    await user.type(screen.getByLabelText("Correo electrónico"), "bad@email.com");
    await user.type(screen.getByLabelText("Contraseña"), "wrongpass");
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    expect(await screen.findByText("Credenciales incorrectas")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que el error se limpia al escribir.
  it("limpia el error al escribir de nuevo", async () => {
    const loginMock = vi.fn().mockRejectedValue(new Error("Error"));
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />, {
      initialRoute: "/login",
      authContext: { login: loginMock },
    });

    await user.type(screen.getByLabelText("Correo electrónico"), "x");
    await user.type(screen.getByLabelText("Contraseña"), "x");
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    expect(await screen.findByText("Error")).toBeInTheDocument();

    // Al escribir de nuevo, el error debe desaparecer.
    await user.type(screen.getByLabelText("Correo electrónico"), "a");
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });
});
