import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Doctor from './pages/Doctor';
import Clinics from './pages/Clinics';
import BookingHistory from './pages/BookingHistory';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import RegisterDoctor from './pages/RegisterDoctor';
import Notifications from './pages/Notifications';
import Messaging from './pages/Messaging';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register-doctor" element={<RegisterDoctor />} />

        {/* Protected Routes - TopNav only appears inside these */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <PrivateRoute>
              <Doctor />
            </PrivateRoute>
          }
        />
        <Route
          path="/clinics"
          element={
            <PrivateRoute>
              <Clinics />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking-history"
          element={
            <PrivateRoute>
              <BookingHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
  path="/messages"
  element={
    <PrivateRoute>
      <Messaging />
    </PrivateRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
