import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Lock, Mail, User, Package } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/v1/auth/register", {
        nombre,
        email,
        password,
        rol: "CLIENTE",
      });

      alert("¡Registro exitoso! Por favor inicia sesión con tu correo.");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        "Error al registrar la cuenta. Es posible que el correo ya esté en uso.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh w-full bg-slate-900 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-5 sm:p-8 border border-slate-700 my-auto box-border">
        {/* Encabezado */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600/20 text-blue-400 mb-2 sm:mb-3">
            <Package className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Crear Cuenta
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Regístrate en Envíos Express
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const response = await axios.post(
                "http://localhost:8080/api/v1/auth/google",
                {
                  idToken: credentialResponse.credential,
                },
              );

              console.log(response.data);

              localStorage.setItem("token", response.data.token);

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
        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-slate-700"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-wider">
            o con correo
          </span>
          <div className="flex-grow border-t border-slate-700"></div>
        </div>

        {/* Formulario Tradicional */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Nombre Completo
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="tucorreo@enviosexpress.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center text-sm sm:text-base disabled:opacity-50 shadow-lg active:scale-95 cursor-pointer"
          >
            <span>{loading ? "Registrando..." : "Crear Cuenta"}</span>
          </button>
        </form>

        {/* Enlace para volver al Login */}
        <div className="mt-5 text-center">
          <Link
            to="/"
            className="text-xs sm:text-sm text-blue-400 font-medium hover:underline transition-colors block py-1"
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
