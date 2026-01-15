import React, { useState, useEffect } from 'react'
import api from '../api'

export default function Payments(){
  const [list, setList] = useState([])
  const [records, setRecords] = useState([])
  const [form, setForm] = useState({ amountPaid:'', paymentDate:'', recordNumber:'' })
  const [msg, setMsg] = useState('')

  useEffect(()=>{ fetchPayments(); fetchRecords(); }, [])
  async function fetchPayments(){ const res = await api.get('/payments'); setList(res.data) }
  async function fetchRecords(){ const res = await api.get('/servicerecords'); setRecords(res.data) }

  async function handleSubmit(e){
    e.preventDefault();
    try{
      await api.post('/payments', form)
      setMsg('Payment recorded')
      setForm({ amountPaid:'', paymentDate:'', recordNumber:'' })
      fetchPayments()
    }catch(err){setMsg(err?.response?.data?.error || 'Error')}
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold">Payments</h2>
      <form onSubmit={handleSubmit} className="mt-3 grid grid-cols-2 gap-2">
        <input required type="number" value={form.amountPaid} onChange={e=>setForm({...form, amountPaid: e.target.value})} placeholder="Amount" className="border p-2" />
        <input required type="date" value={form.paymentDate} onChange={e=>setForm({...form, paymentDate: e.target.value})} className="border p-2" />
        <select required value={form.recordNumber} onChange={e=>setForm({...form, recordNumber: e.target.value})} className="border p-2">
          <option value="">Select Service Record</option>
          {records.map(r=> <option key={r.recordNumber} value={r.recordNumber}>{r.recordNumber} - {r.plateNumber}</option>)}
        </select>
        <div className="col-span-2"><button className="bg-green-600 text-white px-3 py-2 rounded">Save Payment</button></div>
      </form>
      {msg && <div className="mt-3 text-sm text-green-700">{msg}</div>}

      <ul className="mt-4">
        {list.map(p => (
          <li key={p.paymentNumber} className="p-2 border-b flex justify-between items-center">
            <div>{new Date(p.paymentDate).toLocaleDateString()} — Record {p.recordNumber}</div>
            <div className="flex gap-2 items-center">
              <div className="font-medium">{p.amountPaid} Rwf</div>
              <a className="text-sm text-blue-600" href={`/bill/${p.paymentNumber}`}>View Bill</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
