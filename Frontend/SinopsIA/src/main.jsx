import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import './index.css'
import App from './App.jsx'

const clerkPublishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {clerkPublishableKey ? (
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        afterSignOutUrl="/"
      >
        <App />
      </ClerkProvider>
    ) : (
      <main className="flex min-h-screen items-center justify-center bg-[#F5EFEB] p-6 text-center text-[#2F4156]">
        <div role="alert" className="max-w-xl rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-3 text-2xl font-bold">Falta configurar Clerk</h1>
          <p>
            Añade la variable CLERK_PUBLISHABLE_KEY en .env.local y reinicia el
            servidor de desarrollo. En Vercel, configúrala en las variables de
            entorno del proyecto y vuelve a desplegar.
          </p>
        </div>
      </main>
    )}
  </StrictMode>,
)
