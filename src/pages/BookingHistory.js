// src/pages/BookingHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const BookingHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const baseURL = process.env.REACT_APP_API_BASE_URL;


  useEffect(() => {
    const patientId = localStorage.getItem("userId"); // 🧠 dynamic patient ID
    const token = localStorage.getItem("token");

    axios.get(`${baseURL}/api/appointments/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setAppointments(res.data))
    .catch(err => console.error("Error loading history:", err));
  }, []);

  const cancelAppointment = (id) => {
    const token = localStorage.getItem("token");

    axios.put(`${baseURL}/api/appointments/cancel/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      alert("Appointment cancelled");
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === id ? { ...appt, status: "CANCELLED" } : appt
        )
      );
    })
    .catch(err => {
      console.error("Cancel error:", err);
      alert("Failed to cancel appointment");
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">My Booking History</h1>
      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments yet.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt.id} className="bg-white rounded-xl shadow p-4">
              <p><strong>Doctor:</strong> {appt.doctorName}</p>
              <p><strong>Specialization:</strong> {appt.specialization}</p>
              <p>
  <strong>Date:</strong>{" "}
  {new Date(appt.appointmentStart).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}
</p>

<p>
  <strong>Ends:</strong>{" "}
  {new Date(appt.appointmentEnd).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
</p>


              <p>
  <strong>Status:</strong>{" "}
  <span
    className={`inline-block px-2 py-1 rounded text-white text-sm ${
      appt.status === "CONFIRMED" ? "bg-green-500" : "bg-gray-500"
    }`}
  >
    {appt.status}
  </span>
</p>

              {appt.status === "CONFIRMED" && (
                <button
                  onClick={() => cancelAppointment(appt.id)}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingHistory;
