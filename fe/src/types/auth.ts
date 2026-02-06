/**
 * Archivo: types/auth.ts
 * Descripción: Tipos e interfaces TypeScript para el sistema de autenticación.
 * ¿Para qué? Definir contratos de datos entre frontend y backend — garantiza que
 *            las peticiones y respuestas tengan la forma correcta en tiempo de compilación.
 * ¿Impacto? Sin estos tipos, TypeScript no podría validar los datos en compile-time,
 *           permitiendo errores que solo se detectarían en producción.
 */

// ════════════════════════════════════════
// 📥 Tipos de REQUEST (datos que envía el frontend al backend)
// ════════════════════════════════════════

/**
 * ¿Qué? Datos necesarios para registrar un nuevo usuario.
 * ¿Para qué? Tipado del body enviado a POST /api/v1/auth/register.
 * ¿Impacto? Garantiza que el frontend siempre envíe email, full_name y password.
 */
export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

/**
 * ¿Qué? Credenciales para iniciar sesión.
 * ¿Para qué? Tipado del body enviado a POST /api/v1/auth/login.
 * ¿Impacto? Sin este tipo, se podría enviar un login sin email o password sin error de TS.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * ¿Qué? Datos para cambiar la contraseña (usuario autenticado).
 * ¿Para qué? Tipado del body enviado a POST /api/v1/auth/change-password.
 * ¿Impacto? Exige la contraseña actual y la nueva — previene envíos incompletos.
 */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

/**
 * ¿Qué? Email para solicitar recuperación de contraseña.
 * ¿Para qué? Tipado del body enviado a POST /api/v1/auth/forgot-password.
 * ¿Impacto? El backend siempre responde igual (sin revelar si el email existe).
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * ¿Qué? Token de reset + nueva contraseña para restablecer acceso.
 * ¿Para qué? Tipado del body enviado a POST /api/v1/auth/reset-password.
 * ¿Impacto? El token viene de la URL (enlace recibido por email).
 */
export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

/**
 * ¿Qué? Refresh token para renovar el access token.
 * ¿Para qué? Tipado del body enviado a POST /api/v1/auth/refresh.
 * ¿Impacto? Permite mantener la sesión activa sin re-login.
 */
export interface RefreshTokenRequest {
  refresh_token: string;
}

// ════════════════════════════════════════
// 📤 Tipos de RESPONSE (datos que retorna el backend al frontend)
// ════════════════════════════════════════

/**
 * ¿Qué? Datos del usuario retornados por la API (sin contraseña).
 * ¿Para qué? Tipar la respuesta de GET /api/v1/users/me y POST /register.
 * ¿Impacto? Nunca incluye hashed_password — solo datos seguros para el cliente.
 */
export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * ¿Qué? Par de tokens JWT retornado al hacer login o refresh.
 * ¿Para qué? Tipar la respuesta de POST /login y POST /refresh.
 * ¿Impacto? access_token se usa en headers; refresh_token se usa para renovar sesión.
 */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/**
 * ¿Qué? Respuesta genérica con un mensaje del backend.
 * ¿Para qué? Tipar respuestas de operaciones sin datos (change-password, forgot-password, etc.).
 * ¿Impacto? Estandariza el manejo de mensajes de confirmación en el frontend.
 */
export interface MessageResponse {
  message: string;
}

// ════════════════════════════════════════
// 🔧 Tipos internos del frontend
// ════════════════════════════════════════

/**
 * ¿Qué? Estado global de autenticación en el frontend.
 * ¿Para qué? Definir la forma del contexto de auth (usuario, tokens, loading, etc.).
 * ¿Impacto? Todo componente que consuma AuthContext obtiene este contrato de datos.
 */
export interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * ¿Qué? Contrato del contexto de autenticación (estado + acciones).
 * ¿Para qué? Tipar lo que el hook useAuth() expone a los componentes.
 * ¿Impacto? Garantiza que todos los componentes usen login(), logout(), etc.
 *           de forma consistente y con los tipos correctos.
 */
export interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

/**
 * ¿Qué? Error de la API formateado para el frontend.
 * ¿Para qué? Estandarizar el manejo de errores HTTP en toda la aplicación.
 * ¿Impacto? Permite mostrar mensajes de error claros al usuario.
 */
export interface ApiError {
  detail: string | ValidationError[];
}

/**
 * ¿Qué? Error de validación retornado por FastAPI/Pydantic (422).
 * ¿Para qué? Tipar los errores de validación que FastAPI retorna cuando un campo no cumple.
 * ¿Impacto? Permite mapear errores específicos a campos específicos del formulario.
 */
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}
