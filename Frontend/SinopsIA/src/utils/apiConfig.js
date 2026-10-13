/**
 * Obtiene la URL base de la API según el entorno de ejecución.
 * - Si se define VITE_API_URL, se usa esa URL con máxima prioridad.
 * - Si la app se carga desde GitHub Pages (sinopsiagit.itorgon.es o *.github.io),
 *   redirecciona las llamadas a la API alojada en Vercel (https://sinopsia.itorgon.es).
 * - En local o en el despliegue principal de Vercel (sinopsia.itorgon.es),
 *   se usa la ruta relativa ('') para operar sobre el mismo origen.
 */
export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('sinopsiagit') || hostname.includes('github.io')) {
      return 'https://sinopsia.itorgon.es';
    }
  }

  return '';
};

