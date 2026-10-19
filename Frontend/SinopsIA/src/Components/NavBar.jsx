import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { UserButton, useUser } from "@clerk/react";
import { ROUTES } from "../routes/paths";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const userName =
    user?.firstName ||
    user?.username ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="relative z-40">
      <nav className="p-4 sticky top-0 z-40 bg-[#567C8D]">
        <div className="flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
              className="text-3xl text-white"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
            <NavLink
              to={ROUTES.HOME}
              onClick={closeMenu}
              className="text-xl font-bold text-white sm:text-2xl"
            >
              SinopsIA
            </NavLink>
            {isLoaded && isSignedIn && userName && (
              <span className="text-sm font-medium text-white sm:text-base">
                Hola, {userName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-white sm:block sm:text-base">
              Recomendador de series, películas y libros
            </span>
            {isLoaded && isSignedIn && <UserButton />}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`absolute left-0 w-64 p-6 shadow-lg transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } bg-[#43697a] text-white`}
        style={{ top: "100%" }}
      >
        <ul className="space-y-4">
          <li>
            <NavLink
              to={ROUTES.HOME}
              onClick={closeMenu}
              className="block rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-[#FFA500] hover:text-black"
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to={ROUTES.ABOUT}
              onClick={closeMenu}
              className="transition-all duration-300 ease-in-out hover:bg-[#FFA500] hover:text-black p-2 rounded-lg"
            >
              Sobre Nosotros
            </NavLink>
          </li>

          {isLoaded && !isSignedIn && (
            <>
              <li>
                <NavLink
                  to={ROUTES.LOGIN}
                  onClick={closeMenu}
                  className="block rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-[#FFA500] hover:text-black"
                >
                  Iniciar sesión
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={ROUTES.REGISTER}
                  onClick={closeMenu}
                  className="block rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-[#FFA500] hover:text-black"
                >
                  Crear cuenta
                </NavLink>
              </li>
            </>
          )}
          {isLoaded && isSignedIn && (
            <li>
              <NavLink
                to={ROUTES.HISTORY}
                onClick={closeMenu}
                className="block rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-[#FFA500] hover:text-black"
              >
                Mi historial
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;