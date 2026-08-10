# Decisiones técnicas y caso situacional

## Caso

> Diseño cambia el layout de cards a tabla y el CMS cambia el campo `status`
> a `state`.

### ¿Cómo minimizar el impacto del cambio?

El impacto se minimiza aislando cada cambio en la capa que le corresponde,
para que no se propague al resto de la app:

- **Cambio visual (cards → tabla):** en este proyecto, `StationList` es el
  único componente que decide *cómo* se renderizan las estaciones;
  `StationCard` encapsula la representación de una fila/card individual.
  Migrar a tabla es reemplazar el `<ul>`/`<StationCard>` por un
  `<table>`/`<tr>` **dentro de `StationList`**, sin tocar `hooks/`,
  `services/` ni `types/`. Ningún consumidor de `useStations()` se entera
  del cambio.
- **Cambio de contrato (`status` → `state`):** el único lugar que conoce el
  nombre exacto del campo que responde el backend/CMS es `services/api.ts`
  (la función de mapeo/adaptador). El resto de la app sigue usando
  `Station.status` tal como está tipado en `types/index.ts`. Si el CMS
  renombra el campo, se ajusta el *mapper* en `services/api.ts` (una línea)
  y el contrato interno (`types`) no cambia — cero impacto en componentes,
  hooks o tests de UI.

En otras palabras: **la UI depende del contrato interno (`types/`), nunca
del contrato externo del CMS directamente**. El adaptador en `services/`
es el único punto de fricción.

### ¿Cómo coordinas contrato con backend/CMS? (types, mappers, versionado)

- **Types como contrato compartido:** `src/types/index.ts` funciona como
  la "fuente de verdad" del frontend. Idealmente se generan a partir de un
  esquema compartido (OpenAPI/JSON Schema) para evitar que backend y
  frontend diverjan silenciosamente; si no hay generación automática, se
  documenta el contrato en un `CONTRACT.md` versionado junto al backend.
- **Mappers explícitos:** cada respuesta cruda del backend pasa por una
  función `toStation(raw: RawStationDTO): Station` antes de tocar cualquier
  hook o componente. Esto convierte un cambio de nombre de campo
  (`status` → `state`) en un cambio de una sola función, con un test que
  falla inmediatamente si el backend cambia el shape sin avisar.
- **Versionado del API:** cambios *breaking* del CMS se exponen bajo una
  ruta o header versionado (`/v2/stations`) en vez de mutar el contrato
  existente en caliente. El frontend migra de versión de forma controlada,
  no reactiva.
- **Comunicación:** un cambio de contrato se trata como un cambio de
  interfaz pública — se coordina con changelog, se anuncia con antelación
  y, cuando el campo es central (como `status`), se acuerda un periodo de
  compatibilidad doble (`status` y `state` presentes a la vez) antes de
  retirar el campo viejo.

### ¿Qué harías para que estos cambios no rompan producción?

- **Tests de contrato (mapper):** un test unitario del mapper que falle
  explícitamente si el CMS deja de enviar `status` — mejor un error claro
  en CI que un `undefined` silencioso en producción.
- **Tipado estricto + `noUnusedLocals`/`strict: true`** (ya activo en este
  proyecto): si `status` se renombra en `types/index.ts`, TypeScript marca
  en rojo cada archivo que aún use el nombre viejo, antes de llegar a
  runtime.
- **Feature flags / despliegue progresivo:** el cambio de tabla se libera
  detrás de un flag, probado primero con un subconjunto de usuarios
  (canary) antes de reemplazar el layout de cards para todos.
- **Cobertura de tests de componente/E2E sobre el layout actual** (como los
  incluidos en este repo) como red de seguridad: si migrar a tabla rompe
  la selección de estación o el toggle de estado, los tests existentes lo
  detectan antes de merge.
- **Monitoreo post-deploy:** logging de errores de parseo de respuesta del
  CMS (p. ej. Sentry) para detectar en minutos, no en reportes de usuario,
  si el backend empezó a enviar un shape distinto al esperado.
- **Compatibilidad hacia atrás temporal:** el mapper acepta ambos nombres
  de campo (`raw.status ?? raw.state`) durante la ventana de migración, de
  modo que un despliegue desincronizado entre frontend y backend no genere
  downtime.
