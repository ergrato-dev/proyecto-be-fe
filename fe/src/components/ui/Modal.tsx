/**
 * Archivo: components/ui/Modal.tsx
 * Descripción: Modal overlay reutilizable — backdrop + dialog centrado.
 * ¿Para qué? Mostrar formularios de auth sobre la landing page sin abandonar el contexto visual.
 * ¿Impacto? El usuario puede registrarse o iniciar sesión sin perder de vista la landing;
 *           cierra con ESC o clic en el backdrop. Accesible (role=dialog, aria-modal, foco).
 */

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ModalProps {
  /** ¿Qué? Callback que se ejecuta cuando el usuario quiere cerrar el modal. */
  onClose: () => void;
  children: React.ReactNode;
  /** ¿Qué? Amplía el diálogo a max-w-xl para formularios con más campos (ej: registro). */
  wide?: boolean;
  /** ¿Qué? Label accesible del diálogo para lectores de pantalla (aria-label). */
  "aria-label"?: string;
}

/**
 * ¿Qué? Componente modal con backdrop semitransparente y diálogo centrado.
 * ¿Para qué? Mostrar contenido en primer plano sin cambiar de ruta de forma visible.
 * ¿Impacto? Cierra con ESC o clic en backdrop. Bloquea scroll del body mientras está abierto.
 *           Mueve el foco al diálogo al abrirse (WCAG 2.1 — 2.4.3 Focus Order).
 */
export function Modal({ onClose, children, wide = false, "aria-label": ariaLabel }: ModalProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  // ¿Qué? Cierra el modal al presionar Escape.
  // ¿Para qué? WCAG 2.1 — el usuario de teclado espera ESC para cerrar diálogos.
  // ¿Impacto? Sin esto, el teclado no puede cerrar el modal.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // ¿Qué? Bloquea el scroll del body mientras el modal está abierto.
  // ¿Para qué? Evitar que el usuario haga scroll en el fondo mientras interactúa con el modal.
  // ¿Impacto? Restaura el scroll al desmontar el componente.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ¿Qué? Mueve el foco al diálogo al montarse.
  // ¿Para qué? WCAG 2.1 — 2.4.3: el foco debe ir al contenido del diálogo al abrirse.
  // ¿Impacto? Sin esto, el lector de pantalla no anuncia que se abrió un diálogo.
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  return (
    // ¿Qué? Backdrop semitransparente que cubre toda la pantalla.
    // ¿Para qué? Señalar visualmente que el modal está en primer plano.
    // ¿Impacto? Clic en el backdrop cierra el modal.
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      aria-hidden="false"
    >
      {/* ¿Qué? Contenedor del diálogo — detiene la propagación del clic. */}
      {/* ¿Para qué? Evitar que un clic dentro del formulario cierre el modal. */}
      {/* ¿Impacto? El usuario puede interactuar con el formulario sin cerrarlo. */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`relative my-auto w-full ${wide ? "max-w-xl" : "max-w-md"} rounded-2xl bg-white shadow-2xl outline-none dark:bg-gray-900`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ¿Qué? Botón de cierre en la esquina superior derecha. */}
        {/* ¿Para qué? Alternativa visual a ESC o clic en backdrop para usuarios de ratón. */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-gray-400 transition-colors
            hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          aria-label={t("common.close")}
        >
          <X className="h-5 w-5" />
        </button>

        {children}
      </div>
    </div>
  );
}
