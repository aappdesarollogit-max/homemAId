# homemAId Design System

## Paleta

- Fondo principal: `#050713`
- Fondo elevado: `white/[0.04]`
- Fondo elevado activo: `white/[0.07]`
- Primario: violeta `violet-500`
- Acento: fuchsia/violet gradients
- Exito: emerald
- Warning: orange
- Error: red
- Texto primario: white
- Texto secundario: white/60
- Texto muted: white/45

## Espaciado

- Cards compactas: `p-4`
- Cards normales: `p-5` / `p-6`
- Separacion entre bloques: `gap-5` / `gap-6`
- Controles: minimo `44px` de alto.

## Bordes y radios

- Cards: `rounded-3xl`
- Inputs/botones: `rounded-2xl`
- Chips: `rounded-full`
- Bordes: `border-white/10`

## Sombras

- Cards: `shadow-xl shadow-black/10`
- Elementos activos: `shadow-lg shadow-violet-950/30`

## Tipografia

- H1 mobile: `text-3xl font-black`
- H1 desktop: `sm:text-4xl`
- H2: `text-2xl font-black`
- Labels: `text-xs font-black uppercase tracking`
- Body: `text-sm leading-relaxed`
- KPIs: `text-2xl/text-3xl font-black`

## Componentes Base

- `AppCard`: contenedor visual consistente.
- `AppChip`: chips de estado con contraste uniforme.
- `AppButton`: boton primario/secundario/danger con tap target.
- `AppInput`: input base premium.
- `AppSearch`: buscador con icono, sombra y focus ring.
- `AppEmptyState`: estado vacio con ilustracion SVG simple.
- `AppHeader`: cabecera reusable.
- `AppMetric`: metrica compacta.
- `AppSection`: wrapper para spacing.
- `AppBadge`: alias de chip para evolucion futura.

## Animaciones

- Duracion base: 150-250ms.
- Hover desktop: levantamiento suave.
- Press mobile: `active:scale`.
- Evitar animaciones largas o decorativas.

## Guia Visual

- Usar fondos translúcidos sobre base oscura.
- Preferir densidad limpia sobre cards grandes.
- Chips pequeños, consistentes y ubicados cerca del dato que explican.
- Formularios mobile en una columna.
- Carruseles horizontales solo para filtros/tabs.
- Empty states con icono, texto amigable y accion clara cuando corresponda.

## Inventario Premium

Las cards de inventario usan:

- Icono SVG por categoria.
- Fondo degradado suave por categoria.
- Chip arriba a la derecha.
- Barra de duracion/stock visual.
- Altura reducida y mejor densidad informativa.

## Mobile

- Bottom navigation fija con safe area.
- Tap targets minimos de 44px.
- Formularios largos con scroll interno.
- No debe existir scroll horizontal global.
