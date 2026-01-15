import React, { useState, useEffect } from 'react'
import api from '../api'

export default function Cars(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({ plateNumber:'', type:'', model:'', manufacturingYear:'', driverPhone:'', mechanicName:'', image: null })
  const [msg, setMsg] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(()=>{ fetchList() }, [])
  async function fetchList(){
    const res = await api.get('/cars')
    setList(res.data)
  }

  function handleImageChange(e){
    const file = e.target.files[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const base64 = evt.target.result
      setForm({ ...form, image: base64 })
      setImagePreview(base64)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e){
    e.preventDefault()
    try{
      await api.post('/cars', { 
        plateNumber: form.plateNumber,
        type: form.type,
        model: form.model,
        manufacturingYear: form.manufacturingYear,
        driverPhone: form.driverPhone,
        mechanicName: form.mechanicName,
        image: form.image
      })
      setMsg('Car created')
      setForm({ plateNumber:'', type:'', model:'', manufacturingYear:'', driverPhone:'', mechanicName:'', image: null })
      setImagePreview(null)
      fetchList()
    }catch(err){setMsg(err?.response?.data?.error || 'Error')}
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold">Cars / Goods</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input required className="border p-2" placeholder="Plate Number" value={form.plateNumber} onChange={e=>setForm({...form, plateNumber: e.target.value})} />
          <input className="border p-2" placeholder="Type" value={form.type} onChange={e=>setForm({...form, type: e.target.value})} />
          <input className="border p-2" placeholder="Model" value={form.model} onChange={e=>setForm({...form, model: e.target.value})} />
          <input className="border p-2" placeholder="Year" value={form.manufacturingYear} onChange={e=>setForm({...form, manufacturingYear: e.target.value})} />
          <input className="border p-2" placeholder="Driver Phone" value={form.driverPhone} onChange={e=>setForm({...form, driverPhone: e.target.value})} />
          <input className="border p-2" placeholder="Mechanic Name" value={form.mechanicName} onChange={e=>setForm({...form, mechanicName: e.target.value})} />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">Car/Goods Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 w-full" />
        </div>
        {imagePreview && <img src={imagePreview} alt="preview" className="h-32 w-32 object-cover mb-3 rounded" />}
        <div><button className="bg-green-600 text-white px-3 py-2 rounded">Save Car</button></div>
      </form>
      {msg && <div className="mt-3 text-sm text-green-700">{msg}</div>}

      <ul className="mt-4">
        {list.map(c => (
          <li key={c.plateNumber} className="p-3 border-b flex gap-3">
            {c.image && <img src={c.image} alt={c.plateNumber} className="h-16 w-16 object-cover rounded" />}
            <div className="flex-1">
              <div className="font-bold">{c.plateNumber} - {c.model}</div>
              <div className="text-sm text-gray-600">{c.driverPhone}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
