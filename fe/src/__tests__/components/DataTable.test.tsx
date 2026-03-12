/**
 * Archivo: __tests__/components/DataTable.test.tsx
 * Descripción: Tests del componente DataTable — renderizado, búsqueda, ordenación,
 *              paginación, acciones por fila y estados de carga/vacío.
 * ¿Para qué? Verificar que cada característica del DataTable funciona correctamente
 *            de forma aislada y combinada.
 * ¿Impacto? Garantiza que refactorizaciones futuras no rompan la funcionalidad
 *           existente y sirve de documentación viva del comportamiento esperado.
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type ColumnDef, type RowAction } from "@/components/ui/DataTable";

// ============================================================================
// DATOS DE PRUEBA
// ¿Qué? Dataset ficticio usado en los tests.
// ¿Para qué? Proveer datos predecibles para verificar ordenación, búsqueda y paginación.
// ¿Impacto? Si los datos cambian, los tests que dependen de valores específicos fallarían,
//           alertando al desarrollador de que los datos de prueba deben actualizarse.
// ============================================================================

interface TestUser {
  id: number;
  name: string;
  email: string;
  role: string;
  age: number;
  active: boolean;
}

const TEST_DATA: TestUser[] = [
  { id: 1, name: "Ana García", email: "ana@example.com", role: "admin", age: 30, active: true },
  { id: 2, name: "Bruno López", email: "bruno@example.com", role: "user", age: 25, active: true },
  { id: 3, name: "Carmen Ruiz", email: "carmen@example.com", role: "user", age: 28, active: false },
  {
    id: 4,
    name: "Daniel Mora",
    email: "daniel@example.com",
    role: "editor",
    age: 35,
    active: true,
  },
  { id: 5, name: "Elena Torres", email: "elena@example.com", role: "user", age: 22, active: false },
  {
    id: 6,
    name: "Felipe Vargas",
    email: "felipe@example.com",
    role: "admin",
    age: 40,
    active: true,
  },
  { id: 7, name: "Gloria Soto", email: "gloria@example.com", role: "user", age: 33, active: true },
  {
    id: 8,
    name: "Héctor Muñoz",
    email: "hector@example.com",
    role: "editor",
    age: 27,
    active: false,
  },
  {
    id: 9,
    name: "Isabel Castro",
    email: "isabel@example.com",
    role: "user",
    age: 31,
    active: true,
  },
  {
    id: 10,
    name: "Javier Reyes",
    email: "javier@example.com",
    role: "user",
    age: 29,
    active: true,
  },
  {
    id: 11,
    name: "Karen Núñez",
    email: "karen@example.com",
    role: "editor",
    age: 26,
    active: false,
  },
  { id: 12, name: "Luis Herrera", email: "luis@example.com", role: "user", age: 45, active: true },
];

// ¿Qué? Definición de columnas reutilizable en múltiples tests.
const TEST_COLUMNS: ColumnDef<TestUser>[] = [
  { key: "name", header: "Nombre", sortable: true },
  { key: "email", header: "Email", sortable: false },
  { key: "role", header: "Rol", sortable: true },
  { key: "age", header: "Edad", sortable: true },
];

// ============================================================================
// HELPERS DE TEST
// ¿Qué? Funciones reutilizables para reducir repetición en los tests.
// ¿Para qué? DRY (Don't Repeat Yourself) en el código de tests.
// ============================================================================

/**
 * Renderiza el DataTable con datos y columnas por defecto.
 * Acepta props adicionales para sobreescribir los defaults.
 */
function renderTable(props: Partial<Parameters<typeof DataTable<TestUser>>[0]> = {}) {
  return render(<DataTable data={TEST_DATA} columns={TEST_COLUMNS} pageSize={5} {...props} />);
}

// ============================================================================
// SUITE: Renderizado básico
// ============================================================================

describe("DataTable — Renderizado básico", () => {
  // ¿Qué? Verifica que los encabezados de columna están presentes.
  it("renderiza todos los encabezados de columna", () => {
    renderTable();

    expect(screen.getByRole("columnheader", { name: /nombre/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /rol/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /edad/i })).toBeInTheDocument();
  });

  // ¿Qué? Verifica que los datos de la primera página se muestran.
  it("renderiza las filas de la primera página", () => {
    renderTable({ pageSize: 5 });

    // Con pageSize=5, solo los primeros 5 usuarios deben estar en el DOM.
    expect(screen.getByText("Ana García")).toBeInTheDocument();
    expect(screen.getByText("Bruno López")).toBeInTheDocument();
    expect(screen.queryByText("Felipe Vargas")).not.toBeInTheDocument();
  });

  // ¿Qué? Verifica que se muestra el mensaje "vacío" cuando data=[].
  it("muestra el mensaje de vacío cuando no hay datos", () => {
    renderTable({ data: [] });
    expect(screen.getByText("No se encontraron resultados.")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que el mensaje de vacío es personalizable.
  it("muestra el mensaje de vacío personalizado", () => {
    renderTable({ data: [], emptyMessage: "Lista vacía por ahora." });
    expect(screen.getByText("Lista vacía por ahora.")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que el caption se renderiza cuando se proporciona.
  it("renderiza el caption cuando se proporciona", () => {
    renderTable({ caption: "Gestión de usuarios" });
    expect(screen.getByText("Gestión de usuarios")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que el caption no se renderiza si no se proporciona.
  it("no renderiza caption si no se proporciona", () => {
    renderTable();
    expect(screen.queryByRole("caption")).not.toBeInTheDocument();
  });

  // ¿Qué? Verifica que valores nulos/undefined se muestran como "—".
  it("muestra '—' para valores nulos", () => {
    const dataWithNull = [
      {
        id: 1,
        name: null as unknown as string,
        email: "x@x.com",
        role: "user",
        age: 20,
        active: true,
      },
    ];
    renderTable({ data: dataWithNull, pageSize: 10 });
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});

// ============================================================================
// SUITE: Renderer personalizado en columnas
// ============================================================================

describe("DataTable — Renderizador personalizado de columna", () => {
  // ¿Qué? Verifica que la función `render` se ejecuta para cada celda.
  it("usa el renderizador personalizado de columna", () => {
    const columnsWithBadge: ColumnDef<TestUser>[] = [
      { key: "name", header: "Nombre", sortable: false },
      {
        key: "active",
        header: "Estado",
        render: (value) => <span data-testid="badge">{value ? "Activo" : "Inactivo"}</span>,
      },
    ];

    renderTable({ columns: columnsWithBadge, pageSize: 3 });

    // Debe haber 3 badges — uno por fila de la primera página.
    const badges = screen.getAllByTestId("badge");
    expect(badges).toHaveLength(3);
  });

  // ¿Qué? Verifica que el renderizador recibe el row completo.
  it("el renderizador recibe el objeto de fila completo", () => {
    const captured: TestUser[] = [];

    const cols: ColumnDef<TestUser>[] = [
      {
        key: "name",
        header: "Nombre",
        render: (_, row) => {
          captured.push(row);
          return <span>{row.name}</span>;
        },
      },
    ];

    renderTable({ columns: cols, pageSize: 2 });

    // Los primeros 2 usuarios deben haberse capturado.
    expect(captured.length).toBeGreaterThanOrEqual(2);
    expect(captured[0].id).toBe(1);
    expect(captured[1].id).toBe(2);
  });
});

// ============================================================================
// SUITE: Búsqueda global
// ============================================================================

describe("DataTable — Búsqueda global", () => {
  // ¿Qué? Verifica que escribir en el campo de búsqueda filtra las filas.
  it("filtra filas al escribir en la búsqueda", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 12 });

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "admin");

    // Solo Ana García y Felipe Vargas tienen rol "admin".
    expect(screen.getByText("Ana García")).toBeInTheDocument();
    expect(screen.getByText("Felipe Vargas")).toBeInTheDocument();
    expect(screen.queryByText("Bruno López")).not.toBeInTheDocument();
  });

  // ¿Qué? Verifica que la búsqueda es case-insensitive.
  it("la búsqueda es insensible a mayúsculas", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 12 });

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "ANA");

    expect(screen.getByText("Ana García")).toBeInTheDocument();
    expect(screen.queryByText("Bruno López")).not.toBeInTheDocument();
  });

  // ¿Qué? Verifica que limpiar la búsqueda restaura todos los resultados.
  it("mostrar todos los datos al limpiar la búsqueda", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 12 });

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "admin");
    await user.clear(searchInput);

    // Con la búsqueda limpia, todos los usuarios de la primera página deben aparecer.
    expect(screen.getByText("Ana García")).toBeInTheDocument();
    expect(screen.getByText("Bruno López")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que si no hay resultados se muestra el mensaje de vacío.
  it("muestra mensaje de vacío si la búsqueda no tiene resultados", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 12 });

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "zzzterminoquenoaparece");

    expect(screen.getByText("No se encontraron resultados.")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que el campo de búsqueda no se muestra cuando searchable=false.
  it("oculta el campo de búsqueda cuando searchable=false", () => {
    renderTable({ searchable: false });
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  // ¿Qué? Verifica que el placeholder personalizado aparece en el campo de búsqueda.
  it("muestra el placeholder personalizado", () => {
    renderTable({ searchPlaceholder: "Filtrar usuarios..." });
    expect(screen.getByPlaceholderText("Filtrar usuarios...")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que buscar reestablece la paginación a la página 1.
  it("resetea a la página 1 al buscar", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 5 });

    // Ir a la página 2.
    const nextButton = screen.getByRole("button", { name: /página siguiente/i });
    await user.click(nextButton);

    // Buscar algo — debe volver a página 1.
    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "a");

    // El botón de página 1 debería tener aria-current="page".
    const page1Button = screen.getByRole("button", { name: /ir a página 1/i });
    expect(page1Button).toHaveAttribute("aria-current", "page");
  });
});

// ============================================================================
// SUITE: Ordenación de columnas
// ============================================================================

describe("DataTable — Ordenación de columnas", () => {
  // ¿Qué? Verifica que hacer clic en un encabezado sortable ordena ascendente.
  it("ordena ascendente al hacer clic en encabezado sortable", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 12 });

    const nameHeader = screen.getByRole("columnheader", { name: /nombre/i });
    await user.click(nameHeader);

    // El header debe indicar orden ascendente.
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");

    // La primera fila debe ser "Ana García" (orden alfabético A → Z).
    const rows = screen.getAllByRole("row");
    // rows[0] es el encabezado, rows[1] es la primera fila de datos.
    expect(within(rows[1]).getByText("Ana García")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que un segundo clic invierte a descendente.
  it("invierte a descendente al hacer doble clic en el mismo encabezado", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 12 });

    const nameHeader = screen.getByRole("columnheader", { name: /nombre/i });
    await user.click(nameHeader); // 1er clic → asc
    await user.click(nameHeader); // 2do clic → desc

    expect(nameHeader).toHaveAttribute("aria-sort", "descending");

    // La primera fila debe ser "Luis Herrera" (última alfabéticamente en el set).
    const rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("Luis Herrera")).toBeInTheDocument();
  });

  // ¿Qué? Verifica la ordenación numérica (por edad).
  it("ordena números correctamente (edad asc)", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 12 });

    const ageHeader = screen.getByRole("columnheader", { name: /edad/i });
    await user.click(ageHeader);

    // Elena Torres tiene 22 años — la más joven.
    const rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("Elena Torres")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que columnas no sortables no tienen aria-sort.
  it("columnas no sortables no tienen aria-sort", () => {
    renderTable();
    const emailHeader = screen.getByRole("columnheader", { name: /email/i });
    expect(emailHeader).not.toHaveAttribute("aria-sort");
  });

  // ¿Qué? Verifica que hacer clic en una columna no sortable no ordena.
  it("no ordena al hacer clic en columna no sortable", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 12 });

    const emailHeader = screen.getByRole("columnheader", { name: /email/i });
    await user.click(emailHeader);

    // Sin orden activo, el encabezado de nombre no debería tener aria-sort activo.
    expect(emailHeader).not.toHaveAttribute("aria-sort");
  });
});

// ============================================================================
// SUITE: Paginación
// ============================================================================

describe("DataTable — Paginación", () => {
  // ¿Qué? Verifica que el botón "siguiente" avanza de página.
  it("navega a la página siguiente al hacer clic en 'siguiente'", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 5 });

    // Página 1: usuarios 1-5.
    expect(screen.getByText("Ana García")).toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: /página siguiente/i });
    await user.click(nextButton);

    // Página 2: usuarios 6-10.
    expect(screen.queryByText("Ana García")).not.toBeInTheDocument();
    expect(screen.getByText("Felipe Vargas")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que el botón "anterior" retrocede de página.
  it("retrocede a la página anterior al hacer clic en 'anterior'", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 5 });

    // Ir a página 2.
    const nextButton = screen.getByRole("button", { name: /página siguiente/i });
    await user.click(nextButton);

    // Volver a página 1.
    const prevButton = screen.getByRole("button", { name: /página anterior/i });
    await user.click(prevButton);

    expect(screen.getByText("Ana García")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que el botón "anterior" está deshabilitado en la página 1.
  it("deshabilita 'anterior' en la primera página", () => {
    renderTable({ pageSize: 5 });
    const prevButton = screen.getByRole("button", { name: /página anterior/i });
    expect(prevButton).toBeDisabled();
  });

  // ¿Qué? Verifica que el botón "siguiente" está deshabilitado en la última página.
  it("deshabilita 'siguiente' en la última página", async () => {
    const user = userEvent.setup();
    // Con 12 filas y pageSize=5 → 3 páginas. Ir a la última.
    renderTable({ pageSize: 5 });

    const nextButton = screen.getByRole("button", { name: /página siguiente/i });
    await user.click(nextButton); // → página 2
    await user.click(nextButton); // → página 3 (última)

    expect(nextButton).toBeDisabled();
  });

  // ¿Qué? Verifica que se puede navegar a una página específica.
  it("navega a una página específica al hacer clic en su número", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 5 });

    const page3Button = screen.getByRole("button", { name: /ir a página 3/i });
    await user.click(page3Button);

    // Página 3: usuarios 11-12.
    expect(screen.getByText("Karen Núñez")).toBeInTheDocument();
    expect(screen.getByText("Luis Herrera")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que la página activa tiene aria-current="page".
  it("marca la página activa con aria-current='page'", () => {
    renderTable({ pageSize: 5 });
    const page1Button = screen.getByRole("button", { name: /ir a página 1/i });
    expect(page1Button).toHaveAttribute("aria-current", "page");
  });

  // ¿Qué? Verifica que cambiar el selector de filas-por-página funciona.
  it("muestra más filas al cambiar el selector de tamaño de página", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 5, pageSizeOptions: [5, 10, 25] });

    // Inicialmente: solo los primeros 5 usuarios.
    expect(screen.queryByText("Felipe Vargas")).not.toBeInTheDocument();

    // Cambiar a 10 filas por página.
    const pageSizeSelect = screen.getByRole("combobox", { name: /filas por página/i });
    await user.selectOptions(pageSizeSelect, "10");

    // Ahora todos los 10 primeros deben estar visibles.
    expect(screen.getByText("Felipe Vargas")).toBeInTheDocument();
    expect(screen.getByText("Gloria Soto")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que la información de rango es correcta.
  it("muestra el rango correcto de filas visibles", () => {
    renderTable({ pageSize: 5 });
    // "Mostrando 1 – 5 de 12" — buscamos el párrafo de rango por su clase característica.
    // Usamos un matcher de texto parcial para evitar problemas con los nodos internos.
    const rangeInfo = screen.getByText((content, element) => {
      return element?.tagName === "P" && content.includes("Mostrando");
    });
    expect(rangeInfo).toBeInTheDocument();
    expect(within(rangeInfo).getByText("5")).toBeInTheDocument();
    expect(within(rangeInfo).getByText("12")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que con pocos datos no se muestra el paginador.
  it("no muestra controles de paginación si todos los datos caben en una página", () => {
    renderTable({ data: TEST_DATA.slice(0, 3), pageSize: 10 });
    expect(
      screen.queryByRole("navigation", { name: /navegación de páginas/i }),
    ).not.toBeInTheDocument();
  });
});

// ============================================================================
// SUITE: Menú de acciones por fila
// ============================================================================

describe("DataTable — Menú de acciones por fila", () => {
  const mockEdit = vi.fn();
  const mockDelete = vi.fn();

  // ¿Qué? Definición de acciones reutilizable en los tests de acciones.
  const TEST_ACTIONS: RowAction<TestUser>[] = [
    { label: "Editar", onClick: mockEdit },
    { label: "Eliminar", onClick: mockDelete, variant: "danger" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ¿Qué? Verifica que si no hay acciones no aparece columna de acciones.
  it("no renderiza columna de acciones si no se pasan actions", () => {
    renderTable();
    // No debe haber botones de tres puntos.
    expect(screen.queryByLabelText(/abrir menú de acciones/i)).not.toBeInTheDocument();
  });

  // ¿Qué? Verifica que se renderiza un botón de tres puntos por cada fila visible.
  it("renderiza un botón de acciones por cada fila visible", () => {
    renderTable({ actions: TEST_ACTIONS, pageSize: 5 });
    const menuButtons = screen.getAllByLabelText(/abrir menú de acciones/i);
    expect(menuButtons).toHaveLength(5);
  });

  // ¿Qué? Verifica que el menú se abre al hacer clic en el botón de tres puntos.
  it("abre el menú al hacer clic en el botón de tres puntos", async () => {
    const user = userEvent.setup();
    renderTable({ actions: TEST_ACTIONS, pageSize: 5 });

    const firstMenuButton = screen.getAllByLabelText(/abrir menú de acciones/i)[0];
    await user.click(firstMenuButton);

    // Las opciones del menú deben ser visibles.
    expect(screen.getByRole("menuitem", { name: "Editar" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Eliminar" })).toBeInTheDocument();
  });

  // ¿Qué? Verifica que hacer clic en una acción ejecuta el callback correcto.
  it("ejecuta el onClick de la acción con el objeto de la fila", async () => {
    const user = userEvent.setup();
    renderTable({ actions: TEST_ACTIONS, pageSize: 5 });

    // Abrir el menú de la primera fila.
    const firstMenuButton = screen.getAllByLabelText(/abrir menú de acciones/i)[0];
    await user.click(firstMenuButton);

    // Hacer clic en "Editar".
    await user.click(screen.getByRole("menuitem", { name: "Editar" }));

    // El callback debe haberse llamado con el usuario de la primera fila.
    expect(mockEdit).toHaveBeenCalledTimes(1);
    expect(mockEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 1, name: "Ana García" }));
  });

  // ¿Qué? Verifica que el menú se cierra después de seleccionar una acción.
  it("cierra el menú después de ejecutar una acción", async () => {
    const user = userEvent.setup();
    renderTable({ actions: TEST_ACTIONS, pageSize: 5 });

    const firstMenuButton = screen.getAllByLabelText(/abrir menú de acciones/i)[0];
    await user.click(firstMenuButton);
    await user.click(screen.getByRole("menuitem", { name: "Editar" }));

    // El menú debe haberse cerrado.
    expect(screen.queryByRole("menuitem", { name: "Editar" })).not.toBeInTheDocument();
  });

  // ¿Qué? Verifica que el menú se cierra al hacer clic fuera de él.
  it("cierra el menú al hacer clic fuera", async () => {
    const user = userEvent.setup();
    renderTable({ actions: TEST_ACTIONS, pageSize: 5 });

    const firstMenuButton = screen.getAllByLabelText(/abrir menú de acciones/i)[0];
    await user.click(firstMenuButton);

    // Hacer clic fuera del menú.
    await user.click(document.body);

    expect(screen.queryByRole("menuitem", { name: "Editar" })).not.toBeInTheDocument();
  });

  // ¿Qué? Verifica que una acción con disabled=() => true se renderiza deshabilitada.
  it("deshabilita una acción cuando disabled() retorna true", async () => {
    const user = userEvent.setup();

    const actionsWithDisabled: RowAction<TestUser>[] = [
      {
        label: "Activar",
        onClick: mockEdit,
        // Solo habilitar para usuarios inactivos.
        disabled: (row) => row.active,
      },
    ];

    renderTable({ actions: actionsWithDisabled, pageSize: 5 });

    // La primera fila es Ana García que sí está activa — botón deshabilitado.
    const firstMenuButton = screen.getAllByLabelText(/abrir menú de acciones/i)[0];
    await user.click(firstMenuButton);

    const activarItem = screen.getByRole("menuitem", { name: "Activar" });
    expect(activarItem).toBeDisabled();
  });

  // ¿Qué? Verifica que solo un menú puede estar abierto a la vez.
  it("solo puede estar abierto un menú a la vez", async () => {
    const user = userEvent.setup();
    renderTable({ actions: TEST_ACTIONS, pageSize: 5 });

    const menuButtons = screen.getAllByLabelText(/abrir menú de acciones/i);

    // Abrir el primer menú.
    await user.click(menuButtons[0]);
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);

    // Abrir el segundo menú — el primero debe cerrarse.
    await user.click(menuButtons[1]);

    // Sigue habiendo exactamente 2 menuitems (los del segundo menú).
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
  });
});

// ============================================================================
// SUITE: Estado de carga (isLoading)
// ============================================================================

describe("DataTable — Estado de carga", () => {
  // ¿Qué? Verifica que el skeleton se muestra cuando isLoading=true.
  it("muestra skeleton rows cuando isLoading es true", () => {
    renderTable({ isLoading: true, pageSize: 5 });

    // No deben verse datos reales.
    expect(screen.queryByText("Ana García")).not.toBeInTheDocument();
  });

  // ¿Qué? Verifica que los encabezados sí se muestran durante la carga.
  it("sigue mostrando los encabezados de columna durante la carga", () => {
    renderTable({ isLoading: true });
    expect(screen.getByRole("columnheader", { name: /nombre/i })).toBeInTheDocument();
  });
});

// ============================================================================
// SUITE: Notación de punto en claves de columna
// ============================================================================

describe("DataTable — Notación de punto (campos anidados)", () => {
  interface NestedData {
    id: number;
    profile: {
      displayName: string;
      address: {
        city: string;
      };
    };
  }

  // ¿Qué? Verifica que se puede acceder a campos anidados con notación de punto.
  it("soporta notación de punto para acceder a campos anidados", () => {
    const nestedData: NestedData[] = [
      { id: 1, profile: { displayName: "Ana", address: { city: "Bogotá" } } },
      { id: 2, profile: { displayName: "Bruno", address: { city: "Medellín" } } },
    ];

    const nestedCols: ColumnDef<NestedData>[] = [
      { key: "profile.displayName", header: "Nombre" },
      { key: "profile.address.city", header: "Ciudad" },
    ];

    render(<DataTable data={nestedData} columns={nestedCols} pageSize={10} />);

    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Bogotá")).toBeInTheDocument();
    expect(screen.getByText("Medellín")).toBeInTheDocument();
  });
});

// ============================================================================
// SUITE: Integración — combinación de funcionalidades
// ============================================================================

describe("DataTable — Integración", () => {
  // ¿Qué? Verifica que búsqueda + ordenación funcionan juntas correctamente.
  it("combina búsqueda y ordenación correctamente", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 12 });

    // Buscar "user" → filtra por rol user.
    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "user");

    // Ordenar por nombre ascendente.
    const nameHeader = screen.getByRole("columnheader", { name: /nombre/i });
    await user.click(nameHeader);

    // El primer resultado entre los "user" ordenados debe ser "Bruno López".
    const rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("Bruno López")).toBeInTheDocument();
  });

  // ¿Qué? Verifica que búsqueda + paginación funciona: el conteo de resultados se actualiza.
  it("actualiza la información de rango al filtrar", async () => {
    const user = userEvent.setup();
    renderTable({ pageSize: 5 });

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "admin");

    // Solo 2 admin — info debe reflejar "1 – 2 de 2".
    // Buscamos el párrafo de información de rango y verificamos que contiene "2".
    const rangeInfo = screen.getByText((content, element) => {
      return element?.tagName === "P" && content.includes("Mostrando");
    });
    expect(rangeInfo).toBeInTheDocument();
    // El total debe ser 2 (hay 2 usuarios admin en los datos de prueba).
    const spans = within(rangeInfo).getAllByText("2");
    expect(spans.length).toBeGreaterThanOrEqual(1);
  });
});
