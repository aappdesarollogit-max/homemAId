# First Run Experience

Release: Alpha 1.3

## Objetivo

Eliminar la confusion del primer uso. Un usuario nuevo no debe entrar a un dashboard vacio con datos falsos ni necesitar login real para comenzar.

## Principios

- No hay autenticacion real.
- No hay Supabase.
- No hay OpenAI.
- No se modifica Home Intelligence.
- No se modifica Smart Input.
- La configuracion vive en `localStorage`.

## Deteccion

El servicio `lib/services/first-run-service.ts` expone:

- `isFirstRun()`: retorna `true` si no existe una configuracion valida de hogar en `localStorage`.
- `markCompleted()`: marca el onboarding como completado.
- `reset()`: limpia el estado de primer uso y deja inventario/compras vacios.

La deteccion se basa en `homemaid.household.settings` y valida que existan nombre del hogar y responsable.

## Flujo

```text
Landing
  -> si existe hogar: Dashboard
  -> si no existe hogar: mensaje + Crear mi hogar

Crear mi hogar
  -> Onboarding paso 1: bienvenida
  -> Onboarding paso 2: hogar, responsable, integrantes
  -> Onboarding paso 3: presupuesto, moneda, supermercado
  -> Onboarding paso 4: hogar vacio o datos demo
  -> Dashboard
```

## Hogar vacio

Si el usuario elige empezar vacio:

- Se guarda configuracion del hogar.
- Se crean integrantes basicos.
- Se guardan inventario y compras como arrays vacios.
- El dashboard muestra mensajes de arranque: productos, primera compra e inventario.

## Modo demostracion

Si el usuario elige datos demo:

- Se cargan los datos actuales de `mock-home`.
- El dashboard muestra la insignia "Modo demostración".
- El boton "Comenzar desde cero" limpia inventario y compras demo sin borrar la configuracion del hogar.

## Bienvenida en Dashboard

La primera entrada al dashboard muestra:

- "¡Bienvenido a homemAId!"
- Checklist de primeros pasos.
- Progreso por tareas completadas.

Checklist:

- Agregar primer producto.
- Registrar primera compra.
- Probar compra rapida.
- Enviar primer feedback.

Consumo no aparece en el checklist inicial. Cuando existe al menos una compra, Overview muestra la sugerencia secundaria "Ya puedes revisar tu consumo".

## Eventos Product Analytics

Alpha 1.3 registra:

- `first_run_started`
- `onboarding_completed`
- `demo_selected`
- `empty_home_selected`
- `welcome_completed`

Estos eventos se guardan con `AnalyticsEngine` dentro de Product Intelligence local.

## Alpha 2.0

El checklist inicial ya no se completa por navegacion. Cada paso depende de eventos reales:

- `inventory.product.created`
- `purchase.created`
- `text.input.confirmed`
- `feedback.created`
