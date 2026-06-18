import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { formatINR } from '../utils/currency'
import Loading from '../components/Loading'
import './Profile.css'

function Profile() {
  const { user } = useAuth()
  const { orders, isLoading, loadOrders } = useOrders()

  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    loadOrders()
    // loadOrders is stable thanks to useCallback, safe to omit from deps here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'processing': return 'Processing'
      case 'shipped': return 'Shipped'
      case 'delivered': return 'Delivered'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <h1>My Account</h1>
        <p className="profile-email">{user?.email}</p>
      </div>

      <div className="profile-layout">
        <nav className="profile-nav">
          <button
            onClick={() => setActiveTab('orders')}
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`nav-item ${activeTab === 'info' ? 'active' : ''}`}
          >
            Account Details
          </button>
        </nav>

        <div className="profile-content">
          {activeTab === 'orders' && (
            <div className="section">
              <h2>Order History</h2>
              {isLoading ? (
                <Loading message="Loading your orders..." inline />
              ) : orders.length === 0 ? (
                <p className="empty-state">No orders yet.</p>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-card-header">
                        <div className="order-info">
                          <span className="order-id">#{order._id.slice(-10).toUpperCase()}</span>
                          <span className="order-date">{formatDate(order.createdAt)}</span>
                        </div>
                        <span className={`status-badge status-${order.status}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="order-card-body">
                        <div className="order-items-preview">
                          {order.items.slice(0, 3).map((item, i) => (
                            <span key={i} className="item-preview">
                              {item.title} x{item.quantity}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="item-preview">+{order.items.length - 3} more</span>
                          )}
                        </div>
                        <div className="order-total">
                          <span className="label">Total</span>
                          <span className="value">{formatINR(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="section">
              <h2>Account Details</h2>
              <div className="info-card">
                <div className="info-row">
                  <span className="info-label">Name</span>
                  <span className="info-value">{user?.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{user?.phone || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
