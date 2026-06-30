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
