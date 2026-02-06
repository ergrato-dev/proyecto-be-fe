/**
 * Archivo: __tests__/components/Button.test.tsx
 * Descripción: Tests del componente Button — variantes, loading, disabled, onClick.
 * ¿Para qué? Verificar que el botón se renderiza correctamente con cada variante,
 *           que el estado de carga muestra spinner y deshabilita la interacción.
 * ¿Impacto? Garantiza consistencia visual y funcional del botón en toda la app.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  // ¿Qué? Verifica que el botón renderiza su contenido.
  it("renderiza el texto children correctamente", () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
  });

  // ¿Qué? Verifica que el type por defecto sea "button".
  it("tiene type='button' por defecto", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  // ¿Qué? Verifica que se puede cambiar el type a "submit".
  it("acepta type='submit' para formularios", () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  // ¿Qué? Verifica que el onClick se ejecuta al hacer clic.
  it("ejecuta onClick al hacer clic", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // ¿Qué? Verifica que el botón se deshabilita cuando disabled=true.
  it("se deshabilita cuando disabled es true", () => {
    render(<Button disabled>Deshabilitado</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // ¿Qué? Verifica que isLoading muestra un spinner y deshabilita el botón.
  it("muestra spinner y se deshabilita cuando isLoading es true", () => {
    render(<Button isLoading>Cargando</Button>);
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    // ¿Para qué? Verificar que el SVG spinner existe en el DOM.
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que no se ejecuta onClick cuando isLoading=true.
  it("no ejecuta onClick cuando está cargando", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button isLoading onClick={handleClick}>
        Click
      </Button>,
    );
    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  // ¿Qué? Verifica que fullWidth aplica w-full.
  it("aplica clase w-full cuando fullWidth es true", () => {
    render(<Button fullWidth>Ancho completo</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  // ¿Qué? Verifica las tres variantes de color.
  it.each(["primary", "secondary", "danger"] as const)(
    "renderiza correctamente la variante '%s'",
    (variant) => {
      render(<Button variant={variant}>Botón</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    },
  );
});
