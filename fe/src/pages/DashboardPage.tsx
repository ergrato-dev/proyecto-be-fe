/**
 * Archivo: pages/DashboardPage.tsx
 * Descripción: Panel principal del usuario autenticado — demo educativa del componente DataTable.
 * ¿Para qué? Mostrar cómo un componente genérico DataTable<T> puede renderizar cualquier
 *            entidad de negocio (empleados, productos) sin reescribir la lógica de tabla.
 * ¿Impacto? Demuestra el principio DRY: un solo componente reutilizable para múltiples casos de uso.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef, RowAction } from "@/components/ui/DataTable";

// ============================================================================
// TIPOS DE DATOS DE EJEMPLO
// ¿Qué? Interfaces que tipan los datos de demo de la tabla.
// ¿Para qué? Mostrar que DataTable<T> es completamente genérico — solo cambias T.
// ¿Impacto? TypeScript detecta en tiempo de compilación si defines mal una columna.
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
// DATOS DE EJEMPLO — EMPLEADOS (18 registros)
// ¿Qué? Array de empleados ficticios de NN Corp.
// ¿Para qué? Tener suficientes filas para ver paginación (pageSize=8 → 3 páginas).
// ¿Impacto? Los datos son estáticos aquí; en producción vendrían de la API.
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
// DATOS DE EJEMPLO — PRODUCTOS (12 registros)
// ¿Qué? Dataset alternativo para demostrar que DataTable funciona con cualquier entidad.
// ¿Para qué? El toggle Empleados/Productos pasa datos distintos al MISMO componente.
// ¿Impacto? Demuestra el poder del patrón genérico sin duplicar lógica de tabla.
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
// ¿Qué? Array de ColumnDef<Employee> — le dice a DataTable cómo renderizar cada campo.
// ¿Para qué? Separar la estructura de datos de su presentación visual.
// ¿Impacto? Cambiar un header o render fn no toca los datos ni el componente DataTable.
// ============================================================================
const EMPLOYEE_COLUMNS: ColumnDef<Employee>[] = [
  { key: "id", header: "ID", sortable: true, width: "60px" },
  { key: "name", header: "Nombre", sortable: true },
  { key: "email", header: "Correo", sortable: false },
  { key: "department", header: "Departamento", sortable: true },
  { key: "role", header: "Cargo", sortable: true },
  {
    // ¿Qué? Render fn personalizado — badge de color según el valor de status.
    // ¿Para qué? Enriquecer la celda sin modificar el componente DataTable.
    // ¿Impacto? La lógica visual está localizada aquí — cambiar el estilo del badge
    //           no requiere tocar ni DataTable ni el modelo de datos.
    key: "status",
    header: "Estado",
    sortable: true,
    width: "130px",
    render: (value) => {
      const map: Record<string, { label: string; cls: string }> = {
        active: {
          label: "Activo",
          cls: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
        },
        inactive: {
          label: "Inactivo",
          cls: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
        },
        on_leave: {
          label: "Con permiso",
          cls: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
        },
      };
      const cfg = map[value as string] ?? {
        label: String(value),
        cls: "bg-gray-100 text-gray-800",
      };
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.cls}`}
        >
          {cfg.label}
        </span>
      );
    },
  },
  {
    // ¿Qué? Render fn que formatea el número como moneda colombiana (COP).
    // ¿Para qué? El valor raw (8500000) es difícil de leer — "$8.500.000" no.
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
    // ¿Qué? Badge numérico que se vuelve rojo cuando el stock es menor a 10.
    // ¿Impacto? El usuario identifica stock crítico visualmente sin leer cada número.
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
          {isLow && (
            <span className="mr-1" aria-hidden="true">
              ⚠
            </span>
          )}
          {qty}
        </span>
      );
    },
  },
  { key: "sku", header: "Referencia", sortable: false },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * ¿Qué? Panel principal del usuario autenticado con demo educativa del componente DataTable.
 * ¿Para qué? Mostrar cómo un componente genérico puede ser reutilizado con distintos datasets.
 * ¿Impacto? El aprendiz entiende el patrón "componente genérico + definición de columnas externas".
 */
export function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  // ¿Qué? Controla qué dataset se muestra en la tabla — empleados o productos.
  // ¿Para qué? Demostrar visualmente que el mismo DataTable funciona con tipos distintos.
  const [activeDataset, setActiveDataset] = useState<"employees" | "products">("employees");

  // ¿Qué? Guarda la última acción de fila ejecutada para mostrarla como feedback.
  // ¿Para qué? Demostrar que las acciones reciben el objeto completo de la fila (no solo el ID).
  // ¿Impacto? En producción, onClick llamaría a la API — aquí muestra el concepto.
  const [lastAction, setLastAction] = useState<string | null>(null);

  // ============================================================================
  // ACCIONES DE FILA — EMPLEADOS
  // ¿Qué? Menú de acciones disponibles en cada fila de la tabla de empleados.
  // ¿Para qué? Mostrar el patrón RowAction<T> — cada acción recibe el Employee completo.
  // ¿Impacto? Permite operaciones contextuales por fila (ver, editar, desactivar).
  // ============================================================================
  const employeeActions: RowAction<Employee>[] = [
    {
      label: "Ver perfil",
      onClick: (row) => setLastAction(`Ver perfil → ${row.name} (ID: ${row.id})`),
    },
    {
      label: "Editar",
      onClick: (row) => setLastAction(`Editar → ${row.name} — ${row.role}`),
    },
    {
      label: "Desactivar",
      variant: "danger",
      disabled: (row) => row.status === "inactive",
      onClick: (row) => setLastAction(`Desactivar → ${row.name}`),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Encabezado de bienvenida ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t("dashboard.welcome", { name: `${user?.first_name} ${user?.last_name}` })}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("dashboard.subtitle")}</p>
      </div>

      {/* ── Callout educativo: ¿Qué es DataTable? ──
          ¿Qué? Bloque informativo que explica el patrón de componente genérico.
          ¿Para qué? Contextualizar la demo para el aprendiz antes de que interactúe con la tabla.
          ¿Impacto? Sin esta explicación, la tabla parece solo un ejemplo; con ella, entiende el patrón.
      */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800/60 dark:bg-blue-950/30">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 text-lg" aria-hidden="true">
            💡
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              Concepto clave — Componente DataTable genérico
            </h2>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
              En lugar de crear una tabla desde cero cada vez que necesitas mostrar datos, puedes
              construir un único componente{" "}
              <code className="rounded bg-blue-100 px-1 text-xs dark:bg-blue-900">
                DataTable&lt;T&gt;
              </code>{" "}
              y pasarle la información como parámetros:
            </p>
            {/* ¿Qué? Bloque de código ilustrativo con la API del componente. */}
            {/* ¿Para qué? Ver la firma concreta ayuda más que la descripción textual. */}
            <pre className="mt-3 overflow-x-auto rounded-lg bg-blue-100 p-3 text-xs text-blue-900 dark:bg-blue-950 dark:text-blue-200">
              {`<DataTable<Employee>
  data={EMPLOYEES}          {/* T[] — cualquier array */}
  columns={EMPLOYEE_COLUMNS} {/* ColumnDef<T>[] — define cómo renderizar cada campo */}
  actions={employeeActions}  {/* RowAction<T>[] — menú por fila */}
  searchable              {/* activa búsqueda por texto */}
  exportable              {/* activa exportación CSV/PDF */}
  pageSize={8}            {/* registros por página */}
/>`}
            </pre>
            <p className="mt-2 text-xs text-blue-700 dark:text-blue-400">
              Cambia <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">Employee</code> por{" "}
              <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">Product</code> — el
              componente se comporta igual. Pruébalo con el toggle de abajo.
            </p>
          </div>
        </div>
      </div>

      {/* ── Sección DataTable con toggle de dataset ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Ejemplo en vivo — datos mock
          </h2>
          {/* Toggle de dataset — demuestra el swap de data + columns */}
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setActiveDataset("employees")}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                activeDataset === "employees"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Empleados
            </button>
            <button
              type="button"
              onClick={() => setActiveDataset("products")}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                activeDataset === "products"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Productos
            </button>
          </div>
        </div>

        {/* Feedback de última acción ejecutada */}
        {lastAction && (
          <div
            className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2
            dark:border-green-800/50 dark:bg-green-950/30"
          >
            <span className="text-xs font-medium text-green-800 dark:text-green-300">
              Acción ejecutada:
            </span>
            <span className="text-xs text-green-700 dark:text-green-400">{lastAction}</span>
            <button
              type="button"
              onClick={() => setLastAction(null)}
              className="ml-auto text-green-500 hover:text-green-700 dark:hover:text-green-300"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        )}

        {/* ── DataTable — el componente central de esta demo ──
            ¿Qué? Renderiza la tabla genérica con el dataset activo.
            ¿Para qué? El mismo componente con data y columns distintos = comportamiento idéntico.
            ¿Impacto? Si cambias el dataset, DataTable no sabe ni le importa — solo recibe datos.
        */}
        {activeDataset === "employees" ? (
          <DataTable<Employee>
            data={EMPLOYEES}
            columns={EMPLOYEE_COLUMNS}
            actions={employeeActions}
            pageSize={8}
            searchable
            exportable
            caption="Empleados — NN Corp (datos demo)"
            emptyMessage="No se encontraron empleados."
          />
        ) : (
          <DataTable<Product>
            data={PRODUCTS}
            columns={PRODUCT_COLUMNS}
            pageSize={8}
            searchable
            exportable
            caption="Inventario de productos — NN Corp (datos demo)"
            emptyMessage="No se encontraron productos."
          />
        )}
      </div>
    </div>
  );
}
