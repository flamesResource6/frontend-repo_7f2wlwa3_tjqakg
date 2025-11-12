import { ShoppingCart, Sparkles } from 'lucide-react'

export default function Header({ cartCount, onCartClick }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-fuchsia-500 to-indigo-500 grid place-items-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="font-semibold tracking-tight">Nanoplastia Pro</span>
        </div>
        <button onClick={onCartClick} className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition bg-white">
          <ShoppingCart size={18} />
          <span className="text-sm">Carrello</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-fuchsia-600 text-white px-1.5 py-0.5 rounded-full">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  )
}
