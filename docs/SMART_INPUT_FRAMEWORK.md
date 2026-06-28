# Smart Input Framework

## Objetivo

Smart Input Framework crea una entrada común para manual, texto, OCR, código de barras, voz, Excel y API.

## Ubicación

- `core/platform/input/SmartInputFramework.ts`
- `core/platform/input/InputTypes.ts`
- `core/platform/input/InputAdapterRegistry.ts`
- `core/platform/input/*InputAdapter.ts`

## Flujo

```text
receiveInput(input)
  -> detectInputType(input)
  -> normalizeInput(input)
  -> sendToDataIngestion(input)
  -> DataIngestionEngine
```

## Adaptadores

- `ManualInputAdapter`: enruta compras manuales existentes.
- `TextInputAdapter`: normaliza frases simples.
- `OCRInputAdapter`: stub seguro.
- `BarcodeInputAdapter`: stub seguro.
- `VoiceInputAdapter`: stub seguro.
- `ExcelInputAdapter`: stub seguro.
- `ApiInputAdapter`: stub seguro.

## Ejemplo Soportado

Entrada:

```text
compré 2 leches y 1 pan
```

Salida aproximada:

```ts
[
  { producto: "leches", cantidad: 2, unidad: "unidad", precio: 0 },
  { producto: "pan", cantidad: 1, unidad: "unidad", precio: 0 }
]
```

## Futuro

OCR, OpenAI, voz, código de barras, Excel y APIs deberán implementar `InputAdapter`. Ninguno podrá saltarse Data Ingestion Engine.
