import React from 'react';
import { SignIn } from '@clerk/react';
import { ROUTES } from '../routes/paths';

const Login = () => {
  return (
    <div className="min-h-screen bg-[#F5EFEB] p-5 flex items-center justify-center">
      <SignIn routing="hash" signUpUrl={ROUTES.REGISTER} forceRedirectUrl={ROUTES.HOME} />
    </div>
  );
};

export default Login;