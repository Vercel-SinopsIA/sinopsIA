import React from "react";
import { SignUp } from "@clerk/react";
import { ROUTES } from "../routes/paths";

function Register() {
  return (
    <div className="min-h-screen bg-[#F5EFEB] p-5 flex items-center justify-center">
      <SignUp routing="hash" signInUrl={ROUTES.LOGIN} forceRedirectUrl={ROUTES.HOME} />
    </div>
  );
}

export default Register;