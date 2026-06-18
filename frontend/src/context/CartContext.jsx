import { createContext, useContext, useState, useEffect } from 'react'
import { getDiscountedPrice } from '../utils/currency'

const CartContext = createContext(null)

const STORAGE_KEY = 'shopez_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch {
        setItems([])
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoading])

  const addItem = (product, quantity = 1, selectedSize = null) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product._id && item.selectedSize === selectedSize
      )

      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        return updated
      }

      return [...prev, {
        id: `cart-${Date.now()}-${product._id}`,
        productId: product._id,
        product,
        quantity,
        selectedSize,
        addedAt: new Date().toISOString()
      }]
    })
  }

  const removeItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = items.reduce((sum, item) => {
    const price = getDiscountedPrice(item.product)
    return sum + price * item.quantity
  }, 0)

  const value = {
    items,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
