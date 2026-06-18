import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useOrders } from '../context/OrdersContext'
import { fetchOrderById } from '../utils/api'
import { formatINR } from '../utils/currency'
import Loading from '../components/Loading'
import './OrderConfirmation.css'

function OrderConfirmation() {
  const { orderId } = useParams()
  const { getOrderById } = useOrders()

  const [order, setOrder] = useState(() => getOrderById(orderId) || null)
  const [isLoading, setIsLoading] = useState(!order)

  useEffect(() => {
    if (order) return

    fetchOrderById(orderId)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setIsLoading(false))
  }, [orderId, order])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return <Loading message="Loading your order..." />
  }

  if (!order) {
    return (
      <div className="order-confirmation-page container">
        <div className="order-not-found">
          <h1>Order Not Found</h1>
          <p>Unable to locate order {orderId}</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const paymentLabel = {
    cod: 'Cash on Delivery',
    upi: 'UPI',
    card: 'Credit / Debit Card'
  }[order.paymentMethod] || order.paymentMethod

  return (
    <div className="order-confirmation-page container">
      <div className="confirmation-header">
        <div className="confirmation-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1>Thank You for Your Order</h1>
        <p className="confirmation-message">
          Your order has been placed successfully. We'll send you an update as it ships.
        </p>
        <p className="order-number">Order #{order._id.slice(-10).toUpperCase()}</p>
      </div>

      <div className="confirmation-details">
        <div className="confirmation-section">
          <h2>Shipping Address</h2>
          <div className="address-card">
            <p className="address-name">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
            <p>{order.shippingAddress.country}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="confirmation-section">
          <h2>Order Details</h2>
          <div className="order-items-list">
            {order.items.map((item, index) => (
              <div key={index} className="order-item-row">
                <span className="order-item-title">{item.title}</span>
                {item.selectedSize && <span className="order-item-size">({item.selectedSize})</span>}
                <span className="order-item-qty">x{item.quantity}</span>
                <span className="order-item-price">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-line">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            <div className="total-line">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'Free' : formatINR(order.shipping)}</span>
            </div>
            <div className="total-line">
              <span>Tax</span>
              <span>{formatINR(order.tax)}</span>
            </div>
            <div className="total-line grand-total">
              <span>Total</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-section">
          <h2>Payment Method</h2>
          <p className="payment-info">{paymentLabel}</p>
          <p className="order-date">Order placed on {formatDate(order.createdAt)}</p>
        </div>

        <div className="confirmation-actions">
          <Link to="/profile" className="btn btn-primary">
            View Order History
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
