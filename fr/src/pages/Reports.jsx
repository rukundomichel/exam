import React, { useState } from 'react'
import api from '../api'

export default function Reports(){
  const [date, setDate] = useState('')
  const [data, setData] = useState([])
  const [msg, setMsg] = useState('')

  async function run(){
    if(!date) return setMsg('Select date')
    const res = await api.get('/reports/daily?date=' + date)
    setData(res.data)
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold">Daily Report</h2>
      <div className="mt-3 flex gap-2">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border p-2" />
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={run}>Run</button>
      </div>
      {data.length>0 && <div className="mt-4">
        {data.map((r, idx)=> (
          <div key={idx} className="p-3 border-b">
            <div className="font-medium">{r.service?.serviceName} - {r.car?.plateNumber}</div>
            <div className="text-sm">Amount Paid: {r.payment.amountPaid} — Received by: {r.payment.receivedBy?.username}</div>
          </div>
        ))}
      </div>}
      {msg && <div className="mt-3 text-sm text-red-600">{msg}</div>}
    </div>
  )
}
