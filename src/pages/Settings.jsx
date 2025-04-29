import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const userId = localStorage.getItem("userId"); // ✅ Define the variable
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    // Fetch profile details
    axios.get(`http://localhost:8080/api/auth/profile/${userId}`)
      .then(res => {
        setForm(prev => ({
          ...prev,
          fullName: localStorage.getItem("fullName") || "",
          email: localStorage.getItem("email") || ""
        }));
        
      });
  }, [userId]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    try {
      await axios.put("http://localhost:8080/api/auth/update-profile", {
        userId,
        fullName: form.fullName,
        email: form.email,
      });
  
      // ✅ Step 3: Update localStorage with new values
      localStorage.setItem("fullName", form.fullName);
      localStorage.setItem("email", form.email);
  
      alert("✅ Profile updated!");
    } catch (err) {
      alert("❌ Failed to update profile.");
    }
  };
  

  const handleChangePassword = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/change-password", {
        userId,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      alert("✅ Password changed!");
    } catch (err) {
      alert("❌ Password change failed.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/auth/delete-account/${userId}`, {
        data: {
          email: form.email,
          password: form.currentPassword,
        },
      });
      alert("❌ Account deleted.");
    } catch (err) {
      alert("❌ Failed to delete account.");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setAvatarPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.put(`http://localhost:8080/api/auth/upload-avatar/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Avatar updated!");
    } catch (err) {
      alert("❌ Avatar upload failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Settings</h2>

      <label className="block mb-2">Full Name</label>
      <input
        className="w-full border p-2 rounded mb-4"
        name="fullName"
        value={form.fullName}
        onChange={handleInputChange}
      />

      <label className="block mb-2">Email</label>
      <input
        className="w-full border p-2 rounded mb-4"
        name="email"
        value={form.email}
        onChange={handleInputChange}
      />

      <button onClick={handleProfileUpdate} className="bg-blue-600 text-white px-4 py-2 rounded mb-6 w-full">
        Update Profile
      </button>

      <label className="block mb-2">Current Password</label>
      <input
        className="w-full border p-2 rounded mb-4"
        name="currentPassword"
        type="password"
        value={form.currentPassword}
        onChange={handleInputChange}
      />

      <label className="block mb-2">New Password</label>
      <input
        className="w-full border p-2 rounded mb-4"
        name="newPassword"
        type="password"
        value={form.newPassword}
        onChange={handleInputChange}
      />

      <button onClick={handleChangePassword} className="bg-green-600 text-white px-4 py-2 rounded mb-6 w-full">
        Change Password
      </button>

      <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded mb-6 w-full">
        Delete Account
      </button>

      <div className="mt-4">
        <label className="block mb-2">Upload Avatar</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {avatarPreview && (
          <img src={avatarPreview} alt="Avatar Preview" className="w-32 h-32 object-cover mt-4 rounded-full" />
        )}
      </div>
    </div>
  );
};

export default Settings;
