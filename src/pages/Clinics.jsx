import React, { useState, useEffect } from 'react';

function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [editingClinic, setEditingClinic] = useState(null);

  const apiUrl = 'http://localhost:8080/api/clinics';
  const token = localStorage.getItem("token");

  const fetchClinics = async () => {
    try {
      const response = await fetch(`${apiUrl}?page=0&size=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setClinics(data.content || []);
    } catch (err) {
      console.error("❌ Failed to fetch clinics:", err);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleCreateOrUpdateClinic = async () => {
    const method = editingClinic ? 'PUT' : 'POST';
    const url = editingClinic ? `${apiUrl}/update/${editingClinic.id}` : `${apiUrl}/add`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: clinicName,
          address: clinicAddress,
        }),
      });

      if (response.ok) {
        alert(editingClinic ? '✅ Clinic updated!' : '✅ Clinic created!');
        setClinicName("");
        setClinicAddress("");
        setEditingClinic(null);
        fetchClinics();
      } else {
        alert("❌ Operation failed. Make sure you're logged in as ADMIN.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ Failed to send request.");
    }
  };

  const handleEditClinic = (clinic) => {
    setClinicName(clinic.name);
    setClinicAddress(clinic.address);
    setEditingClinic(clinic);
  };

  const handleDeleteClinic = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this clinic?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("🗑️ Clinic deleted!");
        fetchClinics();
      } else {
        alert("❌ Delete failed. Are you an admin?");
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("❌ Error occurred while deleting.");
    }
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6">Manage Clinics</h2>

      <div className="mb-6">
        <label className="block mb-2 text-lg">Clinic Name</label>
        <input
          type="text"
          placeholder="Enter clinic name"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block mb-2 text-lg">Clinic Address</label>
        <input
          type="text"
          placeholder="Enter clinic address"
          value={clinicAddress}
          onChange={(e) => setClinicAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleCreateOrUpdateClinic}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {editingClinic ? "Update Clinic" : "Create Clinic"}
        </button>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Clinic List</h3>
        {clinics.map(clinic => (
          <div
            key={clinic.id}
            className="bg-white p-4 rounded shadow mb-3 flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-lg">{clinic.name}</p>
              <p className="text-sm text-gray-600">{clinic.address}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClinic(clinic)}
                className="bg-yellow-400 text-white py-1 px-3 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClinic(clinic.id)}
                className="bg-red-500 text-white py-1 px-3 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clinics;
