/**
 * Archivo: context/authContextDef.ts
 * Descripción: Definición del contexto de autenticación (separado del Provider).
 * ¿Para qué? React-refresh/HMR exige que los archivos que exportan componentes
 *           no exporten también contextos u otras cosas. Este archivo solo define el contexto.
 * ¿Impacto? Permite que el Provider esté en AuthContext.tsx y el create esté aquí.
 */

import { createContext } from "react";
import type { AuthContextType } from "@/types/auth";

/**
 * ¿Qué? Contexto de React para autenticación — inicialmente undefined.
 * ¿Para qué? Crear el "canal" por el que fluyen datos de auth a toda la app.
 * ¿Impacto? undefined como default obliga a consumirlo dentro de AuthProvider
 *           (el hook useAuth lanza error si se usa fuera del provider).
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
