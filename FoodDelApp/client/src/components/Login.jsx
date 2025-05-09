import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ setToken }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Heavenly Background Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 -top-20 text-[20rem] font-bold text-emerald-50 opacity-30 rotate-12">
          FoodBites
        </div>
        <div className="absolute -right-20 -bottom-20 text-[20rem] font-bold text-emerald-50 opacity-30 -rotate-12">
          FoodBites
        </div>
      </div>

      <ToastContainer position="bottom-right" theme="light" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-emerald-100 relative z-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 px-10 py-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-emerald-800"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-emerald-600"
          >
            Sign in to your FoodBites account
          </motion.p>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center space-x-3"
            >
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span className="text-red-600 font-medium">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-emerald-700 mb-2">
                  Username
                </label>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="relative"
                >
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-emerald-300 text-emerald-700 disabled:bg-emerald-50 disabled:cursor-not-allowed"
                  />
                </motion.div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-emerald-700 mb-2">
                  Password
                </label>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="relative"
                >
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-emerald-300 text-emerald-700 disabled:bg-emerald-50 disabled:cursor-not-allowed"
                  />
                </motion.div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all relative overflow-hidden disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-emerald-100"
          >
            <p className="text-center text-sm text-emerald-600">
              New to FoodBites?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors duration-300"
              >
                Create account
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}