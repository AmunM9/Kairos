# Kairos

> **Kairos** (καιρός) — *el momento exacto, en imágenes.*

Plataforma para buscar referencias visuales virales en YouTube, TikTok e Instagram desde una sola interfaz minimalista. Cuando *Chronos* mide el tiempo en segundos, *Kairos* lo mide en momentos.

## Features

- 🔍 Búsqueda unificada en YouTube, TikTok e Instagram
- 📊 Métricas reales: views, likes, comentarios, duración
- 🎯 Filtros por plataforma y recencia
- ⚡ Cache agresivo (24h) para respetar el free tier de Apify
- 🌗 Modo claro y oscuro con auto-detección
- 📱 Diseño minimalista responsive

## Stack

- Monorepo con pnpm workspaces
- Frontend: Vite + React 18 + TypeScript + Tailwind + Framer Motion
- Backend: Express + TypeScript
- Datos: Apify (1 token, 3 actores)

## Setup

```bash
pnpm install
cp .env.example .env
# Agrega tu APIFY_API_TOKEN (ver "Obtener API token" abajo)
pnpm dev
```

Frontend: http://localhost:5173
API: http://localhost:3001

## Obtener API token de Apify

1. Crea cuenta gratis en https://apify.com (no pide tarjeta)
2. Ve a **Settings → API & Integrations → Personal API tokens**
3. Click "Create new token", nombre: `kairos-dev`
4. Copia el valor y pégalo en `.env` como `APIFY_API_TOKEN=...`

El plan free incluye $5/mes en créditos, suficiente para ~400 búsquedas únicas/mes con el cache de 24h activado.

## Modo desarrollo sin gastar créditos

```env
APIFY_MOCK_MODE=true
```

Devuelve datos hardcodeados realistas. Útil para trabajar el frontend sin tocar Apify.
