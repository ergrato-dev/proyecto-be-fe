/**
 * Archivo: __tests__/pages/RegisterPage.test.tsx
 * Descripción: Tests de la página de registro — campos, validación cliente, envío, errores.
 * ¿Para qué? Asegurar que el flujo de registro funciona correctamente y valida inputs.
 * ¿Impacto? Si el registro falla silenciosamente, los usuarios no podrían crear cuentas.
 */

import { createEvent, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterPage } from "@/pages/RegisterPage";
import { renderWithProviders } from "../helpers";

describe("RegisterPage", () => {
  // ¿Qué? Verifica que todos los campos del formulario están presentes.
  it("renderiza el formulario completo de registro", () => {
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });

    expect(screen.getByRole("heading", { name: "Crear cuenta" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nombres")).toBeInTheDocument();
    expect(screen.getByLabelText("Apellidos")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar correo electrónico")).toBeInTheDocument();
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

    await user.type(screen.getByLabelText("Nombres"), "A");
    await user.type(screen.getByLabelText("Apellidos"), "B");
    await user.type(screen.getByLabelText("Correo electrónico"), "a@b.com");
    await user.type(screen.getByLabelText("Confirmar correo electrónico"), "a@b.com");
    await user.type(screen.getByLabelText("Contraseña"), "Password1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Password1");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByText("El nombre debe tener al menos 2 caracteres")).toBeInTheDocument();
  });

  // ¿Qué? Verifica validación de contraseña débil.
  it("muestra error si la contraseña es muy corta", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });

    await user.type(screen.getByLabelText("Nombres"), "Test");
    await user.type(screen.getByLabelText("Apellidos"), "User");
    await user.type(screen.getByLabelText("Correo electrónico"), "a@b.com");
    await user.type(screen.getByLabelText("Confirmar correo electrónico"), "a@b.com");
    await user.type(screen.getByLabelText("Contraseña"), "Ab1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Ab1");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByText("Mínimo 8 caracteres")).toBeInTheDocument();
  });

  // ¿Qué? Verifica validación de contraseñas que no coinciden.
  it("muestra error si las contraseñas no coinciden", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });

    await user.type(screen.getByLabelText("Nombres"), "Test");
    await user.type(screen.getByLabelText("Apellidos"), "User");
    await user.type(screen.getByLabelText("Correo electrónico"), "a@b.com");
    await user.type(screen.getByLabelText("Confirmar correo electrónico"), "a@b.com");
    await user.type(screen.getByLabelText("Contraseña"), "Password1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Password2");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByText("Las contraseñas no coinciden")).toBeInTheDocument();
  });

  // ¿Qué? Verifica validación de correos que no coinciden.
  // ¿Para qué? Confirmar que la comparación email vs confirmEmail funciona correctamente.
  // ¿Impacto? Sin este test, podría colarse una regresión que permita registros con emails distintos.
  it("muestra error si los correos no coinciden", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });

    await user.type(screen.getByLabelText("Nombres"), "Test");
    await user.type(screen.getByLabelText("Apellidos"), "User");
    await user.type(screen.getByLabelText("Correo electrónico"), "a@b.com");
    await user.type(screen.getByLabelText("Confirmar correo electrónico"), "otro@b.com");
    await user.type(screen.getByLabelText("Contraseña"), "Password1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Password1");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByText("Los correos electrónicos no coinciden")).toBeInTheDocument();
  });

  // ¿Qué? Verifica validación cuando el campo confirmar correo está vacío.
  it("muestra error si el campo confirmar correo está vacío", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });

    await user.type(screen.getByLabelText("Nombres"), "Test");
    await user.type(screen.getByLabelText("Apellidos"), "User");
    await user.type(screen.getByLabelText("Correo electrónico"), "a@b.com");
    // ¿Intencionalmente no se escribe en "Confirmar correo electrónico"
    await user.type(screen.getByLabelText("Contraseña"), "Password1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Password1");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByText("Debes confirmar tu correo electrónico")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que el campo "confirmar correo" bloquea el pegado.
  // ¿Para qué? Garantizar que el usuario escribe el correo a mano — la defensa técnica
  //            contra el anti-patrón de copiar y pegar el mismo dato erróneo dos veces.
  // ¿Impacto? Si defaultPrevented=false, el usuario podría pegar sin intervención humana.
  it("bloquea el pegado en el campo confirmar correo electrónico", () => {
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });

    const input = screen.getByLabelText("Confirmar correo electrónico");
    const pasteEvent = createEvent.paste(input);
    fireEvent(input, pasteEvent);

    expect(pasteEvent.defaultPrevented).toBe(true);
  });

  // ¿Qué? Verifica que el campo "confirmar contraseña" también bloquea el pegado.
  // ¿Para qué? Misma garantía de intervención humana que para el correo.
  // ¿Impacto? Sin este bloqueo, contraseñas erróneas podrían confirmarse por accidente.
  it("bloquea el pegado en el campo confirmar contraseña", () => {
    renderWithProviders(<RegisterPage />, { initialRoute: "/register" });

    const input = screen.getByLabelText("Confirmar contraseña");
    const pasteEvent = createEvent.paste(input);
    fireEvent(input, pasteEvent);

    expect(pasteEvent.defaultPrevented).toBe(true);
  });

  // ¿Qué? Verifica que register() se llama con datos correctos.
  it("ejecuta register al enviar formulario válido", async () => {
    const registerMock = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders(<RegisterPage />, {
      initialRoute: "/register",
      authContext: { register: registerMock },
    });

    await user.type(screen.getByLabelText("Nombres"), "Juan");
    await user.type(screen.getByLabelText("Apellidos"), "Pérez");
    await user.type(screen.getByLabelText("Correo electrónico"), "juan@nn.com");
    await user.type(screen.getByLabelText("Confirmar correo electrónico"), "juan@nn.com");
    await user.type(screen.getByLabelText("Contraseña"), "Password1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Password1");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(registerMock).toHaveBeenCalledWith({
      email: "juan@nn.com",
      first_name: "Juan",
      last_name: "Pérez",
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

    await user.type(screen.getByLabelText("Nombres"), "Test");
    await user.type(screen.getByLabelText("Apellidos"), "User");
    await user.type(screen.getByLabelText("Correo electrónico"), "dup@nn.com");
    await user.type(screen.getByLabelText("Confirmar correo electrónico"), "dup@nn.com");
    await user.type(screen.getByLabelText("Contraseña"), "Password1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "Password1");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByText("El email ya está registrado")).toBeInTheDocument();
  });
});
