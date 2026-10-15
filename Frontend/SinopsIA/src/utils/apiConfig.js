/**
 * Obtiene la URL base de la API según el entorno de ejecución.
 * - Si se define VITE_API_URL, se usa esa URL con máxima prioridad.
 * - Si la app se carga desde GitHub Pages (sinopsiagit.itorgon.es o *.github.io),
 *   utiliza la API alojada en Vercel (https://sinopsia-seven.vercel.app).
 * - En local o en el despliegue de Vercel (sinopsia-seven.vercel.app o sinopsia.itorgon.es),
 *   se usa la ruta relativa ('') para operar sobre el mismo origen.
 */
export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Si estamos en Vercel sobre el mismo host o en local con proxy de desarrollo:
    if (
      hostname.includes('sinopsia-seven.vercel.app') ||
      hostname.includes('sinopsia.itorgon.es') ||
      hostname.includes('sinopsiaapi.itorgon.es') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    ) {
      return '';
    }

    // Si estamos en GitHub Pages o cualquier otro host externo:
    if (hostname.includes('sinopsiagit') || hostname.includes('github.io')) {
      return 'https://sinopsia-seven.vercel.app';
    }
  }

  return 'https://sinopsia-seven.vercel.app';
  return 'https://sinopsia-seven.vercel.app';
};
