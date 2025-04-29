"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { FaPlus, FaUserMd, FaPhone, FaBriefcase, FaVenusMars } from "react-icons/fa"
import { MdClose } from "react-icons/md"

const Doctor = () => {
  const [doctors, setDoctors] = useState([])
  const [name, setName] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [contact, setContact] = useState("")
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetching doctor data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token") // Get the token from localStorage

        // Check if token exists before making the request
        if (token) {
          const response = await axios.get("http://localhost:8080/api/doctors", {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure token is in the request headers
            },
          })
          setDoctors(response.data) // Update doctors state with the data from API
          setError(null)
        } else {
          console.log("No token found. Please log in.")
          setError("Authentication required. Please log in.")
        }
      } catch (error) {
        console.error("Error fetching doctors:", error)
        setError("Failed to load doctors. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctors()
  }, []) // Only run this once when the component is mounted

  const handleAddDoctor = async () => {
    try {
      const doctor = { name, specialization, contact }
      const token = localStorage.getItem("token") // Get token from localStorage
      console.log("Token being sent:", token) // Log the token to check if it's being fetched properly

      const response = await axios.post("http://localhost:8080/api/doctors", doctor, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is being sent correctly
        },
      })

      // Check the response and add the new doctor to the list
      if (response.data) {
        setDoctors((prevDoctors) => [...prevDoctors, response.data])
        setName("")
        setSpecialization("")
        setContact("")
        setIsAddDoctorOpen(false)
        alert("Doctor added successfully")
      }
    } catch (error) {
      console.error("Error adding doctor:", error)
      alert("Failed to add doctor")
    }
  }

  // Function to get random colors for doctor cards
  const getSpecializationColor = (specialization) => {
    const colors = {
      Cardiology: "bg-red-100 text-red-800",
      Neurology: "bg-purple-100 text-purple-800",
      Pediatrics: "bg-blue-100 text-blue-800",
      Orthopedics: "bg-green-100 text-green-800",
      Dermatology: "bg-yellow-100 text-yellow-800",
      Oncology: "bg-pink-100 text-pink-800",
      Psychiatry: "bg-indigo-100 text-indigo-800",
      Radiology: "bg-orange-100 text-orange-800",
      default: "bg-gray-100 text-gray-800",
    }

    // Return the color for the specialization or the default color
    return colors[specialization] || colors.default
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Doctors Directory</h2>
            <p className="text-gray-600">Manage and view all healthcare professionals</p>
          </div>

          <button
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={() => setIsAddDoctorOpen(true)}
          >
            <FaPlus className="mr-2" />
            Add Doctor
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Doctor List</h3>
            <div className="text-gray-500 text-sm">{doctors.length} doctors found</div>
          </div>

          {isLoading ? (
            // Loading state
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            // Error state
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : doctors.length > 0 ? (
            // Doctor cards grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                    <h4 className="text-xl font-medium">{doctor.name}</h4>
                    <div
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getSpecializationColor(
                        doctor.specialization,
                      )}`}
                    >
                      {doctor.specialization}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-gray-700 mb-2">
                      <FaPhone className="mr-2 text-blue-500" />
                      <span>{doctor.contact}</span>
                    </div>
                    {doctor.gender && (
                      <div className="flex items-center text-gray-700 mb-2">
                        <FaVenusMars className="mr-2 text-blue-500" />
                        <span>{doctor.gender}</span>
                      </div>
                    )}
                    {doctor.experience && (
                      <div className="flex items-center text-gray-700">
                        <FaBriefcase className="mr-2 text-blue-500" />
                        <span>{doctor.experience} years of experience</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <FaUserMd className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors available</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Get started by adding your first doctor to the directory.
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center mx-auto transition-all"
                onClick={() => setIsAddDoctorOpen(true)}
              >
                <FaPlus className="mr-2" />
                Add Doctor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Doctor Modal */}
      {isAddDoctorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setIsAddDoctorOpen(false)}
            >
              <MdClose size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <FaUserMd className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Add New Doctor</h3>
              <p className="text-gray-500 text-sm mt-1">Enter the details of the new healthcare professional</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddDoctor()
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Dr. John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  id="specialization"
                  type="text"
                  placeholder="Cardiology, Neurology, etc."
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  id="contact"
                  type="text"
                  placeholder="+1 (555) 123-4567"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsAddDoctorOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Doctor
