# Event Bus

## Objetivo

El Event Bus desacopla los módulos de homemAId. Inventario, compras, ajustes, asistente, inteligencia e inputs pueden publicar eventos sin depender entre sí.

## Ubicación

- `core/platform/events/EventTypes.ts`
- `core/platform/events/EventBus.ts`
- `core/platform/events/EventStore.ts`
- `core/platform/events/EventLogger.ts`
- `core/platform/events/EventDispatcher.ts`

## Eventos Base

- `purchase.created`
- `purchase.deleted`
- `inventory.product.created`
- `inventory.product.updated`
- `inventory.product.deleted`
- `inventory.product.opened`
- `consumption.updated`
- `settings.updated`
- `assistant.message.sent`
- `intelligence.refreshed`
- `input.received`
- `input.normalized`
- `input.failed`

## API

```ts
publish(event)
subscribe(eventType, handler)
unsubscribe(eventType, handler)
getEvents()
clearEvents()
```

## Persistencia

`EventStore` encapsula la persistencia local. En el futuro puede reemplazarse por Supabase sin cambiar los publicadores.

## Uso Futuro

El Automation Engine podrá reaccionar a eventos como presupuesto alto, producto crítico, compra inusual o recomendación importante.
