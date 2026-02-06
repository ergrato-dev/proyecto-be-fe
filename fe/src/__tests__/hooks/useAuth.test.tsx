/**
 * Archivo: __tests__/hooks/useAuth.test.tsx
 * Descripción: Tests del hook useAuth — verifica que consume AuthContext correctamente.
 * ¿Para qué? Garantizar que useAuth lanza error fuera de AuthProvider
 *           y retorna el contexto completo dentro del provider.
 * ¿Impacto? Si useAuth falla, NINGÚN componente puede acceder a las acciones de auth.
 */

import { renderHook } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "@/context/authContextDef";
import { defaultAuthContext, mockUser } from "../helpers";
import type { ReactNode } from "react";

describe("useAuth", () => {
  // ¿Qué? Verifica que lanza error si se usa fuera de AuthProvider.
  it("lanza error si se usa fuera de AuthProvider", () => {
    // ¿Para qué? Detectar bugs de configuración en desarrollo.
    // ¿Impacto? El desarrollador sabe inmediatamente que olvidó envolver con AuthProvider.
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth debe usarse dentro de un AuthProvider");
  });

  // ¿Qué? Verifica que retorna el contexto completo dentro del provider.
  it("retorna el contexto de auth dentro de AuthProvider", () => {
    const contextValue = {
      ...defaultAuthContext,
      user: mockUser,
      isAuthenticated: true,
      accessToken: "test-token",
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.accessToken).toBe("test-token");
    expect(typeof result.current.login).toBe("function");
    expect(typeof result.current.logout).toBe("function");
    expect(typeof result.current.register).toBe("function");
    expect(typeof result.current.changePassword).toBe("function");
    expect(typeof result.current.forgotPassword).toBe("function");
    expect(typeof result.current.resetPassword).toBe("function");
  });
});
