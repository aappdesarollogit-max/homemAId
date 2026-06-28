# Natural Language Input

## Objetivo

Release 2.1 permite registrar compras escribiendo texto libre, sin OpenAI, APIs externas ni modelos LLM.

## Arquitectura

El flujo reutiliza Platform Core:

```text
Texto libre
  -> TextParser
  -> EntityResolver
  -> SmartInputFramework
  -> DataIngestionEngine
  -> Purchase
  -> Inventory
  -> Consumption
  -> Knowledge
  -> Event Bus
```

## Componentes

- `core/platform/input/TextParser.ts`: extrae productos, cantidades, tienda, monto, fecha y warnings.
- `core/platform/input/EntityResolver.ts`: normaliza productos, reconoce alias y cruza contra inventario.
- `core/platform/input/TextInputAdapter.ts`: convierte el resultado en `RawPurchaseInput`.
- `components/dashboard/purchases/QuickPurchaseCard.tsx`: UI de Compra rápida con previsualización.

## Ejemplos Soportados

- `Compré 2 leches y un pan.`
- `Hoy gasté $25.000 en Lider.`
- `Compré arroz, azúcar, aceite y huevos.`
- `En Jumbo compré 3 yogures por $5.400.`

## Previsualización

Antes de guardar, la UI muestra:

- productos detectados
- cantidades
- monto
- tienda
- fecha
- warnings
- confianza

El usuario debe confirmar manualmente. No hay autoguardado.

## Eventos

- `text.input.received`
- `text.input.parsed`
- `text.input.confirmed`
- `text.input.failed`

## Asistente

El Asistente reutiliza el mismo parser para frases como:

```text
Registra que compré dos leches.
```

Por seguridad, responde con una previsualización y pide confirmar desde Compra rápida.

## Limitaciones

- El parser usa reglas y expresiones regulares.
- Montos sin productos generan warnings.
- Los precios se distribuyen de forma simple entre productos detectados.
- No hay comprensión semántica profunda ni OCR/voz.
