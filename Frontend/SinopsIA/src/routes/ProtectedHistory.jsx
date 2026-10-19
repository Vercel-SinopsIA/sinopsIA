import { useUser } from "@clerk/react";
import { Navigate } from "react-router-dom";
import History from "../views/History.jsx";
import { ROUTES } from "./paths.js";

const ProtectedHistory = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5EFEB] text-slate-700">
        Cargando...
      </main>
    );
  }

  return isSignedIn ? <History /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedHistory;

