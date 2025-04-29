import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    axios.get('https://amshc-backend.onrender.com/api/clinics')
      .then(res => setClinics(res.data.content || res.data))
      .catch(err => console.error('Failed to fetch clinics', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('https://amshc-backend.onrender.com/api/auth/register-doctor', form)
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
    <div className="max-w-xl mx-auto bg-white p-6 mt-10 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Register Doctor</h2>
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

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
    </div>
  );
};

export default RegisterDoctor;
