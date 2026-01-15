import React, { useState, useEffect } from 'react'
import api from '../api'

export default function Services(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({ serviceCode:'', serviceName:'', servicePrice:'', image: null })
  const [msg, setMsg] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(()=>{ fetchList() }, [])
  async function fetchList(){
    const res = await api.get('/services')
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
      await api.post('/services', { 
        serviceCode: form.serviceCode,
        serviceName: form.serviceName,
        servicePrice: form.servicePrice,
        image: form.image
      })
      setMsg('Service created')
      setForm({ serviceCode:'', serviceName:'', servicePrice:'', image: null })
      setImagePreview(null)
      fetchList()
    }catch(err){setMsg(err?.response?.data?.error || 'Error')}
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold">Services (Admin)</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <input required className="border p-2" placeholder="Code" value={form.serviceCode} onChange={e=>setForm({...form, serviceCode: e.target.value})} />
          <input required className="border p-2" placeholder="Name" value={form.serviceName} onChange={e=>setForm({...form, serviceName: e.target.value})} />
          <input required type="number" className="border p-2" placeholder="Price" value={form.servicePrice} onChange={e=>setForm({...form, servicePrice: e.target.value})} />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-bold mb-1">Service Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 w-full" />
        </div>
        {imagePreview && <img src={imagePreview} alt="preview" className="h-32 w-32 object-cover mb-3 rounded" />}
        <div><button className="bg-green-600 text-white px-3 py-2 rounded">Save Service</button></div>
      </form>
      {msg && <div className="mt-3 text-sm text-green-700">{msg}</div>}

      <ul className="mt-4">
        {list.map(s => (
          <li key={s.serviceCode} className="p-3 border-b flex gap-3">
            {s.image && <img src={s.image} alt={s.serviceName} className="h-16 w-16 object-cover rounded" />}
            <div className="flex-1">
              <div className="font-bold">{s.serviceName} ({s.serviceCode})</div>
              <div className="text-sm text-gray-600">{s.servicePrice} Rwf</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
