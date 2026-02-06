/**
 * Archivo: hooks/useAuth.ts
 * Descripción: Hook personalizado que provee el estado de autenticación y sus acciones.
 * ¿Para qué? Centralizar la lógica de auth para que cualquier componente pueda consumirla.
 * ¿Impacto? Sin este hook, cada componente tendría que reimplementar la lógica de auth,
 *           causando duplicación de código y posibles inconsistencias.
 */

import { useContext } from "react";
import { AuthContext } from "@/context/authContextDef";
import type { AuthContextType } from "@/types/auth";

/**
 * ¿Qué? Hook que consume el AuthContext y retorna el estado + acciones de auth.
 * ¿Para qué? Proveer una API limpia para que los componentes accedan a auth.
 * ¿Impacto? Lanza error si se usa fuera de AuthProvider — esto ayuda a detectar
 *           bugs de configuración en desarrollo (el provider debe envolver la app).
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth debe usarse dentro de un AuthProvider. " +
        "Verifica que <AuthProvider> envuelve el componente que llama useAuth().",
    );
  }

  return context;
}
