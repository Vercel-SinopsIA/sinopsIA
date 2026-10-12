import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { createUser } from "../helpers/UserHelper";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaSpinner,
  FaUser,
} from "react-icons/fa";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState({
    email: true,
    phone: true
  });
  const roles = ["ROLE_USER"];
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    const isValid = emailRegex.test(email);
    setValidations(prev => ({ ...prev, email: isValid }));
    return isValid;
  };

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^(?:\+?\d{1,3})?[\s\-]?\(?\d{2,3}\)?[\s\-]?\d{3}[\s\-]?\d{3}$/;
    const isValid = phoneRegex.test(phoneNumber);
    setValidations(prev => ({ ...prev, phone: isValid }));
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (validateEmail(email) && validatePhone(phone)) {
      const userData = {
        name,
        email,
        address,
        phone,
        password,
        roles,
      };

      try {
       // const result = await createUser(userData);
       // toast.success(result.message);
       // setTimeout(() => {
       //   navigate("/login");
       // }, 4000);
      } catch (error) {
        toast.error(error.message || "Error al crear el usuario");
      }
    } else {
      toast.error(
        "Por favor, verifica el formato del correo electrónico y el número de teléfono."
      );
    }
    setLoading(false);
  };

  const bgMain = "bg-[#F5EFEB] text-white";
  const formBg = "bg-[#2F4156]";
  const inputBg = "bg-gray-800 text-white placeholder-gray-400";
  const btnBg = "bg-red-500 hover:bg-red-600";
  const btnFocusRing = "focus:ring-2 focus:ring-red-500";
  const inputIconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";
  const validationClass = (field) => 
    validations[field] === false ? "border-2 border-red-500" : "";

  return (
    <div
      className={`${bgMain} min-h-screen p-5 flex items-center justify-center transition-all duration-300`}
    >
      <div
        className={`w-11/12 max-w-md mx-auto ${formBg} p-8 rounded-lg shadow-xl transform transition-all duration-300 hover:shadow-2xl`}
      >
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-3xl" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-8">
          Crear cuenta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div className="relative">
            <label htmlFor="name" className="block text-lg font-medium mb-2">
              Nombre completo:
            </label>
            <div className="relative">
              <FaUser className={inputIconClass} />
              <input
                id="name"
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-3 pl-10 rounded-lg ${inputBg} focus:outline-none ${btnFocusRing} transition-all duration-300`}
                placeholder="Escribe tu nombre completo"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              Email:
            </label>
            <div className="relative">
              <FaEnvelope className={inputIconClass} />
              <input
                id="email"
                type="email"
                value={email}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                className={`w-full p-3 pl-10 rounded-lg ${inputBg} focus:outline-none ${btnFocusRing} transition-all duration-300 ${validationClass('email')}`}
                placeholder="Escribe tu email"
              />
            </div>
            {!validations.email && (
              <p className="text-red-500 text-sm mt-1">Por favor, ingresa un email válido</p>
            )}
          </div>

          {/* Dirección */}
          <div className="relative">
            <label htmlFor="address" className="block text-lg font-medium mb-2">
              Dirección:
            </label>
            <div className="relative">
              <FaMapMarkerAlt className={inputIconClass} />
              <input
                id="address"
                type="text"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full p-3 pl-10 rounded-lg ${inputBg} focus:outline-none ${btnFocusRing} transition-all duration-300`}
                placeholder="Escribe tu dirección"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="relative">
            <label htmlFor="phone" className="block text-lg font-medium mb-2">
              Teléfono:
            </label>
            <div className="relative">
              <FaPhone className={inputIconClass} />
              <input
                id="phone"
                type="text"
                value={phone}
                required
                onChange={(e) => {
                  setPhone(e.target.value);
                  validatePhone(e.target.value);
                }}
                className={`w-full p-3 pl-10 rounded-lg ${inputBg} focus:outline-none ${btnFocusRing} transition-all duration-300 ${validationClass('phone')}`}
                placeholder="Escribe tu teléfono"
              />
            </div>
            {!validations.phone && (
              <p className="text-red-500 text-sm mt-1">Por favor, ingresa un número de teléfono válido</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="relative">
            <label htmlFor="password" className="block text-lg font-medium mb-2">
              Contraseña:
            </label>
            <div className="relative">
              <FaLock className={inputIconClass} />
              <input
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 pl-10 rounded-lg ${inputBg} focus:outline-none ${btnFocusRing} transition-all duration-300`}
                placeholder="Crea tu contraseña"
              />
            </div>
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none ${btnBg} ${btnFocusRing} ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Procesando...
              </span>
            ) : (
              "Crear cuenta"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;