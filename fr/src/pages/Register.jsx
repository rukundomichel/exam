import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { AuthContext } from '../contexts/AuthContext'

export default function Register(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  async function handleSubmit(e){
    e.preventDefault()
    setMessage('')
    setLoading(true)
    try{
      const res = await api.post('/users/register', { username, password })
      setMessage('Registration successful! Logging you in...')
      // Auto-login after successful registration
      login({ ...res.data, username })
      setTimeout(() => navigate('/'), 500)
    }catch(err){
      const errMsg = err?.response?.data?.error || err?.message || 'Registration failed'
      setMessage(errMsg)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register as Buyer/Mechanic</h2>
      <p className="text-sm text-gray-600 mb-4">Create a new account to access the system. You will have mechanic/buyer privileges.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" className="border p-2 rounded" />
        <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="strong password (min 8 chars, uppercase, lowercase, number, symbol)" className="border p-2 rounded text-sm" />
        <button className="bg-green-600 text-white p-2 rounded" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
      <p className="text-sm text-gray-600 mt-4">Already have an account? <Link to="/login" className="text-blue-600">Login here</Link></p>
      <p className="text-sm text-gray-600 mt-2">Admin registration? <Link to="/register-admin" className="text-blue-600">Register as admin</Link></p>
    </div>
  )
}
