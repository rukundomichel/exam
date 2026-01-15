import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { AuthContext } from '../contexts/AuthContext'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  async function handleSubmit(e){
    e.preventDefault()
    try{
      const res = await api.post('/auth/login', { username, password })
      login(res.data.user)
      setMessage('Logged in')
      setTimeout(() => navigate('/'), 500)
    }catch(err){
      console.error('login error', err)
      const errMsg = err?.response?.data?.error || err?.message || 'Login failed'
      const statusPart = err?.response ? ` (status: ${err.response.status})` : ''
      setMessage(`${errMsg}${statusPart}`)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" className="border p-2 rounded" />
        <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" className="border p-2 rounded" />
        <button className="bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
      {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
    </div>
  )
}
