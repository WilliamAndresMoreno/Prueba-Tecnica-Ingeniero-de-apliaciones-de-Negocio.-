# Bug: `useEffect` con deps vacías + performance

## Código original (enunciado)

```jsx
useEffect(() => {
  fetchContent(stationId);
}, []);
```

## Problemas identificados

1. **Dependencias incorrectas (`[]`):** el array de dependencias vacío hace
   que el efecto corra **una sola vez**, en el montaje. Si `stationId`
   cambia después (el usuario selecciona otra estación), el efecto nunca
   se vuelve a ejecutar y la UI queda mostrando contenido de la estación
   equivocada. Es un bug de "stale closure": el efecto capturó el
   `stationId` de la primera render y nunca lo actualiza.

2. **Fetch duplicado:** en `React.StrictMode` (desarrollo) los efectos se
   ejecutan dos veces intencionalmente para exponer efectos no
   idempotentes; sin cancelación, esto dispara dos peticiones por cada
   montaje. En producción, cambios rápidos de estación sin abortar la
   petición anterior generan múltiples requests simultáneos innecesarios.

3. **Condiciones de carrera (race conditions):** si el usuario selecciona
   la estación A y luego, antes de que responda, selecciona la B, ambas
   peticiones siguen en vuelo. No hay garantía de que la respuesta de B
   llegue después que la de A — si A responde más tarde, el usuario
   termina viendo los servicios de A mientras cree tener seleccionada B.

## Solución adoptada en este repo: React Query

En vez de gestionar el ciclo de vida del fetch a mano, `useStationServices`
(`src/hooks/useStationServices.ts`) delega en TanStack Query:

```ts
export function useStationServices(stationId: string | null) {
  return useQuery({
    queryKey: queryKeys.stationServices.byStation(stationId ?? ''),
    queryFn: ({ signal }) => fetchStationServices(stationId as string, { signal }),
    enabled: Boolean(stationId),
    staleTime: 30_000,
  });
}
```

Cómo resuelve cada problema:

| Problema original | Cómo lo resuelve React Query |
|---|---|
| Deps vacías / stale `stationId` | `stationId` es parte de la `queryKey`; un cambio de estación es, para React Query, una query distinta → se dispara un fetch nuevo automáticamente. |
| Fetch duplicado | React Query dedupea automáticamente peticiones concurrentes con la misma `queryKey` y usa `staleTime` para no refetchear datos aún frescos. |
| Race conditions | Al montar una query nueva (nueva `queryKey`), React Query cancela la anterior a través del `signal` de `AbortSignal` que le inyecta a `queryFn`; el estado final siempre corresponde a la última selección. |
| Fetch mientras no hay `stationId` | `enabled: Boolean(stationId)` — equivalente al guard `if (!stationId) return`, pero declarativo. |

Esto está cubierto por el test
`src/hooks/useStationServices.test.tsx` → *"vuelve a pedir datos cuando
cambia el stationId"*, que falla si alguien reintroduce `[]` como
dependencia fija.

## Alternativa sin librerías: `useEffect` + `AbortController`

Cuando React Query no es una opción (p. ej. una integración puntual fuera
del árbol de queries), la misma corrección se logra a mano así:

```jsx
useEffect(() => {
  if (!stationId) return;

  const controller = new AbortController();

  fetchContent(stationId, { signal: controller.signal })
    .then(setContent)
    .catch((err) => {
      if (err.name !== 'AbortError') setError(err);
    });

  return () => controller.abort(); // cancela si stationId cambia o el componente se desmonta
}, [stationId]); // <- dependencia correcta
```

Puntos clave de esta versión:

- `[stationId]` en las deps: el efecto se re-ejecuta cuando cambia la
  estación seleccionada.
- `AbortController` + función de limpieza (`return () => controller.abort()`):
  cancela la petición en vuelo cada vez que el efecto se vuelve a
  ejecutar (o el componente se desmonta), eliminando tanto el fetch
  duplicado como la condición de carrera.
- El `catch` ignora explícitamente `AbortError`, para no tratar una
  cancelación intencional como un error real de negocio.
