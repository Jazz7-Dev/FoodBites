import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ setToken }) {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, form);
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

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 -top-20 text-[20rem] font-bold text-emerald-50 opacity-30 rotate-12">
          FoodBites
        </div>
        <div className="absolute -right-20 -bottom-20 text-[20rem] font-bold text-emerald-50 opacity-30 -rotate-12">
          FoodBites
        </div>
      </div>

      <ToastContainer position="bottom-right" theme="light" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-emerald-100 relative z-10">
        <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 px-10 py-8 text-center">
          <h2 className="text-3xl font-bold text-emerald-800">Welcome Back</h2>
          <p className="text-emerald-600">Sign in to your FoodBites account</p>
        </div>

        <div className="px-8 py-8">
          {error && (
            <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-red-600 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-emerald-700 mb-2"
                >
                  Username or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    placeholder="Enter your username or email"
                    value={form.identifier}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-emerald-300 text-emerald-700 disabled:bg-emerald-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-emerald-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-emerald-300 text-emerald-700 disabled:bg-emerald-50 disabled:cursor-not-allowed pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-emerald-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zM10 15a5 5 0 110-10 5 5 0 010 10z" />
                        <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
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
            </button>
          </form>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center space-x-3 px-6 py-3 border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 7.053 29.268 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#e53935"
                  d="M6.306 14.691l6.571 4.819C14.655 16.108 18.992 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 7.053 29.268 5 24 5 16.318 5 9.656 9.86 6.306 14.691z"
                />
                <path
                  fill="#4caf50"
                  d="M24 43c5.421 0 10.287-2.184 13.824-5.732l-6.57-5.429C29.91 33.91 27.11 35 24 35c-5.202 0-9.63-3.522-11.303-8.5H6.306C8.954 37.14 15.318 43 24 43z"
                />
                <path
                  fill="#1565c0"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.025 2.893-3.14 5.243-5.842 6.627l6.57 5.429C38.29 34.91 42 30.523 42 25c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
              <span className="text-emerald-700 font-semibold">Sign in with Google</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-200">
            <p className="text-center text-sm text-emerald-600">
              New to FoodBites?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors duration-300"
              >
                Create account
              </Link>
              <br/>
              
            </p>
                <h1 className="text-center text-sm text-emerald-600">Crafted by Devansh</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
