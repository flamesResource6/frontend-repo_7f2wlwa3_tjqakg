import { useEffect, useState } from 'react'
import { Star, CheckCircle2, Loader2 } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Stars({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={16} className={i <= Math.round(value) ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  )
}

export default function ProductPage({ onAddToCart }) {
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const slug = 'nanoplastia-pro'

  const fetchAll = async () => {
    setLoading(true)
    // Ensure product exists
    await fetch(`${API}/api/seed`, { method: 'POST' }).catch(() => {})

    const prodRes = await fetch(`${API}/api/products/${slug}`)
    const prod = await prodRes.json()
    setProduct(prod)
    const revRes = await fetch(`${API}/api/reviews/${slug}`)
    const rev = await revRes.json()
    setReviews(rev)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin mr-2"/>Caricamento…</div>
    )
  }

  if (!product) return <div className="py-24 text-center">Prodotto non trovato</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
          <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover"/>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{product.title}</h1>
          <div className="flex items-center gap-3 mb-4">
            <Stars value={product.rating_average || 5} />
            <span className="text-sm text-gray-500">({product.rating_count || 24} recensioni)</span>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
          <div className="text-3xl font-semibold mb-6">€ {product.price.toFixed(2)}</div>
          <button onClick={() => onAddToCart(product)} className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium transition">
            Aggiungi al carrello
          </button>

          {product.benefits?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-3">Benefici</h3>
              <ul className="space-y-2">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="text-green-600 mt-0.5" size={16}/>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Come si usa</h2>
          <p className="text-gray-600 whitespace-pre-line">{product.how_to_use}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Ingredienti</h2>
          <p className="text-gray-600 whitespace-pre-line">{product.ingredients}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Recensioni</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">Ancora nessuna recensione.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{r.name}</span>
                  <Stars value={r.rating} />
                </div>
                <p className="text-gray-600 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
