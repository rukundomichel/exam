import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Cars from './pages/Cars'
import Services from './pages/Services'
import ServiceRecords from './pages/ServiceRecords'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import Bill from './pages/Bill'
import Navbar from './components/Navbar'
import RegisterAdmin from './pages/RegisterAdmin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminOnlyRoute from './components/AdminOnlyRoute'
import { AuthProvider } from './contexts/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-admin" element={<RegisterAdmin />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/cars" element={<ProtectedRoute><Cars /></ProtectedRoute>} />
            <Route path="/services" element={<AdminOnlyRoute><Services /></AdminOnlyRoute>} />
            <Route path="/servicerecords" element={<AdminOnlyRoute><ServiceRecords /></AdminOnlyRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/reports" element={<AdminOnlyRoute><Reports /></AdminOnlyRoute>} />
            <Route path="/bill/:id" element={<ProtectedRoute><Bill /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}
