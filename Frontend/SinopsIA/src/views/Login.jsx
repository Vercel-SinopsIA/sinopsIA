import { SignIn } from "@clerk/react";
import { ROUTES } from "../routes/paths";

const Login = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#F5EFEB] p-5">
    <SignIn
      routing="hash"
      signUpUrl={ROUTES.REGISTER}
      fallbackRedirectUrl={ROUTES.HOME}
    />
  </main>
);

export default Login;
