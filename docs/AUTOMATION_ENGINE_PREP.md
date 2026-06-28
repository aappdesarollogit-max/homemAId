# Automation Engine Prep

## Objetivo

Preparar la arquitectura para automatizaciones futuras sin ejecutarlas todavía.

## Ubicación

- `core/platform/automation/AutomationEngine.ts`
- `core/platform/automation/AutomationRules.ts`

## API Preparada

```ts
registerRule(rule)
evaluateEvent(event)
evaluateAll(events)
enableRule(id)
disableRule(id)
```

## Reglas Futuras

- presupuesto sobre 80%
- producto crítico
- compra inusual
- stock agotado
- recomendación importante

## Relación Con Event Bus

Automation Engine evaluará eventos publicados por Event Bus. Por ahora las reglas están deshabilitadas y no ejecutan acciones reales.
