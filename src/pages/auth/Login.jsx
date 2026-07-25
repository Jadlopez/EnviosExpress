import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ArrowRight, Package } from 'lucide-react';
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email,
        password
      });

      const { token, rol } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol);

      if (rol === 'ADMIN' || rol === 'DESPACHADOR') {
        navigate('/admin');
      } else if (rol === 'CONDUCTOR') {
        navigate('/driver');
      } else {
        navigate('/rastreo');
      }

    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas o error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 sm:px-6 py-8">
      {/* Caja contenedora adaptada para móviles y escritorios */}
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700">
        
        {/* Encabezado */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-600/20 text-blue-400 mb-3 sm:mb-4">
            <Package className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Envíos Express</h2>
          <p className="text-slate-300 text-sm sm:text-base mt-1">Inicia sesión en tu cuenta</p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* Botón de Google Login */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const response = await axios.post(
                  "http://localhost:8080/api/v1/auth/google",
                  {
                    idToken: credentialResponse.credential,
                  }
                );

                console.log(response.data);

                localStorage.setItem("token", response.data.token);
                // Si tu backend también devuelve el rol en la respuesta de Google, puedes guardarlo:
                if (response.data.rol) {
                  localStorage.setItem("rol", response.data.rol);
                }

                navigate("/dashboard");
              } catch (err) {
                console.error(err);
                setError("No fue posible iniciar sesión con Google");
              }
            }}
            onError={() => {
              setError("Error iniciando sesión con Google");
            }}
          />
        </div>

        {/* Separador */}
        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-slate-700"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-wider">
            o con correo
          </span>
          <div className="flex-grow border-t border-slate-700"></div>
        </div>

        {/* Formulario con campos cómodos para pantallas táctiles */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="tucorreo@enviosexpress.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50 shadow-lg active:scale-95 cursor-pointer"
          >
            <span>{loading ? 'Validando...' : 'Entrar al Sistema'}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Enlaces inferiores optimizados para toque */}
        <div className="mt-6 space-y-3 text-center">
          <div>
            <Link to="/register" className="text-sm text-blue-400 font-medium hover:underline transition-colors block py-1">
              ¿No tienes una cuenta? Regístrate aquí
            </Link>
          </div>
          <div>
            <Link to="/rastreo" className="text-sm text-slate-300 hover:text-white transition-colors block py-1">
              ¿Solo quieres rastrear una encomienda? Haz clic aquí
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
