# SinopsIA 🎬📚✨

**SinopsIA** es una aplicación web de recomendación inteligente de **películas, series y libros** impulsada por Inteligencia Artificial (**Google Gemini**). A partir de los géneros y preferencias descritos por el usuario, genera recomendaciones personalizadas y las enriquece automáticamente con pósteres, portadas, autores y plataformas de streaming disponibles.

> **Nota sobre esta rama (`ghpages-production`):** Esta rama está configurada con una **arquitectura desacoplada** donde el **Frontend estático se despliega en GitHub Pages** ([sinopsiagit.itorgon.es](https://sinopsiagit.itorgon.es/)) y consume el **Backend serverless alojado en Vercel** a través de [`https://sinopsiaapi.vercel.app`](https://sinopsiaapi.vercel.app) y su dominio personalizado [sinopsiaapi.itorgon.es](https://sinopsiaapi.itorgon.es/).

---

## 🧠 ¿Cómo funciona el proyecto?

### 1. Arquitectura general

El proyecto se divide en dos capas principales:

* **Frontend (React + Vite + Tailwind CSS):**
  * Ubicado en `Frontend/SinopsIA`.
  * Aplicación SPA (*Single Page Application*) construida con **React 19**, **Vite 8**, **React Router v7** y **Tailwind CSS v4**.
  * Incluye vistas de inicio y recomendador (`/`), información del proyecto (`/about`), acceso (`/login`), registro (`/register`) y página de error 404.
  * Resuelve dinámicamente la URL del backend mediante `src/utils/apiConfig.js`:
    * Si se ejecuta en **GitHub Pages** (`sinopsiagit.itorgon.es` o `*.github.io`), envía las peticiones a `https://sinopsiaapi.vercel.app` y [sinopsiaapi.itorgon.es](https://sinopsiaapi.itorgon.es/).
    * Si se ejecuta en **desarrollo local** (`localhost` / `127.0.0.1`) o directamente sobre los dominios del backend (`sinopsiaapi.vercel.app`, [sinopsiaapi.itorgon.es](https://sinopsiaapi.itorgon.es/)), utiliza rutas relativas `/api/*` (que en local Vite redirige por proxy a `http://127.0.0.1:8000`).
    * Permite sobreescribir el destino en cualquier momento mediante la variable `VITE_API_URL`.

* **Backend API (Python + FastAPI + Pydantic):**
  * Ubicado en `Frontend/SinopsIA/api/index.py` (con punto de entrada compatible en `api/index.py`).
  * Disponible en producción tanto en `https://sinopsiaapi.vercel.app` como en el dominio personalizado [sinopsiaapi.itorgon.es](https://sinopsiaapi.itorgon.es/).
  * Protege las claves privadas (`GEMINI_API_KEY`, `TMDB_API_KEY`, `GOOGLE_BOOKS_API_KEY`) manteniéndolas exclusivamente en el servidor.
  * Configura **CORS** para permitir peticiones desde el dominio de GitHub Pages (`https://sinopsiagit.itorgon.es`, `*.github.io`), dominios propios ([sinopsiaapi.itorgon.es](https://sinopsiaapi.itorgon.es/), `*.itorgon.es`), dominios de Vercel (`*.vercel.app`) y entornos locales.

### 2. Flujo de una recomendación

1. **Captura y validación:** El usuario selecciona el tipo de contenido (`pelicula`, `serie`, `libro` o `ambos`), introduce entre 1 y 5 géneros y describe sus gustos (entre 10 y 500 caracteres). FastAPI valida estrictamente la petición con **Pydantic** (`RecommendationRequest`); si los datos no son válidos, devuelve `HTTP 422` sin llamar a la IA.
2. **Generación con Google Gemini:** El backend encapsula los datos del usuario como contenido seguro (`<user_data>`) para prevenir inyecciones de prompt y consulta el modelo configurado (`gemini-3.8-flash` por defecto) exigiendo una respuesta JSON estructurada con exactamente **3 recomendaciones** (tipo, título, creador/autor, sinopsis y motivo de recomendación).
3. **Enriquecimiento en paralelo (`ThreadPoolExecutor`):**
   * **Películas y Series (TMDb API):** Busca la obra en *The Movie Database*, verifica la coincidencia por título, año y director/creador, obtiene el póster oficial y consulta las plataformas de streaming disponibles en la región configurada (`TMDB_REGION=ES` por defecto).
   * **Libros (Google Books + Open Library):** Consulta primero *Google Books API* para obtener portada, autor y enlace de ficha. Si no hay portada disponible o el servicio falla, recurre automáticamente a *Open Library* (probando con título + autor y luego solo título).
4. **Tolerancia a fallos:**
   * Si Gemini devuelve `HTTP 503` o `504` (saturación temporal), el backend reintenta automáticamente hasta 2 veces con espera progresiva.
   * Si algún catálogo externo limita las peticiones (`HTTP 429`), el backend **conserva las recomendaciones generadas por Gemini** e incluye un aviso (`catalog_notice`) en la interfaz.

---

## 📁 Estructura del repositorio

```text
sinopsIA/
├── .github/workflows/
│   └── deploy.yml                # Workflow de CI/CD para desplegar en GitHub Pages
├── Frontend/
│   ├── requirements.txt          # Dependencias Python del backend
│   └── SinopsIA/                 # Aplicación principal (Frontend + API)
│       ├── api/
│       │   ├── index.py          # Servidor FastAPI y lógica de recomendación
│       │   └── test_index.py     # Tests unitarios con cliente Gemini simulado
│       ├── public/
│       │   └── CNAME             # Dominio personalizado para GitHub Pages
│       ├── src/
│       │   ├── Components/       # Barra de navegación, pie de página, etc.
│       │   ├── routes/           # Definición de rutas SPA (React Router)
│       │   ├── utils/apiConfig.js# Detección automática del endpoint de la API
│       │   └── views/            # Vistas: Home, About, Login, Register, ErrorPage
│       ├── vite.config.js        # Configuración de Vite, proxy local y plugin copy-404
│       ├── vercel.json           # Reglas de reescritura y cabeceras CORS para Vercel
│       └── package.json          # Scripts y dependencias del frontend
├── api/                          # Punto de entrada alternativo para Vercel en raíz
├── docs/CNAME                    # Archivo CNAME de referencia
├── CNAME                         # Dominio personalizado (sinopsiagit.itorgon.es)
├── package.json                  # Scripts atajo desde la raíz del repositorio
└── vercel.json                   # Configuración de Vercel en la raíz
```

---

## 🛠️ Requisitos e instalación local

### Requisitos previos

* **Node.js** (v20 o v22 recomendado) y **npm**.
* **Python 3.10** o superior.
* **Clave de API de Google Gemini** (`GEMINI_API_KEY`).
* **Clave de API de TMDb** (`TMDB_API_KEY`) para pósteres y plataformas de películas/series ([obtener en TMDb](https://www.themoviedb.org/settings/api)).
* *(Opcional)* **Clave de API de Google Books** (`GOOGLE_BOOKS_API_KEY`).

### 1. Instalar dependencias del Frontend

Desde la raíz del repositorio puedes usar los scripts globales o entrar en `Frontend/SinopsIA`:

```bash
cd Frontend/SinopsIA
npm install
```

### 2. Configurar entorno virtual e instalar el Backend

```bash
# Desde Frontend/SinopsIA
python -m venv ../.venv

# Activar entorno en macOS / Linux:
source ../.venv/bin/activate
# Activar entorno en Windows (Git Bash):
# source ../.venv/Scripts/activate

python -m pip install -r requirements.txt
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo en `Frontend/SinopsIA/.env.local`:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y configura tus claves:

```env
GEMINI_API_KEY="tu_clave_de_gemini"
GEMINI_MODEL="gemini-3.8-flash"
TMDB_API_KEY="tu_clave_de_tmdb"
TMDB_REGION="ES"
GOOGLE_BOOKS_API_KEY="opcional_tu_clave_google_books"
```

> ⚠️ **Seguridad:** Nunca subas `.env.local` al repositorio ni expongas claves privadas usando el prefijo `VITE_`, ya que quedarían incrustadas en el bundle público del navegador.

---

## 💻 Ejecución en desarrollo y pruebas

Para trabajar en local abre **dos terminales** ubicadas en `Frontend/SinopsIA`:

### Terminal 1: Servidor Backend (FastAPI)

```bash
cd Frontend/SinopsIA
source ../.venv/bin/activate  # En Windows Git Bash: source ../.venv/Scripts/activate
python -m uvicorn api.index:app --reload --host 127.0.0.1 --port 8000
```

Puedes verificar que el backend responde correctamente ejecutando:

```bash
curl http://127.0.0.1:8000/api/health
# Respuesta esperada: {"status":"ok","service":"SinopsIA"}
```

### Terminal 2: Servidor Frontend (Vite)

```bash
cd Frontend/SinopsIA
npm run dev
```

Abre `http://localhost:5173` en el navegador.

### Ejecutar tests y linter

Las pruebas del backend simulan las respuestas de Gemini y de los catálogos externos, por lo que no consumen cuota real de API:

```bash
cd Frontend/SinopsIA
python -m pytest -q
npm run lint
```

---

## 🚀 Despliegue

Dado que **GitHub Pages** únicamente aloja sitios estáticos (HTML, CSS y JS) y no ejecuta código Python, el despliegue en producción se realiza combinando **GitHub Pages** para el frontend y **Vercel** para la API de FastAPI.

### Parte 1: Despliegue del Frontend en GitHub Pages

El proyecto está preparado específicamente para funcionar sin problemas en GitHub Pages gracias a tres mecanismos:

1. **Soporte para rutas SPA (`copy-404`):** En `Frontend/SinopsIA/vite.config.js`, un plugin copia automáticamente `dist/index.html` a `dist/404.html` al finalizar el build. Así, cuando un usuario recarga una ruta interna como `/about` o `/login`, GitHub Pages sirve la aplicación React en lugar de un error 404 genérico.
2. **Dominio personalizado (`CNAME`):** El archivo `Frontend/SinopsIA/public/CNAME` contiene `sinopsiagit.itorgon.es` y Vite lo copia automáticamente dentro de `dist/` en cada compilación.
3. **Conexión automática con la API:** Al detectar el dominio de GitHub Pages, `getApiBaseUrl()` apunta automáticamente al backend desplegado en `https://sinopsiaapi.vercel.app` (contando también con soporte y respaldo hacia [sinopsiaapi.itorgon.es](https://sinopsiaapi.itorgon.es/)).

Existen **dos formas** de desplegar el frontend en GitHub Pages:

#### Opción A: Despliegue automático con GitHub Actions (Recomendado)

El repositorio incluye el flujo de trabajo `.github/workflows/deploy.yml`:

1. En tu repositorio de GitHub, ve a **Settings → Pages**.
2. En **Build and deployment → Source**, selecciona **GitHub Actions** (o la rama `gh-pages`, ya que el workflow actualiza ambos).
3. El workflow se ejecuta automáticamente al hacer `push` a las ramas configuradas en `.github/workflows/deploy.yml` (o puedes lanzarlo manualmente desde la pestaña **Actions → Deploy SinopsIA to GitHub Pages → Run workflow**).
4. Si quieres que se dispare automáticamente al hacer `push` en `ghpages-production`, asegúrate de que la rama esté incluida bajo `on.push.branches` en `.github/workflows/deploy.yml`:
   ```yaml
   on:
     push:
       branches:
         - ghpages-production
         - prueba
         - main
     workflow_dispatch:
   ```
5. Qué hace el workflow automáticamente:
   * Instala Node.js 22 y ejecuta `npm ci` en `Frontend/SinopsIA`.
   * Ejecuta `npm run build` generando la carpeta `Frontend/SinopsIA/dist` (incluyendo `404.html` y `CNAME`).
   * Publica el artefacto estático en la rama `gh-pages` y en el entorno oficial de GitHub Pages.

#### Opción B: Despliegue manual desde terminal (`gh-pages`)

El proyecto incluye el paquete `gh-pages` configurado tanto en el `package.json` de la raíz como en `Frontend/SinopsIA/package.json`.

Para compilar y subir directamente la carpeta `dist` a la rama `gh-pages` desde tu máquina local:

```bash
# Desde la raíz del repositorio:
npm run deploy

# O desde Frontend/SinopsIA:
cd Frontend/SinopsIA
npm run deploy
```

*(El script `predeploy` ejecutará `npm run build` automáticamente antes de publicar la rama `gh-pages`).*

#### Configuración de dominio personalizado (DNS)

Si utilizas el dominio personalizado `sinopsiagit.itorgon.es`:
1. Configura un registro `CNAME` en tu proveedor de DNS apuntando `sinopsiagit` a `<tu-usuario-u-organizacion>.github.io`.
2. En **Settings → Pages → Custom domain**, verifica que aparezca `sinopsiagit.itorgon.es` y activa la casilla **Enforce HTTPS**.

---

### Parte 2: Despliegue del Backend API en Vercel

Para que el frontend de GitHub Pages pueda generar recomendaciones, el backend FastAPI está desplegado en Vercel y accesible tanto en [`https://sinopsiaapi.vercel.app`](https://sinopsiaapi.vercel.app) como en [sinopsiaapi.itorgon.es](https://sinopsiaapi.itorgon.es/):

1. Importa el repositorio en [Vercel](https://vercel.com).
2. Configura **Root Directory** como `Frontend/SinopsIA` (o la raíz del repositorio, ya que ambos cuentan con `vercel.json` y punto de entrada `api/index.py`).
3. En **Settings → Domains**, asocia el dominio personalizado [sinopsiaapi.itorgon.es](https://sinopsiaapi.itorgon.es/) además del dominio por defecto `https://sinopsiaapi.vercel.app`.
4. En **Settings → Environment Variables**, añade las siguientes variables de entorno para *Production* y *Preview*:
   * `GEMINI_API_KEY` *(Obligatoria)*: Clave de Google Gemini.
   * `TMDB_API_KEY` *(Obligatoria)*: Clave de The Movie Database.
   * `GEMINI_MODEL` *(Opcional)*: Por defecto `gemini-3.8-flash`.
   * `TMDB_REGION` *(Opcional)*: Por defecto `ES`.
   * `GOOGLE_BOOKS_API_KEY` *(Opcional)*: Clave para consultas a Google Books.
5. Despliega el proyecto en Vercel y comprueba que el endpoint de salud responde en ambos dominios:
   ```bash
   curl https://sinopsiaapi.vercel.app/api/health
   curl https://sinopsiaapi.itorgon.es/api/health
   ```
6. Si utilizas otra URL para la API, puedes indicársela al frontend definiendo la variable de entorno `VITE_API_URL` durante el build de GitHub Pages o actualizando `Frontend/SinopsIA/src/utils/apiConfig.js`.
