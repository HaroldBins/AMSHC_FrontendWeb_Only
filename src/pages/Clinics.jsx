"use client"

import { useState, useEffect } from "react"

function Clinics() {
  const [clinics, setClinics] = useState([])
  const [clinicName, setClinicName] = useState("")
  const [clinicAddress, setClinicAddress] = useState("")
  const [editingClinic, setEditingClinic] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("list")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })

  const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/clinics`
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("role")


  const fetchClinics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${apiUrl}?page=0&size=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setClinics(data.content || [])
    } catch (err) {
      console.error("❌ Failed to fetch clinics:", err)
      showToast("Error fetching clinics", "error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClinics()
  }, [])

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
  }

  const handleCreateOrUpdateClinic = async () => {
    if (!clinicName.trim() || !clinicAddress.trim()) {
      showToast("Please provide both clinic name and address.", "error")
      return
    }

    setIsLoading(true)
    const method = editingClinic ? "PUT" : "POST"
    const url = editingClinic ? `${apiUrl}/update/${editingClinic.id}` : `${apiUrl}/add`

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: clinicName,
          address: clinicAddress,
        }),
      })

      if (response.ok) {
        showToast(
          editingClinic ? `${clinicName} has been successfully updated.` : `${clinicName} has been successfully added.`,
        )
        setClinicName("")
        setClinicAddress("")
        setEditingClinic(null)
        setIsFormOpen(false)
        fetchClinics()
      } else {
        showToast("Operation failed. Make sure you're logged in as ADMIN.", "error")
      }
    } catch (err) {
      console.error("❌ Error:", err)
      showToast("An error occurred while processing your request.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClinic = (clinic) => {
    setClinicName(clinic.name)
    setClinicAddress(clinic.address)
    setEditingClinic(clinic)
    setIsFormOpen(true)
  }

  const handleDeleteClinic = async (id, name) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        showToast(`${name} has been successfully removed.`)
        fetchClinics()
      } else {
        showToast("Delete failed. You may not have permission to perform this action.", "error")
      }
    } catch (err) {
      console.error("❌ Delete error:", err)
      showToast("Failed to delete the clinic. Please try again.", "error")
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(null)
    }
  }

  const resetForm = () => {
    setClinicName("")
    setClinicAddress("")
    setEditingClinic(null)
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-blue-50 min-h-screen">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clinic Management</h1>
          <p className="text-gray-600 mt-1">Add, edit, and manage your healthcare clinics</p>
        </div>
        {userRole === "ADMIN" && (
  <button
    className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
    onClick={() => {
      resetForm()
      setIsFormOpen(true)
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mr-2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    Add New Clinic
  </button>
)}

      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editingClinic ? "Edit Clinic" : "Add New Clinic"}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              {editingClinic
                ? "Update the clinic information below."
                : "Fill in the details to add a new clinic to your system."}
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Clinic Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter clinic name"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Clinic Address
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Enter clinic address"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdateClinic}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isLoading && (
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
                {editingClinic ? "Update Clinic" : "Create Clinic"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">Are you sure?</h2>
            <p className="text-gray-600 mb-4">
              This will permanently delete {showDeleteConfirm.name}. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteClinic(showDeleteConfirm.id, showDeleteConfirm.name)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("list")}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "list"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTab("grid")}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "grid"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Grid View
            </button>
          </nav>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && clinics.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
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
        </div>
      )}

      {/* Empty State */}
      {!isLoading && clinics.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-gray-500">No clinics found. Add your first clinic to get started.</p>
          </div>
        </div>
      )}

      {/* List View */}
      {activeTab === "list" && clinics.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clinics.map((clinic) => (
                <tr key={clinic.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{clinic.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500">{clinic.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  {userRole === "ADMIN" && (
    <>
      <button onClick={() => handleEditClinic(clinic)} className="text-blue-600 hover:text-blue-900 mr-3">
        Edit
      </button>
      <button onClick={() => setShowDeleteConfirm(clinic)} className="text-red-600 hover:text-red-900">
        Delete
      </button>
    </>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {activeTab === "grid" && clinics.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => (
            <div key={clinic.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{clinic.name}</h3>
                <div className="flex items-start text-gray-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1.5 text-gray-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{clinic.address}</span>
                </div>
                {userRole === "ADMIN" && (
  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
    <button
      onClick={() => handleEditClinic(clinic)}
      className="px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 flex items-center"
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
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
      Edit
    </button>
    <button
      onClick={() => setShowDeleteConfirm(clinic)}
      className="px-3 py-1.5 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50 flex items-center"
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
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      Delete
    </button>
  </div>
)}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Clinics
