import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Navbar(){
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Show minimal navbar if not logged in
  if (!user || !user.authenticated) {
    return (
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto p-3 flex gap-4 items-center">
          <Link to="/" className="font-bold">CRPMS</Link>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/login" className="text-sm text-blue-600">Login</Link>
            <Link to="/register" className="text-sm text-green-600">Register</Link>
            <Link to="/register-admin" className="text-sm text-gray-600">Register Admin</Link>
          </div>
        </div>
      </nav>
    )
  }

  // Full navbar if logged in
  return (
    <nav className="bg-white shadow">
      <div className="max-w-4xl mx-auto p-3 flex gap-4 items-center">
        <Link to="/" className="font-bold">CRPMS</Link>
        
        {/* All users see: Cars, Payments */}
        <Link to="/cars" className="text-sm text-gray-600">Car</Link>
        <Link to="/payments" className="text-sm text-gray-600">Payment</Link>

        {/* Only admins see: Services, ServiceRecords, Reports */}
        {user?.role === 'admin' && (
          <>
            <Link to="/services" className="text-sm text-gray-600">Services</Link>
            <Link to="/servicerecords" className="text-sm text-gray-600">ServiceRecord</Link>
            <Link to="/reports" className="text-sm text-gray-600">Reports</Link>
          </>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-600">Hi, {user?.username || 'User'} ({user?.role})</span>
          <Link to="/reset-password" className="text-sm text-gray-600">Reset Password</Link>
          <button onClick={handleLogout} className="text-sm text-red-500 cursor-pointer">Logout</button>
        </div>
      </div>
    </nav>
  )
}
