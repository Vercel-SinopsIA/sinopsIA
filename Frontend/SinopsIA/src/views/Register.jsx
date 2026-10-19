import { SignUp } from "@clerk/react";
import { ROUTES } from "../routes/paths";

const Register = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#F5EFEB] p-5">
    <SignUp
      routing="hash"
      signInUrl={ROUTES.LOGIN}
      fallbackRedirectUrl={ROUTES.HOME}
    />
  </main>
);

export default Register;
