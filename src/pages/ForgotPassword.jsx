import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const baseURL = process.env.REACT_APP_API_BASE_URL;


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/api/auth/forgot-password`, { email });
      setMessage("Code sent! Check your email.");
    } catch (error) {
      setMessage("Failed to send reset code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
        <input
          type="email"
          className="w-full border p-2 mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full rounded">
          Send Code
        </button>
        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
