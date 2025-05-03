import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, Check, MapPin } from "react-feather";

function Booking() {
  const [addressSearch, setAddressSearch] = useState("");
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  


  const api = process.env.REACT_APP_BASE_URL;
  const patientId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${api}/api/clinics?page=0&size=50`)
      .then(res => res.json())
      .then(data => setClinics(data.content || []));
  }, []);

  useEffect(() => {
    if (addressSearch.trim() === "") {
      setFilteredClinics([]);
    } else {
      const matches = clinics.filter(clinic =>
        clinic.address.toLowerCase().includes(addressSearch.toLowerCase())
      );
      setFilteredClinics(matches);
    }
  }, [addressSearch, clinics]);

  useEffect(() => {
    if (selectedClinicId) {
      fetch(`${api}/api/doctors/clinic/${selectedClinicId}`)
        .then(res => res.json())
        .then(data => setDoctors(data || []));
    } else {
      setDoctors([]);
    }
  }, [selectedClinicId]);

  const handleBookAppointment = async () => {
    if (!selectedDoctorId || !appointmentTime || !patientName) {
      alert("❗ Please fill in all fields before booking.");
      return;
    }

    const appointmentStart = new Date(appointmentTime);
    const appointmentEnd = new Date(appointmentStart.getTime() + 30 * 60 * 1000); // +30 mins

    const payload = {
      patientId: patientId,
      doctorId: selectedDoctorId,
      appointmentStart,
      appointmentEnd,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(`${api}/api/appointments/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
        alert("✅ Appointment booked!");
        setTimeout(() => setSuccess(false), 3000);
      } else if (response.status === 403) {
        alert("❌ Unauthorized to book. Please login as a patient.");
      } else {
        alert("❌ Failed to book appointment.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-blue-100">
          <h2 className="text-3xl font-bold text-blue-800 flex items-center">
            <Calendar className="mr-3 text-blue-600" size={28} />
            Book Your Appointment
          </h2>
          <p className="text-gray-600 mt-2">Find your clinic and doctor to book a visit</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-blue-500" />
              <input
                type="text"
                placeholder="Enter address"
                value={addressSearch}
                onChange={(e) => setAddressSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filteredClinics.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Choose Clinic</label>
              <select
                className="w-full border p-3 rounded-lg"
                onChange={(e) => setSelectedClinicId(e.target.value)}
                value={selectedClinicId}
              >
                <option value="">Select clinic</option>
                {filteredClinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name} – {clinic.address}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedClinicId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Choose Doctor</label>
              <select
                className="w-full border p-3 rounded-lg"
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                value={selectedDoctorId}
              >
                <option value="">Select doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} – {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date & Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-blue-500" />
              <input
                type="datetime-local"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-blue-500" />
              <input
                type="text"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleBookAppointment}
            disabled={isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-md ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
                Booking...
              </div>
            ) : success ? (
              <>
                <Check className="mr-2" size={20} />
                Appointment Booked!
              </>
            ) : (
              "Book Appointment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Booking;
