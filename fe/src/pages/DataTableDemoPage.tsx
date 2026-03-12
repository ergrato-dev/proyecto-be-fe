/**
 * Archivo: pages/DataTableDemoPage.tsx
 * Descripción: Página de demostración del componente DataTable genérico.
 * ¿Para qué? Mostrar todas las funcionalidades del DataTable (paginación, ordenación,
 *             búsqueda, estilo cebra, acciones) con datos de ejemplo realistas.
 * ¿Impacto? Sirve como sandbox interactivo y referencia de uso para el componente.
 *           Accesible en: http://localhost:5173/demo/datatable (ruta pública, sin auth).
 */

import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef, RowAction } from "@/components/ui/DataTable";

// ============================================================================
// TIPOS DE DATOS DE EJEMPLO
// ¿Qué? Interfaces que definen la forma de cada entidad de demo.
// ¿Para qué? Demostrar que DataTable es genérico — funciona con CUALQUIER tipo de dato.
// ¿Impacto? Cambiar el tipo genérico <T> cambia toda la tabla sin modificar el componente.
// ============================================================================

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "inactive" | "on_leave";
  salary: number;
  joinDate: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
}

// ============================================================================
// DATOS DE EJEMPLO — EMPLEADOS
// ¿Qué? Array de 18 empleados ficticios para la demo.
// ¿Para qué? Tener suficientes filas para ver paginación, búsqueda y ordenación en acción.
// ¿Impacto? Con <10 filas no se activa el paginador; con 18 y pageSize=8 se ven 3 páginas.
// ============================================================================
const EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: "Ana Sofía Ramírez",
    email: "asofia@nn-corp.com",
    department: "Ingeniería",
    role: "Tech Lead",
    status: "active",
    salary: 8500000,
    joinDate: "2021-03-15",
  },
  {
    id: 2,
    name: "Bruno Lagos",
    email: "blagos@nn-corp.com",
    department: "Diseño",
    role: "UX Designer",
    status: "active",
    salary: 6200000,
    joinDate: "2022-01-10",
  },
  {
    id: 3,
    name: "Camila Torres",
    email: "ctorres@nn-corp.com",
    department: "Ingeniería",
    role: "Backend Dev",
    status: "active",
    salary: 7100000,
    joinDate: "2020-07-20",
  },
  {
    id: 4,
    name: "Daniel Herrera",
    email: "dherrera@nn-corp.com",
    department: "Ventas",
    role: "Sales Manager",
    status: "inactive",
    salary: 5900000,
    joinDate: "2019-11-05",
  },
  {
    id: 5,
    name: "Elena Vargas",
    email: "evargas@nn-corp.com",
    department: "RRHH",
    role: "HR Specialist",
    status: "active",
    salary: 5500000,
    joinDate: "2023-02-28",
  },
  {
    id: 6,
    name: "Felipe Moreno",
    email: "fmoreno@nn-corp.com",
    department: "Ingeniería",
    role: "Frontend Dev",
    status: "active",
    salary: 6800000,
    joinDate: "2022-08-14",
  },
  {
    id: 7,
    name: "Gabriela Castro",
    email: "gcastro@nn-corp.com",
    department: "Marketing",
    role: "Content Manager",
    status: "on_leave",
    salary: 5800000,
    joinDate: "2021-05-03",
  },
  {
    id: 8,
    name: "Hernán Quintero",
    email: "hquintero@nn-corp.com",
    department: "Finanzas",
    role: "Accountant",
    status: "active",
    salary: 6000000,
    joinDate: "2020-09-17",
  },
  {
    id: 9,
    name: "Isabela Díaz",
    email: "idiaz@nn-corp.com",
    department: "Diseño",
    role: "Graphic Designer",
    status: "active",
    salary: 5700000,
    joinDate: "2023-04-11",
  },
  {
    id: 10,
    name: "Jorge Medina",
    email: "jmedina@nn-corp.com",
    department: "Ingeniería",
    role: "DevOps Engineer",
    status: "active",
    salary: 7800000,
    joinDate: "2019-06-22",
  },
  {
    id: 11,
    name: "Karen Suárez",
    email: "ksuarez@nn-corp.com",
    department: "Ventas",
    role: "Sales Rep",
    status: "active",
    salary: 4900000,
    joinDate: "2024-01-08",
  },
  {
    id: 12,
    name: "Luis Peñaloza",
    email: "lpenaloza@nn-corp.com",
    department: "RRHH",
    role: "Recruiter",
    status: "inactive",
    salary: 5100000,
    joinDate: "2022-11-30",
  },
  {
    id: 13,
    name: "María Ortega",
    email: "mortega@nn-corp.com",
    department: "Marketing",
    role: "SEO Specialist",
    status: "active",
    salary: 5600000,
    joinDate: "2021-09-19",
  },
  {
    id: 14,
    name: "Nicolás Acosta",
    email: "nacosta@nn-corp.com",
    department: "Ingeniería",
    role: "QA Engineer",
    status: "active",
    salary: 6300000,
    joinDate: "2023-07-04",
  },
  {
    id: 15,
    name: "Olga Fuentes",
    email: "ofuentes@nn-corp.com",
    department: "Finanzas",
    role: "Finance Manager",
    status: "on_leave",
    salary: 7400000,
    joinDate: "2018-03-25",
  },
  {
    id: 16,
    name: "Pablo Guerrero",
    email: "pguerrero@nn-corp.com",
    department: "Diseño",
    role: "Design Lead",
    status: "active",
    salary: 7200000,
    joinDate: "2020-12-01",
  },
  {
    id: 17,
    name: "Quirina Escobar",
    email: "qescobar@nn-corp.com",
    department: "Ventas",
    role: "Account Exec",
    status: "active",
    salary: 5300000,
    joinDate: "2024-03-18",
  },
  {
    id: 18,
    name: "Roberto Salazar",
    email: "rsalazar@nn-corp.com",
    department: "Ingeniería",
    role: "CTO",
    status: "active",
    salary: 12000000,
    joinDate: "2017-01-15",
  },
];

// ============================================================================
// DATOS DE EJEMPLO — PRODUCTOS
// ¿Qué? Dataset alternativo para demostrar que DataTable funciona con cualquier entidad.
// ¿Para qué? El usuario puede alternar entre datasets con el toggle de la página.
// ¿Impacto? Demuestra el poder del generics — mismo componente, datos completamente distintos.
// ============================================================================
const PRODUCTS: Product[] = [
  {
    id: "P001",
    name: "Laptop Pro X1",
    category: "Computadores",
    price: 4500000,
    stock: 12,
    sku: "LPX1-2024",
  },
  {
    id: "P002",
    name: 'Monitor 4K 27"',
    category: "Monitores",
    price: 1800000,
    stock: 8,
    sku: "MON4K-27",
  },
  {
    id: "P003",
    name: "Teclado Mecánico",
    category: "Periféricos",
    price: 350000,
    stock: 45,
    sku: "KBD-MECH",
  },
  {
    id: "P004",
    name: "Mouse Inalámbrico",
    category: "Periféricos",
    price: 180000,
    stock: 62,
    sku: "MS-WRL",
  },
  {
    id: "P005",
    name: "Auriculares BT",
    category: "Audio",
    price: 520000,
    stock: 23,
    sku: "AUD-BT50",
  },
  {
    id: "P006",
    name: "Webcam HD 1080p",
    category: "Cámaras",
    price: 290000,
    stock: 17,
    sku: "CAM-HD1080",
  },
  {
    id: "P007",
    name: "Hub USB-C 7 puertos",
    category: "Accesorios",
    price: 145000,
    stock: 88,
    sku: "HUB-7P",
  },
  {
    id: "P008",
    name: "SSD 1TB NVMe",
    category: "Almacenamiento",
    price: 380000,
    stock: 34,
    sku: "SSD-1TB-NV",
  },
  {
    id: "P009",
    name: "RAM 16GB DDR5",
    category: "Memoria",
    price: 420000,
    stock: 20,
    sku: "RAM-16-D5",
  },
  {
    id: "P010",
    name: "Silla Ergonómica",
    category: "Mobiliario",
    price: 1200000,
    stock: 5,
    sku: "CHR-ERG",
  },
  {
    id: "P011",
    name: "Soporte Monitor",
    category: "Accesorios",
    price: 95000,
    stock: 40,
    sku: "MNT-SUPP",
  },
  {
    id: "P012",
    name: "Lámpara LED Escritorio",
    category: "Iluminación",
    price: 75000,
    stock: 55,
    sku: "LMP-LED",
  },
];

// ============================================================================
// DEFINICIÓN DE COLUMNAS — EMPLEADOS
// ¿Qué? Array de ColumnDef<Employee> que le dice a la tabla cómo renderizar cada campo.
// ¿Para qué? Separar la estructura de datos de su presentación visual.
// ¿Impacto? Cambiar el header, ancho o render fn no toca los datos ni el componente.
// ============================================================================
const EMPLOYEE_COLUMNS: ColumnDef<Employee>[] = [
  {
    key: "id",
    header: "ID",
    sortable: true,
    width: "60px",
  },
  {
    key: "name",
    header: "Nombre",
    sortable: true,
  },
  {
    key: "email",
    header: "Correo",
    sortable: false,
  },
  {
    key: "department",
    header: "Departamento",
    sortable: true,
  },
  {
    key: "role",
    header: "Cargo",
    sortable: true,
  },
  {
    // ¿Qué? Columna con renderizador personalizado — muestra un badge de color según el estado.
    // ¿Para qué? Enriquecer visualmente la tabla sin datos extra; la lógica vive en el render.
    // ¿Impacto? El render recibe el value ("active" | "inactive" | "on_leave") y el row completo.
    key: "status",
    header: "Estado",
    sortable: true,
    width: "120px",
    render: (value) => {
      const statusMap: Record<string, { label: string; className: string }> = {
        active: {
          label: "Activo",
          className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
        },
        inactive: {
          label: "Inactivo",
          className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
        },
        on_leave: {
          label: "Con permiso",
          className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
        },
      };
      const config = statusMap[value as string] ?? {
        label: String(value),
        className: "bg-gray-100 text-gray-800",
      };
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    // ¿Qué? Columna que formatea el salario como moneda colombiana (COP).
    // ¿Para qué? Demostrar que render fn puede transformar números a cualquier formato.
    // ¿Impacto? El valor raw (8500000) se muestra como "$8.500.000" — más legible para el usuario.
    key: "salary",
    header: "Salario",
    sortable: true,
    width: "140px",
    render: (value) =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(value as number),
  },
  {
    // ¿Qué? Columna que formatea la fecha ISO a formato legible en español.
    // ¿Para qué? Las fechas en formato "2021-03-15" son menos amigables que "15 mar. 2021".
    key: "joinDate",
    header: "Ingreso",
    sortable: true,
    width: "120px",
    render: (value) =>
      new Date(value as string).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

// ============================================================================
// DEFINICIÓN DE COLUMNAS — PRODUCTOS
// ¿Qué? Columnas para el dataset de productos con badge de stock bajo.
// ============================================================================
const PRODUCT_COLUMNS: ColumnDef<Product>[] = [
  { key: "id", header: "SKU", sortable: true, width: "90px" },
  { key: "name", header: "Producto", sortable: true },
  { key: "category", header: "Categoría", sortable: true },
  {
    key: "price",
    header: "Precio",
    sortable: true,
    width: "130px",
    render: (value) =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(value as number),
  },
  {
    // ¿Qué? Badge de stock que cambia de color cuando hay menos de 10 unidades.
    // ¿Impacto? El usuario identifica visualmente el stock crítico sin leer cada número.
    key: "stock",
    header: "Stock",
    sortable: true,
    width: "90px",
    render: (value) => {
      const qty = value as number;
      const isLow = qty < 10;
      return (
        <span
          className={`font-semibold tabular-nums ${isLow ? "text-red-600 dark:text-red-400" : "text-gray-800 dark:text-gray-200"}`}
        >
          {isLow && <span className="mr-1">⚠</span>}
          {qty}
        </span>
      );
    },
  },
  { key: "sku", header: "Referencia", sortable: false },
];

// ============================================================================
// COMPONENTE PRINCIPAL: DataTableDemoPage
// ¿Qué? Página que muestra el DataTable con dos datasets alternables (empleados / productos).
// ¿Para qué? Permitir explorar todas las características del componente sin backend real.
// ¿Impacto? Es un sandbox visual — ideal para presentaciones, revisiones de diseño y aprendizaje.
// ============================================================================
export function DataTableDemoPage() {
  // ¿Qué? Estado que controla qué dataset se muestra (employees | products).
  const [activeDataset, setActiveDataset] = useState<"employees" | "products">("employees");

  // ¿Qué? Estado de notificación para mostrar qué acción se ejecutó.
  // ¿Para qué? Demostrar que las acciones de fila reciben el objeto completo de la fila.
  const [lastAction, setLastAction] = useState<string | null>(null);

  // ============================================================================
  // ACCIONES DE FILA — EMPLEADOS
  // ¿Qué? Definición de las acciones disponibles en el menú de tres puntos por fila.
  // ¿Para qué? Cada acción recibe el objeto Employee completo para operar sobre él.
  // ¿Impacto? En producción, onClick llamaría a la API; aquí muestra el nombre del empleado.
  // ============================================================================
  const employeeActions: RowAction<Employee>[] = [
    {
      label: "Ver perfil",
      icon: "👤",
      onClick: (employee) => setLastAction(`Ver perfil de: ${employee.name}`),
    },
    {
      label: "Editar",
      icon: "✏️",
      onClick: (employee) => setLastAction(`Editar: ${employee.name} (ID: ${employee.id})`),
    },
    {
      label: "Desactivar",
      icon: "🚫",
      variant: "danger",
      onClick: (employee) => setLastAction(`Desactivar: ${employee.name}`),
      // ¿Qué? Deshabilitar la acción si el empleado ya está inactivo.
      // ¿Impacto? El botón se muestra atenuado y no puede clickearse — feedback visual claro.
      disabled: (employee) => employee.status === "inactive",
    },
  ];

  const productActions: RowAction<Product>[] = [
    {
      label: "Ver detalles",
      icon: "🔍",
      onClick: (product) => setLastAction(`Ver: ${product.name} — SKU: ${product.sku}`),
    },
    {
      label: "Editar precio",
      icon: "💰",
      onClick: (product) => setLastAction(`Editar precio de: ${product.name}`),
    },
    {
      label: "Eliminar",
      icon: "🗑️",
      variant: "danger",
      onClick: (product) => setLastAction(`Eliminar producto: ${product.name}`),
    },
  ];

  const isEmployees = activeDataset === "employees";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Encabezado de la página ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Demo — Componente DataTable
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Demostración interactiva del componente genérico{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">
            DataTable&lt;T&gt;
          </code>{" "}
          — búsqueda, ordenación por columna, paginación, estilo cebra y acciones por fila.
        </p>
      </div>

      {/* ── Selector de dataset ── */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dataset:</span>
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => {
              setActiveDataset("employees");
              setLastAction(null);
            }}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              isEmployees
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            👥 Empleados ({EMPLOYEES.length})
          </button>
          <button
            onClick={() => {
              setActiveDataset("products");
              setLastAction(null);
            }}
            className={`px-4 py-1.5 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
              activeDataset === "products"
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            📦 Productos ({PRODUCTS.length})
          </button>
        </div>
      </div>

      {/* ── Notificación de última acción ── */}
      {lastAction && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">Acción ejecutada:</span> {lastAction}
          </p>
          <button
            onClick={() => setLastAction(null)}
            className="ml-4 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
            aria-label="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── DataTable con dataset de empleados ── */}
      {isEmployees && (
        <DataTable<Employee>
          data={EMPLOYEES}
          columns={EMPLOYEE_COLUMNS}
          actions={employeeActions}
          caption="Directorio de Empleados — NN Corp"
          pageSize={8}
          pageSizeOptions={[5, 8, 15, 18]}
          searchPlaceholder="Buscar por nombre, cargo, departamento..."
          emptyMessage="No se encontraron empleados con ese criterio."
          exportable
          exportFilename="empleados_nn_corp"
        />
      )}

      {/* ── DataTable con dataset de productos ── */}
      {activeDataset === "products" && (
        <DataTable<Product>
          data={PRODUCTS}
          columns={PRODUCT_COLUMNS}
          actions={productActions}
          caption="Catálogo de Productos — NN Corp"
          pageSize={8}
          pageSizeOptions={[5, 8, 12]}
          searchPlaceholder="Buscar por nombre, categoría, referencia..."
          emptyMessage="No se encontraron productos con ese criterio."
          exportable
          exportFilename="catalogo_productos_nn_corp"
        />
      )}

      {/* ── Guía de características ── */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
          ¿Qué puedes probar?
        </h2>
        <ul className="grid gap-1.5 text-sm text-gray-600 dark:text-gray-400 sm:grid-cols-2">
          <li>
            🔍 <strong>Búsqueda:</strong> escribe en el campo — filtra cualquier columna
          </li>
          <li>
            ↕ <strong>Ordenación:</strong> haz clic en un encabezado con flecha
          </li>
          <li>
            ⚡ <strong>Paginación:</strong> navega con los botones o cambia el tamaño de página
          </li>
          <li>
            ⏯ <strong>Acciones:</strong> haz clic en los tres puntos de cualquier fila
          </li>
          <li>
            📄 <strong>Exportar CSV:</strong> descarga los datos filtrados como archivo CSV
          </li>
          <li>
            📊 <strong>Exportar PDF:</strong> descarga los datos filtrados como archivo PDF
          </li>
          <li>
            🎨 <strong>Estilo cebra:</strong> filas alternadas para mejor legibilidad
          </li>
          <li>
            📱 <strong>Responsivo:</strong> reduce la ventana para ver scroll horizontal
          </li>
        </ul>
      </div>
    </div>
  );
}
