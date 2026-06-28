# PWA + Mobile Strategy

## Por que primero PWA

homemAId ya tiene una base funcional en Next.js con logica local para inventario, compras, consumo, asistente y ajustes. Convertirla primero en PWA permite validar experiencia movil, instalacion y navegacion tipo app sin duplicar logica en una app nativa.

## PWA vs app nativa

Una PWA corre en el navegador, puede instalarse, usar modo standalone y conservar el mismo codigo web. Una app nativa iOS/Android usa APIs del sistema con mayor profundidad, distribucion por stores y generalmente una capa UI distinta.

Para homemAId, PWA es el paso correcto antes de Expo porque permite probar uso real mobile, localStorage, navegacion y formularios antes de invertir en una app nativa.

## Camino futuro hacia Expo

La logica de dominio debe permanecer desacoplada de React/DOM:

- `lib/services/*`
- `lib/ingestion/*`
- `lib/contracts/*`
- tipos de `types/domain.ts`

Esa logica puede reutilizarse en Expo. La UI `components/dashboard/*` probablemente debera adaptarse a React Native, pero los servicios de normalizacion, consumo, settings e ingestion pueden migrar con bajo costo.

## Logica reutilizable en mobile

- Inventario vivo y calculo de estado.
- Compras e ingestion pipeline.
- Consumo inteligente.
- Asistente local basado en reglas.
- Ajustes del hogar.
- Contratos futuros para OCR, IA, imports y barcode.

## Pendientes para camara/OCR

- Definir permisos de camara.
- Agregar captura desde PWA o app nativa.
- Implementar `OCRProvider`.
- Convertir resultado OCR a `RawPurchaseInput[]`.
- Enviar todo al `DataIngestionEngine`.
- Agregar revision manual antes de confirmar compra.

## Criterios de experiencia mobile

- Sin scroll horizontal.
- Navegacion principal alcanzable con pulgar.
- Tap targets de al menos 44px.
- Formularios de una columna en pantallas pequeñas.
- Paneles largos con scroll interno.
- Inputs visibles sobre teclado cuando sea posible.
- Safe areas de iOS consideradas en navegacion inferior.
- Modo standalone sin controles tapados.
