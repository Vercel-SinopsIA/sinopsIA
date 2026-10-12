import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Sección Principal (Hero) */}
      <section className="flex flex-col items-center text-center max-w-xl mx-auto my-12 space-y-6">
        <div className="relative flex items-center justify-center gap-6 mb-4">
          <img src={heroImg} width="170" height="179" alt="Hero background" className="absolute opacity-20 scale-125 pointer-events-none animate-pulse" />
          <img src={viteLogo} alt="Vite logo" className="w-20 h-20 transition-transform duration-300 hover:scale-110 drop-shadow-[0_0_2rem_#646cffaa]" />
          <img src={reactLogo} alt="React logo" className="w-20 h-20 transition-transform duration-300 hover:scale-110 animate-[spin_20s_linear_infinite] drop-shadow-[0_0_2rem_#61dafbaa]" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Get started
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Edit <code className="font-mono bg-slate-800 text-pink-400 px-1.5 py-0.5 rounded border border-slate-700">src/App.jsx</code> and save to test <code className="font-mono bg-slate-800 text-indigo-400 px-1.5 py-0.5 rounded border border-slate-700">HMR</code>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCount((count) => count + 1)}
          className="cursor-pointer inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium px-5 py-2.5 rounded-lg shadow-md shadow-indigo-600/20 transition-all duration-200 border border-indigo-400/20"
        >
          Count is <span className="font-bold bg-slate-900/40 px-2 py-0.5 rounded-md ml-1">{count}</span>
        </button>
      </section>

      {/* Divisor Visual */}
      <hr className="w-full max-w-4xl border-slate-800 my-8" />

      {/* Sección de Pasos Siguientes */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
        
        {/* Tarjeta de Documentación */}
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700/80 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-indigo-400" role="presentation" aria-hidden="true">
              <use href="/icons.svg#documentation-icon"></use>
            </svg>
            <h2 className="text-xl font-semibold text-slate-200">Documentation</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">Your questions, answered</p>
          <ul className="space-y-2.5">
            <li>
              <a href="https://vite.dev/" target="_blank" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-indigo-400 transition-colors group">
                <img className="w-4 h-4 group-hover:scale-110 transition-transform" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-indigo-400 transition-colors group">
                <img className="w-4 h-4 group-hover:scale-110 transition-transform" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>

        {/* Tarjeta de Redes Sociales */}
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700/80 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-purple-400" role="presentation" aria-hidden="true">
              <use href="/icons.svg#social-icon"></use>
            </svg>
            <h2 className="text-xl font-semibold text-slate-200">Connect with us</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">Join the Vite community</p>
          <ul className="grid grid-cols-2 gap-3">
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-purple-400 transition-colors group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-purple-400 transition-colors group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-purple-400 transition-colors group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-purple-400 transition-colors group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* Espaciador Inferior */}
      <footer className="h-16" />
    </div>
  )
}

export default App
