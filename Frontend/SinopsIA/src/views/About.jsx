import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";

const team = [
  { initials: "FS", name: "Francisco José Salmerón" },
  { initials: "IT", name: "Ismael Torres" },
  { initials: "A", name: "Alejandro" },
];

const About = () => (
  <main className="min-h-screen bg-[#F5EFEB] px-5 py-12 text-slate-900 sm:px-8 lg:px-12">
    <div className="mx-auto max-w-5xl">
      <header className="rounded-3xl bg-white px-7 py-12 text-center shadow-xl shadow-slate-900/5 sm:px-12">
        <p className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800">
          Sobre nosotros
        </p>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Historias que encajan contigo
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          SinopsisIA es un recomendador de películas, series y libros que combina
          inteligencia artificial y datos de catálogo para ayudarte a encontrar
          tu próxima historia favorita.
        </p>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <span aria-hidden="true" className="text-4xl">✨</span>
          <h2 className="mt-4 text-2xl font-bold">Nuestra idea</h2>
          <p className="mt-3 leading-7 text-slate-600">
            A veces cuesta decidir qué ver o qué leer entre tantas opciones.
            SinopsisIA te propone recomendaciones según tus géneros favoritos y
            lo que te apetece, para que descubrir una buena historia sea más
            sencillo.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <span aria-hidden="true" className="text-4xl">🎬</span>
          <h2 className="mt-4 text-2xl font-bold">Cómo funciona</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Nos cuentas qué tipo de contenido buscas y qué historias te gustan.
            La IA genera sugerencias y los catálogos ayudan a mostrar portadas,
            pósteres y, cuando hay datos disponibles, dónde ver películas y
            series.
          </p>
        </article>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Nuestro equipo</h2>
          <p className="mt-3 text-slate-600">
            Somos el equipo que está detrás de SinopsisIA.
          </p>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-8">
          {team.map((member) => (
            <li key={member.name} className="w-40 text-center">
              <div
                aria-hidden="true"
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-sky-100 text-2xl font-bold text-sky-800"
              >
                {member.initials}
              </div>
              <p className="mt-3 font-semibold text-slate-800">{member.name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl bg-sky-800 px-7 py-10 text-center text-white sm:px-10">
        <h2 className="text-3xl font-bold">¿Listo para descubrir algo nuevo?</h2>
        <p className="mx-auto mt-3 max-w-2xl leading-7 text-sky-100">
          Cuéntanos qué te gusta y deja que SinopsisIA te ayude a encontrar tu
          próxima película, serie o libro.
        </p>
        <Link
          to={ROUTES.HOME}
          className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-sky-800 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-800"
        >
          Probar SinopsisIA
        </Link>
      </section>
    </div>
  </main>
);

export default About;
