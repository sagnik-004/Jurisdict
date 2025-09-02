import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Home, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const DetaineeSigninSignup = () => {
  const [isSignin, setIsSignin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    username: "",
    password: "",
    usernameOrEmail: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignin(!isSignin);
    setError(null);
    setMessage(null);
    setFormData({
      name: "",
      address: "",
      email: "",
      username: "",
      password: "",
      usernameOrEmail: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!isSignin) {
        const response = await axiosInstance.post(
          "/detainee/signup",
          {
            name: formData.name,
            address: formData.address,
            email: formData.email,
            username: formData.username,
            password: formData.password,
          },
          { withCredentials: true }
        );

        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        
        setMessage("Sign-up successful! Redirecting...");
        setTimeout(() => {
          navigate(`/d/${response.data.user.username}`);
        }, 1500);
      } else {
        const response = await axiosInstance.post(
          "/detainee/login",
          {
            emailOrUsername: formData.usernameOrEmail,
            password: formData.password,
          },
          { withCredentials: true }
        );

        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate(`/d/${response.data.user.username}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex justify-center items-center min-h-screen p-5 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 to-slate-800"
          : "bg-gradient-to-br from-slate-50 to-slate-200"
      }`}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`w-full max-w-md p-10 rounded-3xl backdrop-blur-xl text-center border ${
          darkMode
            ? "bg-slate-900/50 shadow-2xl border-white/10"
            : "bg-white/50 shadow-xl border-black/10"
        }`}
      >
        <div className="flex justify-center items-center mb-5 relative">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`text-2xl font-bold flex-1 ${
              darkMode ? "text-slate-100" : "text-slate-900"
            }`}
          >
            {isSignin ? "Login" : "Sign up"}
          </motion.h2>
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute right-0 p-2 rounded-lg hover:bg-opacity-20 transition-colors ${
              darkMode
                ? "text-slate-100 hover:bg-white"
                : "text-slate-900 hover:bg-black"
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`mb-5 text-sm ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {isSignin ? "Login to continue" : "Create an account to continue"}
        </motion.p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-3 rounded-lg mb-5 text-sm text-red-700 ${
              darkMode ? "bg-red-100/20" : "bg-red-50"
            }`}
          >
            {error}
          </motion.div>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-3 rounded-lg mb-5 text-sm text-green-700 ${
              darkMode ? "bg-green-100/20" : "bg-green-50"
            }`}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {!isSignin ? (
              <>
                <div className="relative mb-4">
                  <User
                    size={16}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Full Name"
                    required
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg text-sm border transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none ${
                      darkMode
                        ? "bg-transparent border-white/10 text-slate-100 placeholder-slate-400"
                        : "bg-transparent border-black/10 text-slate-900 placeholder-slate-500"
                    }`}
                  />
                </div>
                <div className="relative mb-4">
                  <Home
                    size={16}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    placeholder="Address"
                    required
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg text-sm border transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none ${
                      darkMode
                        ? "bg-transparent border-white/10 text-slate-100 placeholder-slate-400"
                        : "bg-transparent border-black/10 text-slate-900 placeholder-slate-500"
                    }`}
                  />
                </div>
                <div className="relative mb-4">
                  <Mail
                    size={16}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    required
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg text-sm border transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none ${
                      darkMode
                        ? "bg-transparent border-white/10 text-slate-100 placeholder-slate-400"
                        : "bg-transparent border-black/10 text-slate-900 placeholder-slate-500"
                    }`}
                  />
                </div>
                <div className="relative mb-4">
                  <User
                    size={16}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    placeholder="Username"
                    required
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg text-sm border transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none ${
                      darkMode
                        ? "bg-transparent border-white/10 text-slate-100 placeholder-slate-400"
                        : "bg-transparent border-black/10 text-slate-900 placeholder-slate-500"
                    }`}
                  />
                </div>
              </>
            ) : (
              <div className="relative mb-4">
                <Mail
                  size={16}
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                />
                <input
                  type="text"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  placeholder="Username or Email"
                  required
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 rounded-lg text-sm border transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none ${
                    darkMode
                      ? "bg-transparent border-white/10 text-slate-100 placeholder-slate-400"
                      : "bg-transparent border-black/10 text-slate-900 placeholder-slate-500"
                  }`}
                />
              </div>
            )}

            <div className="relative mb-4">
              <Lock
                size={16}
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Password"
                required
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-3 rounded-lg text-sm border transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none ${
                  darkMode
                    ? "bg-transparent border-white/10 text-slate-100 placeholder-slate-400"
                    : "bg-transparent border-black/10 text-slate-900 placeholder-slate-500"
                }`}
              />
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? "Processing..." : isSignin ? "Login" : "Sign up"}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className={`mt-5 text-sm ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          <p>
            {isSignin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={toggleForm}
              className={`font-semibold underline cursor-pointer hover:opacity-80 transition-opacity ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              {isSignin ? "Sign up" : "Login"}
            </span>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DetaineeSigninSignup;