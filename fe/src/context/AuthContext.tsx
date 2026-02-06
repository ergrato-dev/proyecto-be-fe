/**
 * Archivo: context/AuthContext.tsx
 * Descripción: Contexto de React que gestiona el estado de autenticación global.
 * ¿Para qué? Proveer a toda la aplicación acceso al usuario autenticado, tokens y acciones de auth.
 * ¿Impacto? Sin este contexto, no habría forma de saber si el usuario está logueado
 *           ni de proteger rutas que requieren autenticación.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import * as authApi from "@/api/auth";
import { AuthContext } from "@/context/authContextDef";
import type {
  AuthContextType,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserResponse,
} from "@/types/auth";

/**
 * ¿Qué? Props del AuthProvider — solo acepta children (los componentes hijos).
 * ¿Para qué? Tipar correctamente el componente provider.
 * ¿Impacto? React renderiza los children dentro del contexto de auth.
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * ¿Qué? Componente que envuelve la app y provee el estado de autenticación.
 * ¿Para qué? Centralizar toda la lógica de auth (login, logout, register, etc.)
 *           en un solo lugar que cualquier componente hijo puede consumir.
 * ¿Impacto? Si este provider no envuelve la app, ningún componente puede acceder
 *           al estado de auth ni llamar a las acciones (login, logout, etc.).
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // ¿Qué? Estado del usuario autenticado (null si no hay sesión).
  const [user, setUser] = useState<UserResponse | null>(null);

  // ¿Qué? Tokens JWT almacenados en estado de React.
  // ¿Para qué? Mantener los tokens en memoria durante la sesión del navegador.
  // ¿Impacto? Se inicializan desde sessionStorage para persistir durante la tab.
  const [accessToken, setAccessToken] = useState<string | null>(
    () => sessionStorage.getItem("access_token"),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => sessionStorage.getItem("refresh_token"),
  );

  // ¿Qué? Flag de carga — true mientras se verifica la sesión al arrancar.
  // ¿Para qué? Mostrar un loading mientras se hace GET /me en el useEffect inicial.
  // ¿Impacto? Sin esto, la app mostraría brevemente la pantalla de login antes de redirigir.
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ¿Qué? Derivado: el usuario está autenticado si hay usuario y access token.
  const isAuthenticated = !!user && !!accessToken;

  /**
   * ¿Qué? Guarda los tokens en sessionStorage y en el estado de React.
   * ¿Para qué? Sincronizar el almacenamiento del navegador con el estado de la app.
   * ¿Impacto? sessionStorage se borra al cerrar la pestaña — más seguro que localStorage.
   */
  const saveTokens = useCallback((access: string, refresh: string) => {
    sessionStorage.setItem("access_token", access);
    sessionStorage.setItem("refresh_token", refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
  }, []);

  /**
   * ¿Qué? Elimina tokens de sessionStorage y limpia el estado.
   * ¿Para qué? Cerrar sesión completamente — sin tokens, la API rechaza las peticiones.
   * ¿Impacto? El interceptor de Axios dejará de enviar el header Authorization.
   */
  const clearAuth = useCallback(() => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  /**
   * ¿Qué? Efecto que verifica la sesión existente al cargar la app.
   * ¿Para qué? Si el usuario tiene un access token válido en sessionStorage,
   *           obtenemos su perfil para restaurar la sesión sin re-login.
   * ¿Impacto? Permite que el usuario refresque la página sin perder la sesión.
   */
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = sessionStorage.getItem("access_token");
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch {
        // ¿Qué? Si el token es inválido o expiró, limpiamos la sesión.
        // ¿Para qué? Evitar que la app quede en un estado inconsistente.
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [clearAuth]);

  /**
   * ¿Qué? Acción de login — autentica al usuario y guarda tokens.
   * ¿Para qué? Llamada desde el formulario de login.
   * ¿Impacto? Si las credenciales son correctas, establece la sesión completa.
   */
  const login = useCallback(
    async (data: LoginRequest) => {
      const tokens = await authApi.loginUser(data);
      saveTokens(tokens.access_token, tokens.refresh_token);
      const userData = await authApi.getMe();
      setUser(userData);
    },
    [saveTokens],
  );

  /**
   * ¿Qué? Acción de registro — crea cuenta, luego hace login automático.
   * ¿Para qué? Después de registrarse, el usuario queda logueado directamente.
   * ¿Impacto? Mejor UX: el usuario no tiene que ir al formulario de login después de registrarse.
   */
  const register = useCallback(
    async (data: RegisterRequest) => {
      await authApi.registerUser(data);
      // Login automático después del registro.
      await login({ email: data.email, password: data.password });
    },
    [login],
  );

  /**
   * ¿Qué? Acción de logout — cierra sesión y limpia tokens.
   * ¿Para qué? El usuario quiere salir de su cuenta.
   * ¿Impacto? Navegar a la página de login después de llamar esto.
   */
  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  /**
   * ¿Qué? Acción de cambiar contraseña.
   * ¿Para qué? Permitir al usuario actualizar su contraseña desde el dashboard.
   * ¿Impacto? Requiere la contraseña actual como verificación adicional.
   */
  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    await authApi.changePassword(data);
  }, []);

  /**
   * ¿Qué? Acción de solicitar recuperación de contraseña.
   * ¿Para qué? Enviar email con enlace de reset al usuario.
   * ¿Impacto? El mensaje de respuesta es genérico (no revela si el email existe).
   */
  const forgotPassword = useCallback(async (data: ForgotPasswordRequest) => {
    await authApi.forgotPassword(data);
  }, []);

  /**
   * ¿Qué? Acción de restablecer contraseña con token de email.
   * ¿Para qué? Completar el flujo de recuperación: token + nueva contraseña.
   * ¿Impacto? Después de un reset exitoso, el usuario puede hacer login con la nueva contraseña.
   */
  const resetPasswordAction = useCallback(async (data: ResetPasswordRequest) => {
    await authApi.resetPassword(data);
  }, []);

  /**
   * ¿Qué? Valor memoizado del contexto para evitar re-renders innecesarios.
   * ¿Para qué? useMemo evita que React re-renderice todos los consumers del contexto
   *           cuando el objeto value cambia de referencia pero no de contenido.
   * ¿Impacto? Mejora el rendimiento en aplicaciones con muchos componentes consumidores.
   */
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      changePassword,
      forgotPassword,
      resetPassword: resetPasswordAction,
    }),
    [
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      changePassword,
      forgotPassword,
      resetPasswordAction,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
