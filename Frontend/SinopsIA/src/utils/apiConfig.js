/**
 * Obtiene la URL base de la API según el entorno de ejecución.
 * - Si se define VITE_API_URL, se usa esa URL con máxima prioridad.
 * - En desarrollo local, se usa la ruta relativa ('') para usar el proxy de Vite.
 * - En otros entornos, se conecta a la API en sinopsia-seven.vercel.app.
 */
export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '';
    }
  }

  return 'https://sinopsia-seven.vercel.app';
};
