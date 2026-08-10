# Carpeta de branding

Este archivo `terpel-logo.png` es el logotipo oficial de Terpel, provisto
por el candidato como parte de este proyecto de prueba técnica para
Organización Terpel S.A. Se usa únicamente dentro del alcance de este
proyecto (aplicación interna `AppTerpel`).

Si necesitas reemplazarlo por otra versión (por ejemplo, una variante
horizontal o el isotipo en otro color), solo sobrescribe este archivo
manteniendo el nombre `terpel-logo.png` — el `Header` lo carga
automáticamente sin necesidad de tocar código.

Si prefieres usar un SVG (mejor nitidez en pantallas de alta densidad),
guárdalo como `terpel-logo.svg` en esta misma carpeta y actualiza la
constante `LOGO_SRC` en `src/components/Header/Header.tsx` de `.png`
a `.svg`.

Si el archivo llegara a faltar o fallar al cargar por cualquier motivo,
el header muestra automáticamente un ícono genérico de respaldo — la
aplicación nunca se rompe por su ausencia.
