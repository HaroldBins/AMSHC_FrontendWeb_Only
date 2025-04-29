"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Mail, Lock } from "react-feather"

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post("https://amshc-backend.onrender.com/api/auth/login", {
        email,
        password,
      });
  
      if (response.data.token) {
        // ✅ Store session and profile info
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("fullName", response.data.fullName || ""); // fallback if missing
        localStorage.setItem("avatarUrl", response.data.avatarUrl || ""); // fallback if missing
  
        console.log("✅ Login successful. User ID:", response.data.userId);
        navigate("/dashboard");
      } else {
        setError("❌ Invalid response from server.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("❌ Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 to-blue-700 relative px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      </div>

      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm backdrop-blur-sm bg-opacity-95 border border-white border-opacity-20">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-blue-700 hover:text-blue-900 transition-colors duration-200 flex items-center gap-1 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>

        <h2 className="text-3xl font-bold text-blue-800 text-center mb-2">Welcome Back</h2>
        <p className="text-blue-600 text-center mb-6 text-sm">Sign in to your account</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded-md flex items-start">
            <span className="text-red-500 font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-blue-800 font-medium mb-1 text-sm">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-blue-800 font-medium mb-1 text-sm">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="text-right mt-2">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors duration-200 font-medium"
              >
                Forgot Password?
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 mt-6"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging In...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="relative py-3 flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <p className="text-sm text-blue-800 text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer transition-colors duration-200"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  )

  
}

export default Login
