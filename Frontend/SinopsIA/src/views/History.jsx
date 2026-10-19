import { useState } from "react";
import { useUser } from "@clerk/react";
import RecommendationCards from "../Components/RecommendationCards.jsx";
import {
  clearSearchHistory,
  getSearchHistory,
} from "../utils/searchHistory.js";

const contentTypeLabels = {
  ambos: "Películas, series y libros",
  pelicula: "Películas",
  serie: "Series",
  libro: "Libros",
};

const History = () => {
  const { user } = useUser();
  const [{ history, error }, setHistoryState] = useState(() => {
    try {
      return { history: getSearchHistory(user.id), error: "" };
    } catch {
      return {
        history: [],
        error: "No se pudo leer el historial guardado en este navegador.",
      };
    }
  });

  const handleClearHistory = () => {
    try {
      clearSearchHistory(user.id);
      setHistoryState({ history: [], error: "" });
    } catch {
      setHistoryState((current) => ({
        ...current,
        error: "No se pudo borrar el historial. Inténtalo de nuevo.",
      }));
    }
  };

  return (
    <main className="min-h-screen bg-[#F5EFEB] px-5 py-12 text-slate-900 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mi historial</h1>
            <p className="mt-2 text-slate-600">
              Tus últimas 30 búsquedas guardadas en este navegador.
            </p>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Borrar historial
            </button>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
          >
            {error}
          </p>
        )}

        {history.length === 0 && !error && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold">Todavía no tienes búsquedas guardadas.</p>
            <p className="mt-2 text-slate-600">
              Cuando pidas recomendaciones, aparecerán aquí.
            </p>
          </div>
        )}

        <div className="space-y-10">
          {history.map((entry) => (
            <section
              key={entry.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="mb-6 border-b border-slate-100 pb-5">
                <p className="text-sm font-semibold text-sky-700">
                  {contentTypeLabels[entry.contentType] || entry.contentType}
                  {" · "}
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">Géneros:</span>{" "}
                  {entry.genres.join(", ")}
                </p>
                <p className="mt-2 text-slate-700">{entry.preferences}</p>
              </div>
              {entry.catalogNotice && (
                <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  {entry.catalogNotice}
                </p>
              )}
              <RecommendationCards recommendations={entry.recommendations} />
            </section>
          ))}
        </div>
      </section>
    </main>
  );
};

export default History;
