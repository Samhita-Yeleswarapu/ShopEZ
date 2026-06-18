import { createContext, useContext, useState, useCallback } from 'react'
import { placeOrder, fetchMyOrders, updateOrderStatus as updateOrderStatusApi } from '../utils/api'
import { useAuth } from './AuthContext'

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const loadOrders = useCallback(async () => {
    if (!isLoggedIn) {
      setOrders([])
      return
    }
    setIsLoading(true)
    try {
      const data = await fetchMyOrders()
      setOrders(data)
    } catch {
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }, [isLoggedIn])

  const createOrder = async (orderData) => {
    const data = await placeOrder(orderData)
    setOrders(prev => [data.order, ...prev])
    return data.order
  }

  const updateOrderStatus = async (orderId, status) => {
    const updated = await updateOrderStatusApi(orderId, status)
    setOrders(prev => prev.map(o => (o._id === orderId ? updated : o)))
  }

  const getOrderById = (orderId) => {
    return orders.find(order => order._id === orderId)
  }

  const value = {
    orders,
    isLoading,
    loadOrders,
    createOrder,
    updateOrderStatus,
    getOrderById
  }

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}

export default OrdersContext
