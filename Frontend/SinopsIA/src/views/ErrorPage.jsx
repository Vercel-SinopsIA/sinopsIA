import { useEffect } from "react";
import { Link, useNavigate, useRouteError } from "react-router-dom";
import { ROUTES } from "../routes/paths";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      navigate(ROUTES.HOME, { replace: true });
    }, 5000);

    return () => window.clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5EFEB] px-5 py-12">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-sky-700">
          Error
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          No se ha podido cargar esta página
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Ha ocurrido un problema inesperado. Te redirigiremos al inicio en unos
          segundos.
        </p>
        {error?.statusText && (
          <p className="mt-2 text-sm text-slate-500">{error.statusText}</p>
        )}
        <Link
          to={ROUTES.HOME}
          className="mt-8 inline-flex rounded-xl bg-sky-700 px-6 py-3 font-semibold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Volver al inicio ahora
        </Link>
      </section>
    </main>
  );
};

export default ErrorPage;
