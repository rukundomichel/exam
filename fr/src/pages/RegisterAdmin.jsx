import React, { useState } from 'react'
import api from '../api'

export default function RegisterAdmin(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e){
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try{
      // Try initial registration (allowed only when no users exist)
      const res = await api.post('/users/register-first', { username, password })
      setMsg(res.data.message || 'Admin created')
    }catch(err){
      const errMsg = err?.response?.data?.error
      if (err?.response?.status === 403) {
        // Users exist, ask the user to login as admin and create via Admin Panel
        setMsg('Initial registration not allowed because users already exist. Please login as an admin to create new admins.')
      } else {
        setMsg(errMsg || 'Error')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-lg font-bold">Register Admin</h2>
      <p className="text-sm text-gray-600 mt-2">If this is the initial setup and no users exist, you can create the first admin here. Otherwise, please login as an admin and use the Admin panel.</p>
      <form onSubmit={submit} className="mt-3">
        <input required type="text" className="border p-2 w-full mb-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input required type="password" className="border p-2 w-full mb-2" placeholder="Strong password (min 8 chars, upper/lower/number/special)" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="mt-3"><button className="bg-green-600 text-white px-3 py-2 rounded" disabled={loading}>{loading? 'Creating...':'Create Admin'}</button></div>
      </form>
      {msg && <div className="mt-3 text-sm text-green-700">{msg}</div>}
    </div>
  )
}
