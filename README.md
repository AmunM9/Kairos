# 🚀 Kairos (καιρός)

> **Kairos** — *el momento oportuno en imágenes y video.*

Kairos es una plataforma web full-stack premium y cinemática diseñada para la búsqueda unificada y el análisis inteligente de referencias visuales de formato vertical y horizontal (YouTube Shorts y videos). Utiliza inteligencia artificial para desglosar la psicología, estructura de guion, ganchos de retención y estrategias de replicación de contenido viral de forma automática.

**VISITA KAIROS EN**: https://kairos-rho-silk.vercel.app/

---

## ✨ Características Principales

*   **🔍 Búsqueda Unificada Ultra-rápida:** Realiza búsquedas de contenido directamente sobre la API de YouTube v3, con soporte para múltiples plataformas y placeholders visuales premium para TikTok, Instagram y Facebook.
*   **🧠 Content Intelligence AI:** Desglose cualitativo automatizado de cada video utilizando GPT-4o de OpenAI. Analiza:
    *   **Hook (0-3s):** Estructura del gancho inicial y por qué atrapa al espectador.
    *   **Estructura del Guion:** Línea de tiempo visual interactiva paso a paso.
    *   **Retención:** Dinámicas psicológicas para mantener el interés.
    *   **Fórmulas de Títulos:** Títulos listos para adaptar con un botón de copiado rápido.
    *   **Estrategia de Replicación:** Pasos accionables y consejos de diferenciación para superar la versión analizada.
*   **📊 Métricas de Tracción Real:** Visualización elegante de vistas totales, likes, comentarios, engagement rate real y tracción de vistas por día.
*   **🎭 Interfaz Cinemática Premium:**
    *   Búsqueda interactiva con animaciones de transición fluidas en `Framer Motion`.
    *   Onboarding modal interactivo para personalizar la experiencia con tu nombre.
    *   Panel lateral detallado estilo cristal translúcido (Glassmorphism) con reproductor de video integrado.
    *   Filtros inteligentes por plataforma, relevancia, engagement, vistas y frescura del contenido.
*   **⚡ Sistema de Caché Inteligente:** Almacenamiento local en caché (24 horas) para optimizar la velocidad y respetar los límites de cuota de la API de YouTube.

---

## 🛠️ Stack Tecnológico

*   **Monorepo:** Organizado mediante `pnpm workspaces` para separar el Frontend, el Backend y paquetes compartidos de tipos.
*   **Frontend (Vite + React 18):**
    *   Lenguaje: TypeScript
    *   Estilos: Tailwind CSS v3
    *   Animaciones: Framer Motion (transiciones fluidas y micro-animaciones)
    *   Iconos: Lucide React + SVG Brand Icons personalizados
*   **Backend (Express):**
    *   Lenguaje: TypeScript compilado a CommonJS (CJS) para máxima compatibilidad.
    *   Servidor estático integrado para producción.
    *   Gestión de caché: `node-cache`
*   **Integraciones:**
    *   YouTube Data API v3
    *   OpenAI SDK

---

## 🔑 Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:

```env
# Backend (Kairos API)
PORT=3001
YOUTUBE_API_KEY=AIzaSy...              # Tu API Key de Google Developer Console
APIFY_MOCK_MODE=false                 # true para desarrollo sin consumir APIs reales, false para producción
ALLOWED_ORIGIN=http://localhost:5173  # Origen permitido para CORS en desarrollo
NODE_ENV=development                  # development o production
CACHE_TTL_SECONDS=86400               # Tiempo de vida de la caché (86400s = 24h)
RATE_LIMIT_PER_HOUR=10                # Búsquedas permitidas por IP por hora
OPENAI_API_KEY=sk-proj-...            # Tu API Key de OpenAI para análisis cualitativo

# Frontend (Kairos Web)
VITE_API_URL=http://localhost:3001    # URL de la API en dev. Dejar vacía o sin configurar en producción (Railway)
VITE_APP_NAME=Kairos                  # Nombre de la aplicación
```

---

## 🚀 Inicio Rápido Local

Sigue estos sencillos pasos para levantar el entorno de desarrollo local:

1.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```
2.  **Configurar variables de entorno:**
    ```bash
    cp .env.example .env
    ```
    *Asegúrate de agregar tus propias llaves de `YOUTUBE_API_KEY` y `OPENAI_API_KEY`.*
3.  **Iniciar la aplicación en desarrollo:**
    ```bash
    pnpm dev
    ```

*   **Frontend:** `http://localhost:5173`
*   **API/Backend:** `http://localhost:3001`

---

## 🛡️ Modo Desarrollo sin Consumo de APIs (Mock Mode)

Si deseas trabajar únicamente en la interfaz visual o en la lógica de componentes sin gastar créditos de OpenAI ni consumir tu cuota diaria de la API de YouTube, activa el modo Mock en tu archivo `.env`:

```env
APIFY_MOCK_MODE=true
```

Esto generará automáticamente resultados de videos interactivos e inteligentes de forma simulada y súper realista (soporta scroll infinito ilimitado).

---

## ☁️ Despliegue en Railway (Servicio Unificado)

Kairos está optimizado para ejecutarse en **un único servicio de Railway** unificado, lo que reduce costos a cero bajo el plan de prueba y elimina cualquier problema de CORS.

### Configuración en Railway:
1. Conecta tu servicio de Railway a tu repositorio de GitHub (rama `main`).
2. **Build Command:** `pnpm build`
3. **Start Command:** Deja que Railway use el script de inicio por defecto del proyecto.
4. **Variables de entorno necesarias:**
   * `NODE_ENV` = `production`
   * `APIFY_MOCK_MODE` = `false`
   * `YOUTUBE_API_KEY` = *Tu API Key de YouTube*
   * `OPENAI_API_KEY` = *Tu API Key de OpenAI*
   * `VITE_APP_NAME` = `Kairos`
   * *(Opcional)* `CACHE_TTL_SECONDS` = `86400`

*Nota: No necesitas configurar `VITE_API_URL` ni `PORT`, la aplicación detectará las rutas de forma relativa en el navegador automáticamente de forma nativa.*
