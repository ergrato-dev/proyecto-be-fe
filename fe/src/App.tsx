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
import { LandingPage } from "@/pages/LandingPage";
import { TerminosDeUsoPage } from "@/pages/TerminosDeUsoPage";
import { PoliticaPrivacidadPage } from "@/pages/PoliticaPrivacidadPage";
import { PoliticaCookiesPage } from "@/pages/PoliticaCookiesPage";
import { ContactPage } from "@/pages/ContactPage";

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

          {/* ¿Qué? Ruta raíz muestra la landing page pública del sistema. */}
          {/* ¿Para qué? Primera impresión del producto antes de que el usuario se autentique. */}
          {/* ¿Impacto? Presenta el sistema y dirige al login o registro según la acción del usuario. */}
          <Route path="/" element={<LandingPage />} />

          {/* ════════════════════════════════════════ */}
          {/* 📄 Páginas legales (públicas, sin auth)  */}
          {/* Marco normativo: Ley 1581/2012, Decreto 1377/2013, Ley 527/1999, Ley 1480/2011 */}
          {/* ════════════════════════════════════════ */}
          {/* ¿Qué? Términos de Uso del servicio NN Auth System. */}
          {/* ¿Para qué? Establecer las condiciones de uso conforme a Ley 527/1999 y 1480/2011. */}
          <Route path="/terminos-de-uso" element={<TerminosDeUsoPage />} />
          {/* ¿Qué? Política de Privacidad y Tratamiento de Datos Personales. */}
          {/* ¿Para qué? Cumplir con la Ley 1581/2012 (Habeas Data) y Decreto 1377/2013. */}
          <Route path="/privacidad" element={<PoliticaPrivacidadPage />} />
          {/* ¿Qué? Política de Uso de Cookies del servicio. */}
          {/* ¿Para qué? Informar al titular qué cookies se usan y cómo gestionarlas. */}
          <Route path="/cookies" element={<PoliticaCookiesPage />} />

          {/* ¿Qué? Formulario de contacto público con validación y envío simulado. */}
          {/* ¿Para qué? Canal formal de atención exigido por Ley 1581/2012 Arts. 14-15. */}
          {/* ¿Impacto? Sin canal de contacto, no se cumple el derecho a consultas y reclamos. */}
          <Route path="/contacto" element={<ContactPage />} />

          {/* ¿Qué? Ruta catch-all para URLs no existentes. */}
          {/* ¿Para qué? Redirigir al login cualquier ruta desconocida. */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
