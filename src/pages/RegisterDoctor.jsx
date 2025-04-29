import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterDoctor = () => {
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    gender: '',
    specialization: '',
    yearsOfExperience: '',
    clinicId: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${baseURL}/api/clinics`)
      .then(res => setClinics(res.data.content || res.data))
      .catch(err => console.error('Failed to fetch clinics', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post(`${baseURL}/api/auth/register-doctor`, form)
      .then(() => {
        setMessage('✅ Doctor registered successfully!');
        setForm({
          email: '',
          password: '',
          fullName: '',
          gender: '',
          specialization: '',
          yearsOfExperience: '',
          clinicId: ''
        });
      })
      .catch(err => {
        console.error(err);
        setMessage('❌ Registration failed');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 to-blue-700 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="text-blue-700 hover:text-blue-900 mb-4 text-sm flex items-center font-semibold"
        >
          ← Home
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
          Register as a Doctor
        </h2>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full border p-2 rounded" placeholder="Full Name" />
          <input name="email" value={form.email} onChange={handleChange} required type="email" className="w-full border p-2 rounded" placeholder="Email" />
          <input name="password" value={form.password} onChange={handleChange} required type="password" className="w-full border p-2 rounded" placeholder="Password" />

          <select name="gender" value={form.gender} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input name="specialization" value={form.specialization} onChange={handleChange} required className="w-full border p-2 rounded" placeholder="Specialization" />
          <input name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleChange} required type="number" min="0" className="w-full border p-2 rounded" placeholder="Years of Experience" />

          <select name="clinicId" value={form.clinicId} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Select Clinic</option>
            {clinics.map(clinic => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name} – {clinic.address}
              </option>
            ))}
          </select>

          <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 font-semibold transition-all duration-300">
            Register
          </button>
        </form>

        {/* Message */}
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}

        {/* Switch to Patient */}
        <p className="text-sm text-center mt-6 text-blue-800">
          Are you a patient?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterDoctor;
