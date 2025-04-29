"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft } from "react-feather"

function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("⚠ Passwords do not match.")
      return
    }

    setLoading(true)
    setError("")

    // ✅ Log to verify value is picked up
  console.log("🌐 API URL from env:", import.meta.env.VITE_API_BASE_URL);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {

        fullName,
        email,
        password,
        role: "PATIENT"
      })

      navigate("/login")
    } catch (err) {
      setError("⚠ Registration failed. Try again.")
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 to-blue-700 relative px-4">
      {/* Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      </div>

      {/* Registration Box */}
      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-sm bg-opacity-95 border border-white border-opacity-20">
        <button onClick={() => navigate("/")} className="absolute top-4 left-4 text-blue-700 hover:text-blue-900 flex items-center gap-1 text-sm font-medium">
          <ArrowLeft size={16} /> <span>Home</span>
        </button>

        <h2 className="text-3xl font-bold text-blue-800 text-center mb-2">Create Patient Account</h2>
        <p className="text-blue-600 text-center mb-6 text-sm">Join our healthcare platform</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-blue-800 font-medium text-sm">Full Name</label>
            <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div>
            <label className="text-blue-800 font-medium text-sm">Email</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="text-blue-800 font-medium text-sm">Password</label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div>
            <label className="text-blue-800 font-medium text-sm">Confirm Password</label>
            <input type="password" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <button type="submit" className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-blue-800 mt-6 text-center">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer">
            Log In
          </span>
        </p>

        <p className="text-sm text-blue-800 mt-2 text-center">
          Are you a doctor?{" "}
          <span onClick={() => navigate("/register-doctor")} className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer">
            Register here
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register
