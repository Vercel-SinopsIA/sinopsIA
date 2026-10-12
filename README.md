# SinopsisIA

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

## Instalar y configurar

Abre Git Bash en la raíz del repositorio y entra a la aplicación:

```bash
cd Frontend/FitAdapt-AI
```

Instala las dependencias del frontend:

```bash
npm install
```

Crea el entorno virtual en `Frontend/.venv` (no dentro de
`Frontend/FitAdapt-AI`) e instala las dependencias del backend. El repositorio
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

Edita `.env.local` y rellena `GEMINI_API_KEY` y `TMDB_API_KEY`. Puedes dejar el
modelo por defecto (`GEMINI_MODEL=gemini-3.8-flash`) o elegir otro disponible
para tu cuenta. `TMDB_REGION=ES` configura el país usado al consultar plataformas.
Opcionalmente, añade `GOOGLE_BOOKS_API_KEY` para usar la API key de Google Books.

**No publiques ni subas `.env.local` a Git.** Está excluido mediante
`.gitignore`. No guardes la clave en el frontend ni en variables `VITE_*`,
porque acabaría incluida en el código público que recibe el navegador. En
Vercel, configura `GEMINI_API_KEY`, `TMDB_API_KEY` y, opcionalmente,
`GEMINI_MODEL`, `TMDB_REGION` y `GOOGLE_BOOKS_API_KEY` en **Project Settings →
Environment Variables**.

## Arrancar las dos partes

Abre dos terminales Git Bash desde la raíz del repositorio. En cada una,
cambia a la carpeta de la aplicación. El entorno virtual está en
`Frontend/.venv`, un nivel por encima de `Frontend/FitAdapt-AI`.

### Terminal 1: backend FastAPI

```bash
cd Frontend/FitAdapt-AI
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
cd Frontend/FitAdapt-AI
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

El terminal de FastAPI indica cada etapa junto con el proveedor (`Gemini`,
`Google Books` o `TMDb`). Los errores HTTP del catálogo identifican proveedor,
operación y estado; ante un HTTP 429 conserva las recomendaciones de Gemini y
la interfaz avisa qué catálogo limitó las consultas. No se registran las claves
ni las URLs de petición.

También se puede llamar a la API directamente. Desde una terminal en
`Frontend/FitAdapt-AI`:

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
