import { X } from 'lucide-react'

export default function CartDrawer({ open, items, onClose, onCheckout, onQty }) {
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Il tuo carrello</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md"><X size={18}/></button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-9rem)]">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Il carrello è vuoto.</p>
          ) : (
            items.map((it, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <img src={it.images?.[0]} alt={it.title} className="w-16 h-16 rounded object-cover bg-gray-100"/>
                <div className="flex-1">
                  <div className="font-medium text-sm">{it.title}</div>
                  <div className="text-xs text-gray-500">€ {it.price.toFixed(2)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="px-2 py-1 border rounded" onClick={() => onQty(idx, Math.max(1, it.quantity - 1))}>-</button>
                    <span className="text-sm w-6 text-center">{it.quantity}</span>
                    <button className="px-2 py-1 border rounded" onClick={() => onQty(idx, it.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="font-medium">€ {(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Totale</span>
            <span className="font-semibold">€ {total.toFixed(2)}</span>
          </div>
          <button disabled={items.length===0} onClick={onCheckout} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg">
            Procedi al checkout
          </button>
        </div>
      </div>
    </div>
  )
}
