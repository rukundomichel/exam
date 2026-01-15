import React, { useState, useEffect } from 'react'
import api from '../api'

export default function ServiceRecords(){
  const [list, setList] = useState([])
  const [services, setServices] = useState([])
  const [cars, setCars] = useState([])
  const [form, setForm] = useState({ serviceDate:'', plateNumber:'', serviceCode:'', remarks:'' })
  const [msg, setMsg] = useState('')

  useEffect(()=>{ fetchList(); fetchServices(); fetchCars(); }, [])
  async function fetchList(){ const res = await api.get('/servicerecords'); setList(res.data) }
  async function fetchServices(){ const res = await api.get('/services'); setServices(res.data) }
  async function fetchCars(){ const res = await api.get('/cars'); setCars(res.data) }

  async function handleSubmit(e){
    e.preventDefault();
    try{
      await api.post('/servicerecords', form)
      setMsg('Service record created')
      setForm({ serviceDate:'', plateNumber:'', serviceCode:'', remarks:'' })
      fetchList()
    }catch(err){setMsg(err?.response?.data?.error || 'Error')}
  }

  async function handleDelete(recordNumber){
    if(!confirm('Delete record?')) return
    await api.delete('/servicerecords/' + recordNumber)
    fetchList()
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold">Service Records</h2>
      <form onSubmit={handleSubmit} className="mt-3 grid grid-cols-2 gap-2">
        <input required type="date" value={form.serviceDate} onChange={e=>setForm({...form, serviceDate: e.target.value})} className="border p-2" />
        <select required value={form.plateNumber} onChange={e=>setForm({...form, plateNumber: e.target.value})} className="border p-2">
          <option value="">Select Car</option>
          {cars.map(c=> <option key={c.plateNumber} value={c.plateNumber}>{c.plateNumber}</option>)}
        </select>
        <select required value={form.serviceCode} onChange={e=>setForm({...form, serviceCode: e.target.value})} className="border p-2">
          <option value="">Select Service</option>
          {services.map(s=> <option key={s.serviceCode} value={s.serviceCode}>{s.serviceName}</option>)}
        </select>
        <input className="border p-2" placeholder="Remarks" value={form.remarks} onChange={e=>setForm({...form, remarks: e.target.value})} />
        <div className="col-span-2"><button className="bg-green-600 text-white px-3 py-2 rounded">Save Record</button></div>
      </form>
      {msg && <div className="mt-3 text-sm text-green-700">{msg}</div>}

      <ul className="mt-4">
        {list.map(r => (
          <li key={r.recordNumber} className="p-2 border-b flex justify-between items-center">
            <div>
              <div className="font-medium">Record {r.recordNumber} — {r.serviceCode}</div>
              <div className="text-sm text-gray-600">Car: {r.plateNumber} | Date: {new Date(r.serviceDate).toLocaleDateString()}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-sm text-red-600" onClick={()=>handleDelete(r.recordNumber)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
