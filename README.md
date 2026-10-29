# SinopsIA

Aplicación React + Vite con Tailwind CSS y backend FastAPI. FastAPI valida las
preferencias con Pydantic y consulta Gemini; la clave de Gemini solo se usa en el
servidor.

## Requisitos

- Git Bash para Windows.
- Node.js y npm.
- Python 3.10 o superior.
- Una clave Gemini nueva. Si alguna clave se compartió previamente, revócala y
  crea otra.
- Una clave API de TMDb para obtener pósteres y plataformas de películas y
  series ([solicítala en la configuración API de TMDb](https://www.themoviedb.org/settings/api)).
  Las portadas de libros se buscan en Google Books y, como alternativa, Open
  Library; no necesitan clave adicional. Se puede configurar opcionalmente
  `GOOGLE_BOOKS_API_KEY` para autenticar las consultas a
  [Google Books API](https://developers.google.com/books/docs/v1/using).
- Una clave publicable de Clerk para iniciar sesión y crear cuentas. La clave
  secreta de Clerk no debe añadirse al frontend.

## Instalar y configurar

Abre Git Bash en la raíz del repositorio y entra a la aplicación:

```bash
cd Frontend/SinopsIA
```

Instala las dependencias del frontend:

```bash
npm install
```

Crea el entorno virtual en `Frontend/.venv` (no dentro de
`Frontend/SinopsIA`) e instala las dependencias del backend. El repositorio
ya contiene ese entorno local; no necesitas crear otro si esa carpeta existe:

```bash
if [ ! -d ../.venv ]; then python -m venv ../.venv; fi
source ../.venv/Scripts/activate
python -m pip install -r requirements.txt
```

Crea el archivo local de configuración a partir de la plantilla solo si aún no
existe, para no sobrescribir una clave que ya hayas configurado:

```bash
if [ ! -f .env.local ]; then cp .env.local.example .env.local; fi
```

Edita `.env.local` y rellena `GEMINI_API_KEY`, `TMDB_API_KEY` y
`CLERK_PUBLISHABLE_KEY`. Obtén la clave publicable en el panel de Clerk. Vite
expone únicamente esta clave publicable al frontend; no añadas la clave secreta
de Clerk. Puedes dejar el modelo por defecto (`GEMINI_MODEL=gemini-3.8-flash`)
o elegir otro disponible para tu cuenta. `TMDB_REGION=ES` configura el país
usado al consultar plataformas. Opcionalmente, añade `GOOGLE_BOOKS_API_KEY`
para autenticar las consultas a Google Books.

**No publiques ni subas `.env.local` a Git.** Está excluido mediante
`.gitignore`. No guardes la clave en el frontend ni en variables `VITE_*`,
porque acabaría incluida en el código público que recibe el navegador. En
Vercel, configura `CLERK_PUBLISHABLE_KEY`, `GEMINI_API_KEY`, `TMDB_API_KEY` y,
opcionalmente, `GEMINI_MODEL`, `TMDB_REGION` y `GOOGLE_BOOKS_API_KEY` en
**Project Settings → Environment Variables**. La clave publicable de Clerk no
es secreta y está diseñada para usarse en el cliente.

Las búsquedas de usuarios con sesión iniciada se guardan en el `localStorage`
del navegador, separadas por el ID de usuario de Clerk y limitadas a las 30 más
recientes. El historial solo está disponible en ese navegador y no se sincroniza
entre dispositivos.

## Arrancar las dos partes

Abre dos terminales Git Bash desde la raíz del repositorio. En cada una,
cambia a la carpeta de la aplicación. El entorno virtual está en
`Frontend/.venv`, un nivel por encima de `Frontend/SinopsIA`.

### Terminal 1: backend FastAPI

```bash
cd Frontend/SinopsIA
source ../.venv/Scripts/activate
python -m uvicorn api.index:app --reload --host 127.0.0.1 --port 8000
```

Comprueba el backend desde otra terminal:

```bash
curl http://127.0.0.1:8000/api/health
```

Debe devolver un JSON con `"status":"ok"`.

### Terminal 2: frontend Vite

```bash
cd Frontend/SinopsIA
npm run dev
```

Abre la URL que muestra Vite, normalmente `http://localhost:5173`. El proxy de
Vite reenvía las solicitudes `/api` al backend local en el puerto 8000.

## Probar

En la página de inicio, selecciona películas, series, libros o todos los tipos,
escribe uno o más géneros separados por comas y describe tus preferencias.
Pulsa **Recomiéndame** para solicitar resultados a Gemini. Los pósteres y
plataformas de películas y series proceden de TMDb para la región configurada;
las portadas de libros se buscan primero en Google Books y después en Open
Library si no hay portada o Google Books responde con error; Open Library prueba
con título y autor y, después, con el título solamente.
Si ningún proveedor encuentra una portada, se muestra la recomendación sin
imagen.

El terminal de FastAPI registra cada etapa con proveedor y operación (Gemini,
Google Books, Open Library o TMDb). Los errores HTTP del catálogo identifican
proveedor, operación y estado; ante un HTTP 429 conserva las recomendaciones
de Gemini y la interfaz avisa qué catálogo limitó las consultas. No se
registran las claves ni las URLs de petición.

También se puede llamar a la API directamente. Desde una terminal en
`Frontend/SinopsIA`:

```bash
curl -X POST http://127.0.0.1:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"content_type":"serie","genres":["misterio","fantasía"],"preferences":"Me gustan las historias de misterio y aventura."}'
```

Para comprobar la validación, envía una lista de géneros vacía o preferencias
muy cortas: FastAPI debe responder HTTP 422 sin contactar con Gemini.
Si Gemini devuelve HTTP 503 por saturación, el backend reintenta hasta dos veces
con pausas breves; si sigue sin estar disponible, la interfaz te pide que lo
intentes de nuevo más tarde.
Si devuelve HTTP 429 por cuota agotada, no se reintenta y se muestra el tiempo
de espera que indique Gemini junto con el enlace a su panel de límites.

Las pruebas automáticas usan Gemini simulado y no consumen llamadas ni necesitan
una clave real:

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

La aplicación incluye `Frontend/SinopsIA/vercel.json`, que dirige las rutas
`/api/*` hacia `api/index.py` y el resto de rutas a `index.html` para que React
gestione la navegación. Ese archivo expone FastAPI como función Python; Vite
genera el frontend estático en `dist`. El frontend y la API comparten dominio y
usan rutas relativas, por lo que no dependen de CORS ni de un segundo dominio.
No se incluye el CLI de Vercel como dependencia npm.

Para desplegar:

1. Importa el repositorio desde Git en Vercel.
2. Selecciona `Frontend/SinopsIA` como **Root Directory** y el preset de Vite.
3. Usa `npm run build` como comando de build y `dist` como directorio de salida.
4. En **Settings → Environment Variables**, configura:
   - `GEMINI_API_KEY` (obligatoria).
   - `TMDB_API_KEY` (obligatoria para recomendaciones de películas y series).
   - `GEMINI_MODEL` (opcional; por defecto `gemini-3.8-flash`).
   - `TMDB_REGION` (opcional; por defecto `ES`).
   - `GOOGLE_BOOKS_API_KEY` (opcional).
   - `CLERK_PUBLISHABLE_KEY` (necesaria para iniciar sesión y crear cuentas;
     obtén la clave publicable en el panel de Clerk).
5. Añade las variables a los entornos Preview, Production o Development que
   vayas a usar y crea un despliegue.
6. Verifica que la URL principal (`/`) muestra el inicio, comprueba
   `/api/health` y prueba una recomendación desde la web desplegada.

Configura las variables en los entornos de Vercel que vayas a utilizar. Solo
`CLERK_PUBLISHABLE_KEY` debe exponerse al cliente; no añadas la clave secreta de
Clerk ni claves de Gemini, TMDb o Google Books a variables `VITE_*`. El dominio
y los ajustes del proyecto se gestionan por separado en el panel de Vercel.
