"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const BookingHistory = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelLoading, setCancelLoading] = useState(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(null)
  const [filter, setFilter] = useState("all")

  const baseURL = process.env.REACT_APP_BASE_URL
  const role = localStorage.getItem("role") // ✅ Move here
  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      let endpoint = "";
  
      try {
        if (role === "DOCTOR") {
          const doctorRes = await axios.get(`${baseURL}/api/doctors/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const doctorId = doctorRes.data.id; // ✅ define before use
          console.log("Fetched doctorId from userId:", doctorId); // ✅ now valid
          endpoint = `${baseURL}/api/appointments/doctor/${doctorId}`;
        }
         else {
          endpoint = `${baseURL}/api/appointments/patient/${userId}`;
        }
  
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = res.data.map((appt) => ({
          id: appt.id,
          doctorName: appt.doctorName ?? "",     // use null-coalescing fallback
          patientName: appt.patientName ?? "",
          specialization: appt.specialization,
          appointmentStart: appt.appointmentStart,
          appointmentEnd: appt.appointmentEnd,
          status: appt.status,
        }));
        


        setAppointments(data);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, [baseURL, role, userId, token]);
  
  
  

  const cancelAppointment = (id) => {
    const token = localStorage.getItem("token")
    setCancelLoading(id)

    axios
      .put(
        `${baseURL}/api/appointments/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        setAppointments((prev) => prev.map((appt) => (appt.id === id ? { ...appt, status: "CANCELLED" } : appt)))
        setShowCancelConfirm(null)
      })
      .catch((err) => {
        console.error("Cancel error:", err)
        alert("Failed to cancel appointment")
      })
      .finally(() => setCancelLoading(null))
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500"
      case "CANCELLED":
        return "bg-red-500"
      case "COMPLETED":
        return "bg-blue-500"
      case "PENDING":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const isUpcoming = (date) => {
    return new Date(date) > new Date()
  }

  const isPast = (date) => {
    return new Date(date) < new Date() && !isToday(date)
  }

  const isToday = (date) => {
    const today = new Date()
    const appointmentDate = new Date(date)
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    )
  }

  const filteredAppointments = appointments.filter((appt) => {
    if (filter === "all") return true
    if (filter === "upcoming") return isUpcoming(appt.appointmentStart) && appt.status !== "CANCELLED"
    if (filter === "past") return isPast(appt.appointmentStart) || appt.status === "COMPLETED"
    if (filter === "cancelled") return appt.status === "CANCELLED"
    if (filter === "today") return isToday(appt.appointmentStart) && appt.status !== "CANCELLED"
    return true
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Cancel Appointment</h2>
            <p className="text-gray-600 mb-4">
            Are you sure you want to cancel your appointment with {role === "DOCTOR" ? showCancelConfirm.patientName : `Dr. ${showCancelConfirm.doctorName}`}

              {formatDate(showCancelConfirm.appointmentStart)}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCancelConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => cancelAppointment(showCancelConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={cancelLoading === showCancelConfirm.id}
              >
                {cancelLoading === showCancelConfirm.id && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                Yes, Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              My Appointments
            </h1>
            <p className="text-gray-600 mt-1">View and manage your appointment history</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("today")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "today"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "upcoming"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "past"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "cancelled"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading your appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No appointments yet</h2>
            <p className="text-gray-500">
              You haven't booked any appointments yet. When you do, they will appear here.
            </p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No {filter} appointments</h2>
            <p className="text-gray-500">
              {filter === "upcoming"
                ? "You don't have any upcoming appointments."
                : filter === "past"
                  ? "You don't have any past appointments."
                  : filter === "cancelled"
                    ? "You don't have any cancelled appointments."
                    : filter === "today"
                      ? "You don't have any appointments scheduled for today."
                      : "No appointments match your current filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all ${
                  appt.status === "CONFIRMED" && isToday(appt.appointmentStart)
                    ? "border-l-4 border-green-500"
                    : appt.status === "CANCELLED"
                      ? "border-l-4 border-red-500"
                      : ""
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <h3 className="font-semibold text-lg text-gray-800">
  {role === "DOCTOR" ? appt.patientName : `Dr. ${appt.doctorName}`}
</h3>

                      </div>
                      <p className="text-gray-600 flex items-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        {appt.specialization}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mt-2">
                        <div className="flex items-center mb-1 sm:mb-0 sm:mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{formatDate(appt.appointmentStart)}</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {formatTime(appt.appointmentStart)} - {formatTime(appt.appointmentEnd)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium mb-3 ${getStatusBadgeClass(
                          appt.status,
                        )}`}
                      >
                        {appt.status}
                      </span>
                      {appt.status === "CONFIRMED" && (
                        <button
                          onClick={() => setShowCancelConfirm(appt)}
                          className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingHistory
