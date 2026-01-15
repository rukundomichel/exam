import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function AdminOnlyRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (!user || !user.authenticated) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
        <h2 className="font-bold">Access Denied</h2>
        <p>This page is only available to admins.</p>
      </div>
    )
  }

  return children
}
