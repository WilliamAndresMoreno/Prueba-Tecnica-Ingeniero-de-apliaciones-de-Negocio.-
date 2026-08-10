/**
 * Tipos de dominio del panel "Contenido por Estación".
 *
 * Se definen aquí como fuente única de verdad (contrato) consumida por
 * services/, hooks/, components/ y pages/. Mantener este archivo como el
 * punto central de sincronización con el contrato de backend/CMS evita
 * que un cambio de forma (shape) se disperse por toda la app.
 */

/** Estado operativo de una estación (encendida/apagada para el usuario final). */
export type StationOperationalStatus = 'active' | 'inactive';

/**
 * Estado editorial de un contenido en el CMS.
 * Se modela por separado de `StationOperationalStatus` a propósito:
 * son dos dominios distintos (operación vs. publicación editorial) que
 * el enunciado de la prueba también trata como conceptos separados
 * (ver docs/DECISIONES_TECNICAS.md, punto "status -> state").
 */
export type ContentStatus = 'draft' | 'published';

/** Identificador de servicio soportado (clave estable para mapear a íconos). */
export type ServiceKey = 's1' | 's2' | 's3' | 's4';

export interface Station {
  id: number;
  name: string;
  stationId: string;
  status: StationOperationalStatus;
}

export interface ServiceCatalogItem {
  id: ServiceKey;
  name: string;
}

/** Relación N:M entre estación y servicio (tabla puente normalizada). */
export interface StationServiceLink {
  id: number;
  stationId: string;
  serviceId: ServiceKey;
}

/** Servicio ya resuelto/enriquecido para una estación concreta (join listo para UI). */
export interface StationService {
  id: ServiceKey;
  name: string;
}

/**
 * Entidad de contenido editorial (CMS), tal como la define el enunciado.
 * No tiene una pantalla propia en este entregable, pero se tipa porque
 * es el contrato que el CMS expondrá cuando el layout evolucione de
 * "cards" a "tabla" (ver docs/DECISIONES_TECNICAS.md).
 */
export interface ContentItem {
  id: number;
  name: string;
  stationId: string;
  status: ContentStatus;
  updatedAt: string; // ISO 8601
}

/** Payload para el toggle de estado operativo de una estación. */
export interface UpdateStationStatusInput {
  stationId: string;
  status: StationOperationalStatus;
}
