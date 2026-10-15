import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock, FaSpinner, FaUser } from 'react-icons/fa';
import { getApiBaseUrl } from '../utils/apiConfig';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const refreshToken = data.refreshToken;

        localStorage.setItem('username', username);
        localStorage.setItem('jwt', token);
        localStorage.setItem('refreshToken', refreshToken);
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
       
        toast.success('¡Login exitoso!');
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al iniciar sesión');
        toast.error('Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intente nuevamente.');
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const formBg = "bg-[#2F4156]";
  const inputBg = "bg-gray-800 text-white";
  const btnBg = "bg-red-500 hover:bg-red-600";
  const btnFocusRing = "focus:ring-2 focus:ring-red-500";

  return (
    <div className="min-h-screen bg-[#F5EFEB] p-5 text-black flex items-center justify-center">
      <div className={`w-11/12 max-w-md mx-auto ${formBg} p-8 rounded-lg shadow-xl transform transition-all duration-300 hover:shadow-2xl`}>
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-3xl" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8 text-white">Iniciar sesión</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Usuario */}
          <div className="relative">
            <label htmlFor="username" className="block text-lg font-medium mb-2 text-white">
              Usuario:
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="username"
                type="text"
                placeholder="Usuario"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-3 pl-10 rounded-lg ${inputBg} text-white placeholder-gray-300 focus:outline-none ${btnFocusRing} transition-all duration-300`}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="relative">
            <label htmlFor="password" className="block text-lg font-medium mb-2 text-white">
              Contraseña:
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 pl-10 rounded-lg ${inputBg} text-white placeholder-gray-300 focus:outline-none ${btnFocusRing} transition-all duration-300`}
              />
            </div>
          </div>

{/*
              Remember me & Forgot password 
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-red-400 hover:text-red-300 transition-colors duration-300">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
*/}

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-lg transition-all duration-300 focus:outline-none ${btnBg} ${btnFocusRing} transform hover:scale-[1.02] ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Cargando...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-center text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;