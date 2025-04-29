import React from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaUserMd,
  FaHistory,
  FaCity,
  } from "react-icons/fa";

function Dashboard() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Welcome to AMSHC, {role}!
          </h1>
          <p className="text-gray-700">
            Role: <strong>{role}</strong> | ID: <strong>{userId}</strong>
          </p>
        </div>

        {/* Quick Stats (Example placeholders — replace with real data via API later) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
            <FaCalendarCheck className="text-2xl mx-auto text-blue-700" />
            <p className="mt-2 font-semibold text-gray-800">12 Appointments</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow text-center">
            <FaCalendarCheck className="text-2xl mx-auto text-green-700" />
            <p className="mt-2 font-semibold text-gray-800">3 Upcoming</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow text-center">
            <FaHistory className="text-2xl mx-auto text-red-700" />
            <p className="mt-2 font-semibold text-gray-800">5 Past</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
            <FaUserMd className="text-2xl mx-auto text-blue-700" />
            <p className="mt-2 font-semibold text-gray-800">15 Doctors</p>
          </div>
        </div>

        {/* Role-Based Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ADMIN Actions */}
          {role === "ADMIN" && (
            <>
              <Link
                to="/doctor"
                className="bg-green-600 text-white p-5 rounded-lg shadow-lg flex flex-col items-center hover:bg-green-700 transition"
              >
                <FaUserMd size={30} />
                <span className="mt-2 font-semibold">Manage Doctors</span>
              </Link>
              <Link
                to="/hospital-city-creator"
                className="bg-blue-700 text-white p-5 rounded-lg shadow-lg flex flex-col items-center hover:bg-blue-800 transition"
              >
                <FaCity size={30} />
                <span className="mt-2 font-semibold">Manage Clinics & Cities</span>
              </Link>
            </>
          )}

          {/* PATIENT Actions */}
          {role === "PATIENT" && (
            <>
              <Link
                to="/booking"
                className="bg-blue-700 text-white p-5 rounded-lg shadow-lg flex flex-col items-center hover:bg-blue-800 transition"
              >
                <FaCalendarCheck size={30} />
                <span className="mt-2 font-semibold">Book Appointment</span>
              </Link>
              <Link
                to="/booking-history"
                className="bg-purple-700 text-white p-5 rounded-lg shadow-lg flex flex-col items-center hover:bg-purple-800 transition"
              >
                <FaHistory size={30} />
                <span className="mt-2 font-semibold">Booking History</span>
              </Link>
            </>
          )}

          {/* SHARED Action */}
          <Link
            to="/doctor"
            className="bg-green-600 text-white p-5 rounded-lg shadow-lg flex flex-col items-center hover:bg-green-700 transition"
          >
            <FaUserMd size={30} />
            <span className="mt-2 font-semibold">View Doctors</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
