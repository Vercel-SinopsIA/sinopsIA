import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";
import { getApiBaseUrl } from "../utils/apiConfig";

const features = [
  {
    icon: "🎬",
    title: "Películas y series para ti",
    description:
      "Descubre qué ver según tus gustos, con pósters y plataformas disponibles en España.",
  },
  {
    icon: "📚",
    title: "Libros que enganchan",
    description:
      "Encuentra tu próxima lectura entre historias y autores que encajan contigo.",
  },
  {
    icon: "✨",
    title: "Recomendaciones inteligentes",
    description:
      "La IA te ayuda a explorar nuevas opciones y a decidir qué disfrutar después.",
  },
];

export default function Home() {
  const [contentType, setContentType] = useState("ambos");
  const [genres, setGenres] = useState("");
  const [preferences, setPreferences] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [catalogNotice, setCatalogNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRecommendationSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCatalogNotice("");
    setRecommendations([]);
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 120_000);

    const apiBaseUrl = getApiBaseUrl();
    const payload = {
      content_type: contentType,
      genres: genres.split(",").map((genre) => genre.trim()).filter(Boolean),
      preferences,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        const validationError = Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).join(" ")
          : data.detail;
        throw new Error(validationError || "No se pudieron obtener recomendaciones.");
      }

      setRecommendations(data.recommendations);
      setCatalogNotice(data.catalog_notice || "");
    } catch (requestError) {
      let friendlyError = requestError.message || "No se pudo conectar con el servicio.";
      if (requestError.name === "AbortError") {
        friendlyError = "La solicitud está tardando demasiado. Comprueba el backend e inténtalo de nuevo.";
      } else if (requestError.message === "Failed to fetch") {
        friendlyError = `No se pudo conectar con el backend (${apiBaseUrl || "servidor local"}). Verifica que el servicio esté activo.`;
      }
      setError(friendlyError);
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5EFEB] px-5 py-12 text-slate-900 sm:px-8 lg:px-12">
      <section className="mx-auto grid max-w-6xl items-center gap-12 rounded-3xl bg-white px-7 py-12 shadow-xl shadow-slate-900/5 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-16">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800">
            Tu próxima historia empieza aquí
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Sinops<span className="text-sky-700">IA</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Un recomendador de inteligencia artificial para encontrar películas,
            series y libros que encajan contigo. Cuéntanos qué te gusta y
            descubre tu próxima historia favorita.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to={ROUTES.REGISTER}
              className="rounded-xl bg-sky-700 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-700/20 transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Empezar ahora
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Conócenos
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleRecommendationSubmit}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner"
        >
          <h2 className="text-2xl font-bold text-slate-900">
            Encuentra tu próxima historia
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Indica qué te gusta y la IA preparará tres recomendaciones.
          </p>

          <label
            htmlFor="content-type"
            className="mt-5 block text-sm font-semibold text-slate-700"
          >
            ¿Qué buscas?
          </label>
          <select
            id="content-type"
            value={contentType}
            onChange={(event) => setContentType(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
          >
            <option value="ambos">Películas, series y libros</option>
            <option value="pelicula">Películas</option>
            <option value="serie">Series</option>
            <option value="libro">Libros</option>
          </select>

          <label
            htmlFor="genres"
            className="mt-4 block text-sm font-semibold text-slate-700"
          >
            Géneros (separados por comas)
          </label>
          <input
            id="genres"
            value={genres}
            onChange={(event) => setGenres(event.target.value)}
            placeholder="Por ejemplo: fantasía, misterio"
            required
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />

          <label
            htmlFor="preferences"
            className="mt-4 block text-sm font-semibold text-slate-700"
          >
            ¿Qué tipo de historia te apetece?
          </label>
          <textarea
            id="preferences"
            value={preferences}
            onChange={(event) => setPreferences(event.target.value)}
            placeholder="Cuéntanos tus gustos o qué te gustaría encontrar..."
            minLength={10}
            maxLength={500}
            rows={3}
            required
            className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-5 w-full rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            {isLoading ? "Consultando IA y catálogos..." : "Recomiéndame"}
          </button>
          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </form>
      </section>

      {recommendations.length > 0 && (
        <section
          aria-live="polite"
          className="mx-auto mt-12 max-w-6xl"
        >
          <h2 className="mb-6 text-center text-3xl font-bold text-slate-900">
            Recomendaciones para ti
          </h2>
          {catalogNotice && (
            <p
              role="status"
              className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
            >
              {catalogNotice}
            </p>
          )}
          <div className="grid gap-6 md:grid-cols-3">
            {recommendations.map((recommendation, index) => (
              <article
                key={`${recommendation.title}-${index}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {recommendation.image_url ? (
                  <img
                    src={recommendation.image_url}
                    alt={`Portada o póster de ${recommendation.title}`}
                    loading="lazy"
                    className="h-72 w-full object-cover object-center"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-72 items-center justify-center bg-slate-100 text-6xl"
                  >
                    {recommendation.type === "libro" ? "📚" : "🎬"}
                  </div>
                )}
                <div className="p-6">
                  <span className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                    {recommendation.type === "pelicula"
                      ? "Película"
                      : recommendation.type === "serie"
                        ? "Serie"
                        : "Libro"}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {recommendation.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {recommendation.creator}
                  </p>
                  <p className="mt-4 leading-7 text-slate-700">
                    {recommendation.synopsis}
                  </p>
                  <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">
                    <span className="font-semibold text-slate-800">
                      Por qué puede gustarte:{" "}
                    </span>
                    {recommendation.reason}
                  </p>
                  {recommendation.type !== "libro" && (
                    <div className="mt-4 border-t border-slate-100 pt-4 text-sm">
                      <h4 className="font-semibold text-slate-800">
                        Dónde verlo en España
                      </h4>
                      {recommendation.platforms.length > 0 ? (
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {recommendation.platforms.map((platform) => (
                            <li
                              key={platform}
                              className="rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-800"
                            >
                              {platform}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-slate-500">
                          No hay plataformas registradas actualmente.
                        </p>
                      )}
                      {recommendation.availability_url && (
                        <a
                          href={recommendation.availability_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-block font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-900"
                        >
                          Ver disponibilidad
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">
            Los datos de películas, series y proveedores de visualización se
            obtienen de TMDb. Este producto no está aprobado ni certificado por
            TMDb.
          </p>
        </section>
      )}

      <section className="mx-auto mt-16 max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Historias hechas para ti
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Películas, series y libros nuevos que descubrir, con ayuda de la IA.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span
                aria-hidden="true"
                className="text-4xl"
              >
                {feature.icon}
              </span>
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
