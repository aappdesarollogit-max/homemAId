# Architecture

## Capas

- `app/`: rutas Next.js y composicion de pantallas.
- `components/`: UI reutilizable.
- `hooks/`: estado cliente por modulo.
- `lib/services/`: reglas de dominio y persistencia local.
- `lib/ingestion/`: pipeline central de ingreso de datos.
- `lib/intelligence/`: analisis local, predicciones, recomendaciones, alertas y score.
- `lib/contracts/`: interfaces para proveedores futuros.
- `types/`: contratos de dominio compartidos.

## Release Alpha

Release Alpha agrega Home Intelligence Foundation sin servicios externos. La nueva capa toma datos locales de inventario, compras, consumo, ajustes e integrantes, y devuelve `HouseholdIntelligenceSummary`.

El flujo principal es:

```text
localStorage data -> HomeIntelligenceEngine -> hook -> Overview / Consumption / Assistant
```

La UI no calcula inteligencia directamente; consume el hook `useHomeIntelligence`.

## PWA

La PWA usa `public/manifest.webmanifest`, metadata en `app/layout.tsx`, safe areas en CSS global y navegacion inferior mobile en `DashboardShell`.

## Mobile-first

El dashboard conserva sidebar en desktop y usa bottom navigation en mobile. Formularios largos usan scroll interno y tap targets minimos de 44px.

## Futuro nativo

Los servicios de dominio estan diseñados para poder reutilizarse en una app Expo. La UI web deberia reimplementarse con componentes nativos, pero ingestion, normalizacion, consumo y reglas locales pueden mantenerse.
