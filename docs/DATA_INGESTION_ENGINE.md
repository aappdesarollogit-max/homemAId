# Data Ingestion Engine

## Objetivo

El Data Ingestion Engine centraliza el ingreso de compras para que las fuentes actuales y futuras usen el mismo flujo interno. Hoy se conecta al registro manual de compras. OCR, IA, codigo de barras, Excel y APIs quedan preparados como contratos, sin implementarse todavia.

## Pipeline

```text
receive()
  -> detectSource()
  -> validate()
  -> normalize()
  -> createPurchase()
  -> updateInventory()
  -> updateConsumption()
  -> return Result
```

## Componentes

- `DataIngestionEngine.ts`: orquesta el pipeline.
- `SourceResolver.ts`: detecta la fuente de entrada.
- `ValidationEngine.ts`: valida datos minimos antes de persistir.
- `PurchaseNormalizer.ts`: convierte entradas crudas al formato unico `NormalizedPurchase`.
- `InventoryUpdater.ts`: aplica la compra al inventario usando un provider inyectado.

## Modelos

`RawPurchaseInput` acepta datos incompletos y campos flexibles:

- producto
- cantidad
- precio
- unidad
- tienda
- fecha
- categoria
- observaciones
- source
- confidence

`NormalizedPurchase` es el formato canonico que debe usar toda compra antes de persistirse o afectar inventario.

## Fuentes Soportadas

`InputSource` queda definido como:

- `manual`
- `ocr`
- `barcode`
- `excel`
- `ai`
- `api`

## Contratos Futuros

La carpeta `lib/contracts/` define interfaces para:

- `PurchaseProvider`
- `OCRProvider`
- `BarcodeProvider`
- `AIProvider`
- `ImportProvider`

Estos contratos permiten conectar proveedores reales despues sin modificar el flujo central.

## Beneficios

- Un solo flujo para compras manuales y futuras fuentes.
- Validacion consistente antes de persistir.
- Normalizacion unica para evitar formatos paralelos.
- Inventario actualizado desde el mismo pipeline.
- Menor acoplamiento entre UI, OCR, IA, imports y persistencia.

## Preparacion Para OCR

OCR debera implementar `OCRProvider` y entregar `RawPurchaseInput[]`. El engine se encargara de validar, normalizar, crear compra y actualizar inventario.

## Preparacion Para IA

IA debera implementar `AIProvider` y convertir conversaciones en `RawPurchaseInput[]`. El stub `registerPurchaseFromConversation()` en assistant-service marca el punto de entrada futuro.

## Preparacion Para Codigo De Barras

Codigo de barras debera implementar `BarcodeProvider` y resolver un payload a `RawPurchaseInput`. No tendra permisos especiales para saltarse validacion ni normalizacion.

## Estado Actual

El registro manual de compras ya entra por `DataIngestionEngine` desde `purchase-service.ts`. La UI no cambia y el comportamiento actual se mantiene.
