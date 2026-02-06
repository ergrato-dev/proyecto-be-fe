/**
 * Archivo: vite-env.d.ts
 * Descripción: Declaraciones de tipos para Vite — referencia los tipos del cliente Vite.
 * ¿Para qué? TypeScript necesita esta referencia para entender import.meta.env y otros tipos de Vite.
 * ¿Impacto? Sin este archivo, TypeScript no reconocería variables de entorno VITE_* ni assets.
 */

/// <reference types="vite/client" />
