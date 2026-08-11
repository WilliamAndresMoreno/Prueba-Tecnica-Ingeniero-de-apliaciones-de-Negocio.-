# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto sigue un versionado informal por iteración (no es una
librería publicada, así que no aplica SemVer estricto).

## [No publicado]

## [0.4.0] — Higiene profesional y mantenimiento

### Agregado
- Tests de accesibilidad automatizados con `jest-axe` sobre la página
  principal, el modal de confirmación y las tarjetas de estación.
- Exportar el listado de estaciones a CSV (respeta el filtro y el orden
  activos).
- Plantillas de Pull Request e Issue (`bug_report`, `feature_request`).
- Configuración de Dependabot para dependencias de npm y GitHub Actions.
- Este `CHANGELOG.md`.

## [0.3.0] — Confirmaciones y resiliencia

### Agregado
- Modal de confirmación antes de inactivar una estación.
- Error Boundary de nivel de aplicación.
- Manejo de deep-link inválido (`?station=<id>` inexistente).
- Selector de orden de estaciones (nombre, estado).
- Atajo de teclado `/` para enfocar el buscador.
- Pre-commit hooks con Husky + lint-staged.
- Publicación del reporte de cobertura de tests como artefacto de CI.

## [0.2.0] — Marca, dashboard e interactividad

### Agregado
- Header con espacio de marca (logo con fallback automático) y toggle de
  modo oscuro/claro persistente.
- Dashboard de métricas (total / activas / inactivas).
- Búsqueda/filtro de estaciones por nombre o código.
- Notificaciones toast de éxito/error al cambiar el estado de una estación.
- Skeleton loaders en el listado y el panel de servicios.
- Deep-linking por URL (`?station=<id>`).
- Workflow de CI con GitHub Actions (lint, test, build).

## [0.1.0] — Entrega inicial

### Agregado
- Panel "Contenido por Estación": listado de estaciones y panel de
  servicios asociados (representados con ícono).
- Toggle de estado activa/inactiva con actualización optimista
  (TanStack Query).
- Arquitectura por capas (`pages/ components/ hooks/ services/ types/`).
- Tests de componente, de hook (con mock de API) y de servicio.
- Documentación: manual de instalación/usuario, decisiones técnicas
  (caso situacional) y análisis del bug de `useEffect`.
