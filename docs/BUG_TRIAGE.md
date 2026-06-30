# Bug Triage

## Objetivo

Definir una forma simple de revisar bugs reportados durante Alpha Cerrada.

## Registro

`BugEngine` permite registrar:

- error
- stack
- pantalla
- accion
- usuario
- fecha
- prioridad
- estado

## Priorizacion

- Critica: bloquea flujo principal o genera perdida de datos.
- Alta: afecta una funcionalidad importante, con workaround limitado.
- Media: afecta experiencia o consistencia, pero no bloquea.
- Baja: detalle visual, copy o comportamiento menor.

## Decision

Cada bug puede cerrarse con `ProductDecisionEngine`:

- Corregir bug
- Mover al backlog
- Duplicado
- Ya resuelto
- No hacer nada

Toda decision debe registrar motivo.

## Alpha 1.4 - Mobile Bug Sweep

| ID | Prioridad | Estado | Resolucion |
| --- | --- | --- | --- |
| BUG-001 | Alta | Cerrado | Onboarding usa inputs numeric-friendly con `inputMode="numeric"`, selecciona el `0` al foco, normaliza digitos y elimina ceros iniciales innecesarios. |
| BUG-002 | Alta | Cerrado | El dashboard queda bloqueado hasta completar onboarding; el gate cubre sidebar, contenido y bottom nav. |
| BUG-003 | Alta | Cerrado | Las opciones de inicio vacio/demo usan labels asociados, radio inputs de 44px y card seleccionable con estado visible. |
| BUG-004 | Media | Cerrado | Onboarding usa viewport `100dvh`, scroll interno, botones sticky y safe-area inferior para Chrome iPhone 12 web. |

Checklist mobile recomendado:

- Probar onboarding desde localStorage limpio en Chrome iPhone 12.
- En integrantes, escribir `10` y confirmar que no quede `010`.
- En presupuesto, escribir `40000` y confirmar que no quede `040000`.
- Seleccionar hogar vacio y demo tocando cualquier parte de la card.
- Abrir `/dashboard?view=ajustes` sin onboarding completo y confirmar que no aparece navegacion de dashboard.
- Completar onboarding vacio y confirmar estado vacio en Inicio, Inventario, Compras y Consumo.

## Alpha 1.4 - Welcome Checklist Sweep

| ID | Prioridad | Estado | Resolucion |
| --- | --- | --- | --- |
| BUG-005 | Media | Cerrado | Se elimina "Revisar consumo" del checklist inicial; consumo queda como sugerencia contextual en Overview cuando existe al menos una compra. |
| BUG-006 | Alta | Cerrado | "Agregar primer producto" navega a Inventario con `action=crear` y abre el formulario de producto. El check se completa solo al existir un producto guardado. |
| BUG-007 | Alta | Cerrado | "Registrar primera compra" navega a Compras con `mode=nueva` y abre el formulario de compra. |
| BUG-008 | Media | Cerrado | "Probar compra rapida" navega a Compras con `mode=rapida`, destaca/enfoca la tarjeta y se completa solo al confirmar una compra desde texto. |
| BUG-009 | Media | Cerrado | "Enviar primer feedback" navega a Ajustes > Feedback y se completa al guardar feedback. |

## Alpha 2.0 - Hardening Discovery

| ID | Prioridad | Estado | Resolucion |
| --- | --- | --- | --- |
| BUG-010 | Alta | Cerrado | Parser monolitico reemplazado por modulos especializados para montos, cantidades, tiendas, productos, limpieza y normalizacion. |
| BUG-011 | Alta | Cerrado | Checklist inicial queda basado en eventos reales persistidos por Event Bus. |
| BUG-012 | Media | Cerrado | Product Dashboard incluye metricas internas de calidad para parser, onboarding, feedback y errores criticos. |
| BUG-013 | Media | Cerrado | Se agregan ayudas contextuales simples sin tooltips complejos. |
