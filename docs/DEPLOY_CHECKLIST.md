# Deploy Checklist

Release: Closed Alpha 0.1.0-alpha.1

## Validacion local

- Ejecutar `npm run lint`.
- Ejecutar `npm run build`.
- Revisar `.gitignore`.
- Verificar que no existan `.env`, `.env.local`, claves, tokens ni archivos personales staged.
- Verificar variables de entorno en Vercel.
- Verificar `public/manifest.webmanifest`.

## Pruebas funcionales

- Probar mobile.
- Probar feedback.
- Probar compra rapida.
- Probar reset demo.
- Probar export feedback.
- Probar Inventario, Compras, Consumo, Asistente, Ajustes, Product Intelligence, PWA y Smart Input.

## Vercel

- Confirmar proyecto Vercel conectado al repo correcto.
- Confirmar branch `main`.
- Confirmar build command `npm run build`.
- Confirmar que no se configuren OpenAI ni Supabase para esta Alpha.
- Desplegar en Vercel.
- Abrir URL de preview/production y repetir smoke test mobile.

## Despues del deploy

- Compartir URL solo con testers autorizados.
- Compartir `docs/ALPHA_TESTER_GUIDE.md`.
- Mantener `docs/ALPHA_PRIVACY_NOTICE.md` visible para el equipo.
- Registrar bugs criticos para Alpha 1.2.x o Alpha 1.3.
