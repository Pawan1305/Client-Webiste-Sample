import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const idx = state.items.findIndex(i => i._id === action.payload._id)
      if (idx >= 0) {
        const updated = [...state.items]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 }
        return { ...state, items: updated }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i._id !== action.payload) }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i._id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        )
      }
    }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: (() => {
      try { return JSON.parse(localStorage.getItem('vc_cart') || '[]') }
      catch { return [] }
    })()
  })

  useEffect(() => {
    localStorage.setItem('vc_cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
    toast.success(`${item.name} added!`, {
      style: { background: '#111', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.35)' },
      iconTheme: { primary: '#C9A84C', secondary: '#111' },
    })
  }

  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const cartTotal = state.items.reduce((t, i) => t + i.price * i.quantity, 0)
  const cartCount = state.items.reduce((c, i) => c + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items: state.items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
