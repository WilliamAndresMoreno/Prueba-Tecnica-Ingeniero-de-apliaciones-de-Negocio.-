# Contenido por Estación

Prueba técnica Frontend React/CMS — Panel de gestión de contenido por estación:
listado de estaciones, selección de una estación y consulta de sus servicios
asociados (representados con íconos), con posibilidad de activar/inactivar
cada estación.

## Stack técnico

| Capa | Tecnología |
|---|---|
| UI | React 18 + TypeScript |
| Build tool | Vite 5 |
| Data fetching / cache | TanStack Query (React Query) v5 |
| Íconos | lucide-react |
| Testing | Vitest + React Testing Library + jsdom |
| Lint | ESLint + typescript-eslint |

No se usó un backend real: la capa `src/services/api.ts` simula un API REST
(latencia de red, cancelación vía `AbortSignal`, persistencia en memoria)
a partir de los datos de ejemplo del enunciado. Ver
[`docs/DECISIONES_TECNICAS.md`](./docs/DECISIONES_TECNICAS.md) para el
razonamiento de arquitectura.

## Funcionalidades adicionales (más allá del enunciado base)

- **Dashboard de métricas** — tarjetas con el total de estaciones, activas
  e inactivas, recalculadas en tiempo real.
- **Búsqueda/filtro** de estaciones por nombre o código, con atajo de
  teclado `/` para enfocar el buscador desde cualquier parte de la página.
- **Ordenar estaciones** por nombre (A-Z/Z-A) o por estado.
- **Confirmación antes de inactivar** una estación — un modal accesible
  (`role="alertdialog"`, foco atrapado, cierre con Esc) evita cambios
  accidentales en la acción de mayor riesgo operativo. Reactivar, al ser
  de bajo riesgo, no requiere confirmación.
- **Manejo de deep-link inválido** — si la URL trae un `?station=<id>`
  que no existe, se muestra un aviso claro en vez de un estado roto.
- **Error Boundary** de nivel de aplicación — si algo falla de forma
  inesperada en el árbol de componentes, se muestra una pantalla de
  recuperación en vez de una página en blanco.
- **Notificaciones toast** de éxito/error al cambiar el estado de una
  estación.
- **Skeleton loaders** en el listado de estaciones y el panel de servicios
  mientras cargan los datos.
- **Modo oscuro** persistente (`localStorage`), con detección de la
  preferencia del sistema operativo como valor inicial.
- **Deep-linking por URL** — la estación seleccionada queda reflejada en
  `?station=<id>`, para compartir el enlace directo o refrescar sin perder
  la selección.
- **CI/CD con GitHub Actions** (`.github/workflows/ci.yml`) — corre lint,
  tests con cobertura y build en cada push/PR a `main`, y publica el
  reporte de cobertura como artefacto descargable.
- **Pre-commit hooks** (Husky + lint-staged) — cada commit local corre
  ESLint automáticamente sobre los archivos modificados antes de
  completarse.
- **Tests de accesibilidad automatizados** (`jest-axe`) sobre la página
  principal, el modal de confirmación y las tarjetas de estación — corren
  como parte de la suite normal de tests.
- **Exportar a CSV** — botón que descarga el listado de estaciones tal
  como se está viendo (respeta el filtro y el orden activos).
- **Plantillas de PR/Issue** y **Dependabot** — higiene de repositorio
  estándar en equipos profesionales (`.github/PULL_REQUEST_TEMPLATE.md`,
  `.github/ISSUE_TEMPLATE/`, `.github/dependabot.yml`).
- **`CHANGELOG.md`** siguiendo el formato
  [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
- **Espacio de marca en el header** — logo con fallback automático a un
  ícono genérico si el archivo no está presente (ver
  [`public/brand/README.md`](./public/brand/README.md) para agregar el
  logo oficial).

## Arquitectura por capas

```
src/
├── pages/            # Composición de pantallas (StationsPage)
├── components/        # UI presentacional, por feature
│   ├── Header/            # Marca, logo (con fallback) y toggle de tema
│   ├── SummaryCards/       # Dashboard de métricas (total/activas/inactivas)
│   ├── StationSearch/      # Buscador/filtro de estaciones
│   ├── Skeletons/          # Loading skeletons
│   ├── Toast/              # Sistema de notificaciones (contexto + provider)
│   ├── Theme/              # Modo claro/oscuro (contexto + provider)
│   ├── StationList/
│   ├── ServicesPanel/
│   └── StatusToggle/
├── hooks/             # Hooks de datos (React Query) — useStations, useStationServices, useUpdateStationStatus
├── services/          # Acceso a datos: api.ts, mockData.ts, queryClient.ts, queryKeys.ts
├── types/             # Contrato de dominio (Station, ServiceKey, ContentItem, etc.)
└── test/              # Setup y utilidades compartidas de testing
```

Regla de dependencia: `pages` → `components` + `hooks` → `services` → `types`.
Los componentes nunca llaman `fetch`/`api.ts` directamente; siempre pasan
por un hook.

## Manual de instalación

Requisitos: **Node.js 18+** y **npm 9+**.

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd contenido-por-estacion

# 2. Instalar dependencias
npm install

# 3. Levantar el entorno de desarrollo
npm run dev
# -> abre http://localhost:5173

# 4. Ejecutar la suite de tests
npm run test

# 5. Ejecutar tests con reporte de cobertura
npm run test:coverage

# 6. Compilar para producción
npm run build

# 7. Previsualizar el build de producción
npm run preview

# 8. Lint
npm run lint
```

## Manual de usuario

1. Al ingresar, se muestra el listado de **estaciones** con su nombre,
   código y estado (Activa / Inactiva).
2. Al hacer click sobre el nombre de una estación, el panel derecho
   **"Servicios"** carga los íconos de los servicios que ofrece esa
   estación (Baño, Cajeros, Soat, Tienda). Cada ícono es accesible: tiene
   `aria-label`/`title` con el nombre del servicio para lectores de
   pantalla, aunque visualmente solo se muestre el ícono.
3. El interruptor (switch) a la derecha de cada estación permite
   **activar/inactivar** la estación sin salir de la lista. El cambio se
   refleja de inmediato (actualización optimista) y se revierte
   automáticamente si la operación falla.
4. Si el listado o los servicios están cargando, se muestra un mensaje de
   estado (`role="status"`); si algo falla, se muestra un mensaje de error
   (`role="alert"`).
5. Toda la interacción es operable por teclado (Tab + Enter/Espacio) y
   cada control interactivo tiene foco visible.

## Testing

- **Componente** (`src/components/StationList/StationCard.test.tsx`):
  render + interacción — verifica que seleccionar una estación y togglear
  su estado disparan los callbacks correctos, y que el switch se
  deshabilita durante la actualización.
- **Hook con mock de API** (`src/hooks/useStationServices.test.tsx`):
  mockea `services/api.ts` y valida `enabled`, éxito, error y — clave para
  el bug corregido — que un cambio de `stationId` dispara un nuevo fetch.
- **Integración de página** (`src/pages/StationsPage.test.tsx`): dashboard
  de métricas, búsqueda/filtro, deep-linking por URL, el flujo completo de
  confirmación al inactivar (incluyendo cancelar), y toasts de éxito/error.
- **Accesibilidad** (`src/test/a11y.test.tsx`): `jest-axe` corre reglas
  WCAG sobre la página principal, el modal de confirmación y las tarjetas
  de estación — atrapa regresiones estructurales (labels, roles ARIA,
  etc.) automáticamente en cada corrida de tests.
- **Exportación CSV** (`src/services/csvExport.test.ts`): valida el
  encabezado, el mapeo de estado a texto legible, y el escape correcto de
  valores con comas.
- **Extra — servicio** (`src/services/api.test.ts`): valida el join
  estación↔servicio, la persistencia del cambio de estado y la
  cancelación vía `AbortController`.

27 tests en total (~90%+ de cobertura en la mayoría de módulos), corriendo
automáticamente en CI en cada push. El reporte de cobertura completo se
genera con `npm run test:coverage` y queda disponible como artefacto
descargable en cada ejecución de GitHub Actions.

## Documentación adicional

- [`docs/DECISIONES_TECNICAS.md`](./docs/DECISIONES_TECNICAS.md) — respuestas
  al caso situacional (cambio de layout cards→tabla, `status`→`state`,
  contrato con backend/CMS, estrategia de despliegue seguro).
- [`docs/BUGFIX.md`](./docs/BUGFIX.md) — análisis y solución del bug de
  `useEffect` (dependencias, fetch duplicado, condiciones de carrera).
