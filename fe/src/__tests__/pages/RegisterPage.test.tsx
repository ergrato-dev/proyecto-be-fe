/**
 * Archivo: __tests__/pages/RegisterPage.test.tsx
 * Descripción: Tests de la página de registro — campos, validación cliente, envío, errores.
 * ¿Para qué? Asegurar que el flujo de registro funciona correctamente y valida inputs.
 * ¿Impacto? Si el registro falla silenciosamente, los usuarios no podrían crear cuentas.
 */

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterPage } from "@/pages/RegisterPage";
import { renderWithProviders } from "../helpers";

describe("RegisterPage", () => {
  // ¿Qué? Verifica que todos los campos del formulario están presentes.
  it("renderiza el formulario completo de registro", () => {
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });

    expect(screen.getByRole("heading", { name: "Crear cuenta" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar contraseña")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Crear cuenta" })).toBeInTheDocument();
  });

  // ¿Qué? Verifica que existe enlace a login.
  it("muestra enlace a iniciar sesión", () => {
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
  });

  // ¿Qué? Verifica validación de nombre corto.
  it("muestra error si el nombre tiene menos de 2 caracteres", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });

    await user.type(screen.getByLabelText("Nombre completo"), "A");
    await user.type(screen.getByLabelText("Correo electrónico"), "a@b.com");
    await user.type(screen.getByLabelText("Contraseña"), "Password1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Password1");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByText("El nombre debe tener al menos 2 caracteres")).toBeInTheDocument();
  });

  // ¿Qué? Verifica validación de contraseña débil.
  it("muestra error si la contraseña es muy corta", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });

    await user.type(screen.getByLabelText("Nombre completo"), "Test User");
    await user.type(screen.getByLabelText("Correo electrónico"), "a@b.com");
    await user.type(screen.getByLabelText("Contraseña"), "Ab1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Ab1");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByText("Mínimo 8 caracteres")).toBeInTheDocument();
  });

  // ¿Qué? Verifica validación de contraseñas que no coinciden.
  it("muestra error si las contraseñas no coinciden", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });

    await user.type(screen.getByLabelText("Nombre completo"), "Test User");
    await user.type(screen.getByLabelText("Correo electrónico"), "a@b.com");
    await user.type(screen.getByLabelText("Contraseña"), "Password1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Password2");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByText("Las contraseñas no coinciden")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que register() se llama con datos correctos.
  it("ejecuta register al enviar formulario válido", async () => {
    const registerMock = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders(<RegisterPage />, {
      initialRoute: "/register",
      authContext: { register: registerMock },
    });

    await user.type(screen.getByLabelText("Nombre completo"), "Juan Pérez");
    await user.type(screen.getByLabelText("Correo electrónico"), "juan@nn.com");
    await user.type(screen.getByLabelText("Contraseña"), "Password1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Password1");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(registerMock).toHaveBeenCalledWith({
      email: "juan@nn.com",
      full_name: "Juan Pérez",
      password: "Password1",
    });
  });

  // ¿Qué? Verifica que muestra error del backend.
  it("muestra alerta de error cuando register falla", async () => {
    const registerMock = vi.fn().mockRejectedValue(new Error("El email ya está registrado"));
    const user = userEvent.setup();

    renderWithProviders(<RegisterPage />, {
      initialRoute: "/register",
      authContext: { register: registerMock },
    });

    await user.type(screen.getByLabelText("Nombre completo"), "Test User");
    await user.type(screen.getByLabelText("Correo electrónico"), "dup@nn.com");
    await user.type(screen.getByLabelText("Contraseña"), "Password1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Password1");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByText("El email ya está registrado")).toBeInTheDocument();
  });
});
