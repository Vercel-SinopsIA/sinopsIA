const RecommendationCards = ({ recommendations }) => (
  <>
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
      Los datos de películas, series y proveedores de visualización se obtienen
      de TMDb. Este producto no está aprobado ni certificado por TMDb.
    </p>
  </>
);

export default RecommendationCards;

