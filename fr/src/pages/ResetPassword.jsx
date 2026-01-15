import React, { useState } from 'react'
import api from '../api'

export default function ResetPassword(){
  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault()
    try{
      const res = await api.post('/auth/reset-password', { newPassword })
      setMsg(res.data.message)
    }catch(err){ setMsg(err?.response?.data?.error || 'Error') }
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-lg font-bold">Reset Password</h2>
      <p className="text-sm text-gray-600 mt-2">Resetting your password helps protect your account. Use a strong password (min 8 chars, a mix of uppercase/lowercase, numbers, and symbols). If you suspect your account was compromised, reset immediately and contact an admin.</p>
      <form onSubmit={submit} className="mt-3">
        <input required type="password" className="border p-2 w-full" placeholder="New strong password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
        <div className="mt-3"><button className="bg-blue-600 text-white px-3 py-2 rounded">Reset</button></div>
      </form>
      {msg && <div className="mt-3 text-sm text-green-700">{msg}</div>}
    </div>
  )
}
