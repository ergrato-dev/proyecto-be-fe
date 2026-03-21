/**
 * Archivo: App.tsx
 * Descripción: Componente raíz de la aplicación — define el enrutamiento principal.
 * ¿Para qué? Centralizar la estructura de rutas y proveer los contexts globales (auth).
 * ¿Impacto? Sin este componente, la app no tendría navegación ni estructura de páginas.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

// ¿Qué? Imports de todas las páginas de la aplicación.
// ¿Para qué? Cada página se renderiza según la ruta activa.
// ¿Impacto? Al agregar una nueva página, se importa aquí y se agrega una <Route>.
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ChangePasswordPage } from "@/pages/ChangePasswordPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { VerifyEmailPage } from "@/pages/VerifyEmailPage";
import { DataTableDemoPage } from "@/pages/DataTableDemoPage";

/**
 * ¿Qué? Componente raíz que configura el AuthProvider y las rutas de la aplicación.
 * ¿Para qué? Definir qué página se muestra según la URL del navegador.
 * ¿Impacto? Es el punto de entrada visual — toda la interfaz se renderiza dentro de este componente.
 */
function App() {
  return (
    <BrowserRouter>
      {/* ¿Qué? AuthProvider envuelve todas las rutas para que useAuth() funcione. */}
      {/* ¿Para qué? Sin AuthProvider, ningún componente hijo puede acceder al contexto de auth. */}
      {/* ¿Impacto? Debe ser el wrapper más externo después del BrowserRouter. */}
      <AuthProvider>
        <Routes>
          {/* ════════════════════════════════════════ */}
          {/* 🔓 Rutas públicas (no requieren autenticación) */}
          {/* ════════════════════════════════════════ */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* ¿Qué? Ruta para verificar el email al hacer clic en el enlace del correo. */}
          {/* ¿Para qué? Captura el token de la URL y lo envía al backend para activar la cuenta. */}
          {/* ¿Impacto? Sin esta ruta, los usuarios no pueden completar el registro. */}
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* ¿Qué? Ruta de demo del componente DataTable (acceso público, sin auth). */}
          {/* ¿Para qué? Demostrar todas las funcionalidades del componente en un sandbox. */}
          <Route path="/demo/datatable" element={<DataTableDemoPage />} />

          {/* ════════════════════════════════════════ */}
          {/* 🔒 Rutas protegidas (requieren sesión activa) */}
          {/* ════════════════════════════════════════ */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>

          {/* ¿Qué? Ruta raíz redirige al login. */}
          {/* ¿Para qué? Si el usuario accede a "/", lo enviamos al login. */}
          {/* ¿Impacto? Evita una página en blanco en la ruta raíz. */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ¿Qué? Ruta catch-all para URLs no existentes. */}
          {/* ¿Para qué? Redirigir al login cualquier ruta desconocida. */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
