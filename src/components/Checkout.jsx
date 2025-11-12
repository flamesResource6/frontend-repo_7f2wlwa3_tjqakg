import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Checkout({ items, onBack, onOrderPlaced }) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: 'Italia',
    phone: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        items: items.map(it => ({ product_slug: it.slug, quantity: it.quantity, unit_price: it.price })),
        total_amount: total
      }
      const res = await fetch(`${API}/api/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Errore durante il checkout')
      const data = await res.json()
      onOrderPlaced(data.order_id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={onBack} className="text-sm text-gray-600 hover:underline mb-4">← Torna al carrello</button>
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="Nome e cognome" value={form.customer_name} onChange={e=>setForm({...form, customer_name:e.target.value})} required />
          <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" value={form.customer_email} onChange={e=>setForm({...form, customer_email:e.target.value})} required />
          <input className="w-full border rounded px-3 py-2" placeholder="Indirizzo" value={form.address_line1} onChange={e=>setForm({...form, address_line1:e.target.value})} required />
          <input className="w-full border rounded px-3 py-2" placeholder="Dettagli indirizzo (opzionale)" value={form.address_line2} onChange={e=>setForm({...form, address_line2:e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full border rounded px-3 py-2" placeholder="Città" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} required />
            <input className="w-full border rounded px-3 py-2" placeholder="CAP" value={form.postal_code} onChange={e=>setForm({...form, postal_code:e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full border rounded px-3 py-2" placeholder="Paese" value={form.country} onChange={e=>setForm({...form, country:e.target.value})} required />
            <input className="w-full border rounded px-3 py-2" placeholder="Telefono (opzionale)" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
          </div>
          <textarea className="w-full border rounded px-3 py-2" placeholder="Note per la consegna (opzionale)" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} rows={3} />
          <button disabled={loading} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium py-2.5 rounded-lg">
            {loading ? 'Invio ordine…' : 'Conferma ordine'}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
        <div className="bg-gray-50 border rounded-lg p-4 h-fit">
          <h3 className="font-medium mb-3">Riepilogo ordine</h3>
          <div className="space-y-3">
            {items.map((it, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span>{it.title} × {it.quantity}</span>
                <span>€ {(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex items-center justify-between font-semibold">
              <span>Totale</span>
              <span>€ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
