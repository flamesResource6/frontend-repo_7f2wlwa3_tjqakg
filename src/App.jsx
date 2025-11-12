import { useEffect, useState } from 'react'
import Header from './components/Header'
import ProductPage from './components/ProductPage'
import CartDrawer from './components/CartDrawer'
import Checkout from './components/Checkout'

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [checkoutMode, setCheckoutMode] = useState(false)
  const [orderId, setOrderId] = useState(null)

  // Restore cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const handleAddToCart = (product) => {
    setCartOpen(true)
    setCart(prev => {
      const idx = prev.findIndex(p => p.slug === product.slug)
      if (idx !== -1) {
        const cp = [...prev]
        cp[idx].quantity += 1
        return cp
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const handleQty = (idx, qty) => {
    setCart(prev => {
      const cp = [...prev]
      cp[idx].quantity = qty
      return cp
    })
  }

  const startCheckout = () => setCheckoutMode(true)

  const handleOrderPlaced = (id) => {
    setOrderId(id)
    setCart([])
    localStorage.removeItem('cart')
    setCheckoutMode(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-fuchsia-50">
      <Header cartCount={cart.reduce((s,i)=>s+i.quantity,0)} onCartClick={() => setCartOpen(true)} />

      {!checkoutMode ? (
        <>
          <section className="relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 pt-12 pb-6 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Capelli lisci, lucenti e forti con Nanoplastia</h1>
                <p className="text-gray-600 mb-6">Trattamento professionale lisciante e ricostruttivo di nuova generazione. Formula senza formaldeide, risultati duraturi fino a 12 settimane.</p>
                <a href="#shop" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium">Scopri il prodotto</a>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop" alt="Nanoplastia" className="w-full h-full object-cover"/>
              </div>
            </div>
          </section>

          <div id="shop">
            <ProductPage onAddToCart={handleAddToCart} />
          </div>

          <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); startCheckout() }} onQty={handleQty} />
        </>
      ) : (
        orderId ? (
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <h2 className="text-3xl font-bold mb-2">Grazie per l'ordine!</h2>
            <p className="text-gray-600">Numero ordine: {orderId}</p>
            <button className="mt-6 px-4 py-2 rounded-lg border" onClick={() => setOrderId(null)}>Torna allo shop</button>
          </div>
        ) : (
          <Checkout items={cart} onBack={() => setCheckoutMode(false)} onOrderPlaced={handleOrderPlaced} />
        )
      )}

      <footer className="border-t mt-16 py-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} Nanoplastia Pro — Tutti i diritti riservati</footer>
    </div>
  )
}

export default App
