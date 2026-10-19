# SinopsIA

Aplicación React + Vite con Tailwind CSS y backend FastAPI. El backend valida
las preferencias con Pydantic y consulta Gemini; la clave solo se usa en el
servidor.

## Requisitos

- Git Bash para Windows.
- Node.js y npm.
- Python 3.10 o superior.
- Una clave Gemini nueva. Si alguna clave se compartió previamente, revócala y
  crea otra.
- Una clave API de TMDb para consultar pósteres y disponibilidad de películas y
  series ([solicítala en la configuración API de TMDb](https://www.themoviedb.org/settings/api)).
  Las portadas de libros se buscan primero en Google Books y, si no hay
  portada o Google Books responde con un error (por ejemplo, HTTP 503), se
  intenta Open Library primero con título y autor y después solo con el título;
  ninguno requiere una clave adicional. Google Books admite `GOOGLE_BOOKS_API_KEY` para
  autenticar consultas; si no se configura o no hay portada, se intenta Open
  Library.

## Instalar y configurar

Abre Git Bash en la raíz del repositorio:

```bash
cd Frontend/SinopsIA
```

Instala las dependencias de JavaScript:

```bash
npm install
```

Crea el entorno virtual en `Frontend/.venv`, un nivel por encima de esta
carpeta de aplicación. Ese entorno ya existe en este repositorio; si no está,
créalo con el comando siguiente:

```bash
if [ ! -d ../.venv ]; then python -m venv ../.venv; fi
source ../.venv/Scripts/activate
python -m pip install -r requirements.txt
```

Copia la plantilla de variables:

```bash
if [ ! -f .env.local ]; then cp .env.local.example .env.local; fi
```

Edita `.env.local` con un editor y rellena `GEMINI_API_KEY`, `TMDB_API_KEY` y
`VITE_CLERK_PUBLISHABLE_KEY`. Obtén la clave publicable en el panel de Clerk.
El prefijo `VITE_` hace que esta clave sea accesible desde el navegador; no
añadas la clave secreta de Clerk al frontend.
Opcionalmente, añade `GOOGLE_BOOKS_API_KEY` para autenticar las búsquedas de
portadas de Google Books ([Google Books API](https://developers.google.com/books/docs/v1/using)).
Puedes dejar `GEMINI_MODEL=gemini-3.8-flash` o seleccionar otro modelo
disponible para tu cuenta. `TMDB_REGION=ES` configura la región usada para las
plataformas de streaming; puedes cambiarla por otro código de país compatible.

**No publiques ni subas `.env.local` a Git.** Está excluido mediante
`.gitignore`. No guardes secretos del backend en el frontend ni en variables
`VITE_*`, porque acabarían incluidas en el código público que recibe el
navegador. `VITE_CLERK_PUBLISHABLE_KEY` es la excepción: Clerk la diseña para
usarse públicamente en el cliente. En Vercel, configura
`VITE_CLERK_PUBLISHABLE_KEY`, `GEMINI_API_KEY`, `TMDB_API_KEY` y, opcionalmente,
`GEMINI_MODEL`, `TMDB_REGION` y `GOOGLE_BOOKS_API_KEY` en **Project Settings →
Environment Variables**.

Las búsquedas de usuarios con sesión iniciada se guardan en el `localStorage`
del navegador, separadas por el ID de usuario de Clerk y limitadas a las 30 más
recientes. El historial solo está disponible en ese navegador y no se sincroniza
entre dispositivos.

## Arrancar en desarrollo

Abre dos terminales Git Bash en la raíz del repositorio. En ambas entra a esta
carpeta con `cd Frontend/SinopsIA`. El entorno virtual está en
`Frontend/.venv`.

En la primera, arranca FastAPI:

```bash
cd Frontend/SinopsIA
source ../.venv/Scripts/activate
python -m uvicorn api.index:app --reload --host 127.0.0.1 --port 8000
```

Puedes comprobarlo con otra terminal:

```bash
curl http://127.0.0.1:8000/api/health
```

En la segunda terminal, arranca Vite:

```bash
cd Frontend/SinopsIA
npm run dev
```

Abre la URL local que indique Vite, normalmente `http://localhost:5173`. El
proxy de Vite redirige `/api` al backend del puerto 8000.

## Probar

En el formulario del Home, selecciona películas, series, libros o todos los
tipos, indica géneros separados por comas, describe tus preferencias y pulsa
**Recomiéndame**. Los pósteres y plataformas de películas y series proceden de
TMDb para la región configurada; las portadas y autores de libros se buscan
primero en Google Books, con Open Library como alternativa para las portadas.
Si ninguno encuentra una imagen, se mostrará el resultado sin ella.

El terminal de FastAPI registra cada fase con `provider` y `operation`:
`Gemini / generation`, `Google Books / búsqueda de libros`, `Open Library /
búsqueda alternativa de portada` o `TMDb / búsqueda de película, serie o
disponibilidad`. Si un catálogo devuelve HTTP 429, la respuesta identifica
cuál y conserva las recomendaciones de Gemini. Los logs no imprimen claves ni
URLs de petición.

También puedes llamar directamente a la API:

```bash
curl -X POST http://127.0.0.1:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"content_type":"serie","genres":["misterio","fantasía"],"preferences":"Me gustan las historias de misterio y aventura."}'
```

Para probar la validación, envía una lista de géneros vacía o preferencias muy
cortas: la API debe devolver HTTP 422 antes de llamar a Gemini.
Cuando Gemini responde HTTP 503 por saturación, FastAPI reintenta hasta dos
veces; si el proveedor sigue ocupado, la interfaz te pide que lo intentes más
tarde.
Si Gemini devuelve HTTP 429 indicando que se agotó la cuota, no se reintenta:
la API informa de la espera indicada por el proveedor y enlaza al panel de
límites de uso.

Las pruebas automáticas usan un cliente Gemini simulado, por lo que no consumen
llamadas ni necesitan una clave real:

```bash
source ../.venv/Scripts/activate
python -m pytest -q
```

## Build y lint del frontend

```bash
npm run build
npm run lint
```

## Despliegue en Vercel

El proyecto incluye `vercel.json`, que dirige las rutas `/api/*` a
`api/index.py` (FastAPI como función Python) y el resto de rutas a `index.html`
para que el inicio cargue en `/` y React gestione la navegación. Vite genera el
frontend estático en `dist`. El navegador llama a la API con rutas relativas
(`/api/...`), así que el frontend y la API comparten el mismo dominio, sin
depender de CORS ni de un segundo dominio. No hace falta añadir un paquete de
Vercel a `package.json`.

1. Importa el repositorio de Git en Vercel.
2. Configura **Root Directory** como `Frontend/SinopsIA`, donde están juntos
   `package.json`, `vercel.json` y `api/index.py`.
3. Usa el preset de Vite. El comando de build es `npm run build` y el directorio
   de salida es `dist`.
4. En **Settings → Environment Variables**, añade:
   - `GEMINI_API_KEY` (obligatoria para recomendaciones).
   - `TMDB_API_KEY` (obligatoria para recomendaciones que incluyan películas
     o series).
   - `GEMINI_MODEL` (opcional; por defecto `gemini-3.8-flash`).
   - `TMDB_REGION` (opcional; por defecto `ES`).
   - `GOOGLE_BOOKS_API_KEY` (opcional; Open Library se usa como alternativa
     para las portadas).
   - `VITE_CLERK_PUBLISHABLE_KEY` (obligatoria para iniciar sesión y crear
     cuentas; obtén la clave publicable en el panel de Clerk).
5. Crea un despliegue y comprueba que la URL principal (`/`) muestra el inicio.
   Después, comprueba `/api/health` y envía una recomendación desde la página
   para validar también Gemini y los catálogos.

Configura las variables en los entornos de Vercel que vayas a utilizar
(Production, Preview y/o Development). No las añadas al frontend ni a variables
con prefijo `VITE_`.

El dominio se configura en Vercel; la configuración de rutas sirve el frontend
y FastAPI desde ese mismo dominio. Si Vercel mantiene una compilación anterior,
crea un nuevo despliegue después de guardar los cambios.
