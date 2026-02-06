/**
 * Archivo: api/auth.ts
 * Descripción: Cliente HTTP para los endpoints de autenticación del backend.
 * ¿Para qué? Encapsular todas las llamadas HTTP de auth en funciones reutilizables.
 *           Los componentes y contexts llaman estas funciones en lugar de hacer fetch directo.
 * ¿Impacto? Centraliza la lógica de comunicación con la API — si un endpoint cambia,
 *           solo se modifica este archivo, no todos los componentes.
 */

import api from "./axios";
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RefreshTokenRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TokenResponse,
  UserResponse,
} from "@/types/auth";

// ¿Qué? Prefijo de los endpoints de auth definido en el backend.
// ¿Para qué? Evitar repetir "/api/v1/auth" en cada función.
// ¿Impacto? Si el backend cambia el prefijo, solo se modifica esta constante.
const AUTH_PREFIX = "/api/v1/auth";
const USERS_PREFIX = "/api/v1/users";

/**
 * ¿Qué? Registra un nuevo usuario en el sistema.
 * ¿Para qué? Enviar POST /api/v1/auth/register con email, nombre y contraseña.
 * ¿Impacto? Si el registro es exitoso, retorna los datos del usuario creado (sin password).
 */
export async function registerUser(data: RegisterRequest): Promise<UserResponse> {
  const response = await api.post<UserResponse>(`${AUTH_PREFIX}/register`, data);
  return response.data;
}

/**
 * ¿Qué? Autentica un usuario y obtiene tokens JWT.
 * ¿Para qué? Enviar POST /api/v1/auth/login con email y contraseña.
 * ¿Impacto? Retorna access_token + refresh_token que se usan para acceder a endpoints protegidos.
 */
export async function loginUser(data: LoginRequest): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>(`${AUTH_PREFIX}/login`, data);
  return response.data;
}

/**
 * ¿Qué? Renueva el access token usando el refresh token.
 * ¿Para qué? Mantener la sesión activa cuando el access token expira (cada 15 min).
 * ¿Impacto? Si el refresh token también expiró (7 días), el usuario debe hacer login de nuevo.
 */
export async function refreshToken(data: RefreshTokenRequest): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>(`${AUTH_PREFIX}/refresh`, data);
  return response.data;
}

/**
 * ¿Qué? Cambia la contraseña del usuario autenticado.
 * ¿Para qué? Enviar POST /api/v1/auth/change-password con la contraseña actual y la nueva.
 * ¿Impacto? Requiere que el usuario conozca su contraseña actual (seguridad adicional).
 */
export async function changePassword(data: ChangePasswordRequest): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(`${AUTH_PREFIX}/change-password`, data);
  return response.data;
}

/**
 * ¿Qué? Solicita un email de recuperación de contraseña.
 * ¿Para qué? Enviar POST /api/v1/auth/forgot-password con el email del usuario.
 * ¿Impacto? El backend envía un email con un enlace de reset (si el email existe).
 *           La respuesta siempre es la misma para no revelar si el email está registrado.
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(`${AUTH_PREFIX}/forgot-password`, data);
  return response.data;
}

/**
 * ¿Qué? Restablece la contraseña usando un token de recuperación.
 * ¿Para qué? Enviar POST /api/v1/auth/reset-password con el token del email y la nueva contraseña.
 * ¿Impacto? El token se marca como usado — no puede reutilizarse.
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(`${AUTH_PREFIX}/reset-password`, data);
  return response.data;
}

/**
 * ¿Qué? Obtiene el perfil del usuario autenticado.
 * ¿Para qué? Enviar GET /api/v1/users/me con el access token en el header.
 * ¿Impacto? Se usa al cargar la app para verificar si el usuario está logueado.
 */
export async function getMe(): Promise<UserResponse> {
  const response = await api.get<UserResponse>(`${USERS_PREFIX}/me`);
  return response.data;
}
