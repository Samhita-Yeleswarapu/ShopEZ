import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { formatINR, getDiscountedPrice } from '../utils/currency'
import './Checkout.css'

const FREE_SHIPPING_THRESHOLD = 999
const SHIPPING_COST = 79
const TAX_RATE = 0.05

function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const { createOrder } = useOrders()

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + shippingCost + tax

  if (items.length === 0) {
    return (
      <div className="checkout-page container">
        <div className="checkout-empty">
          <h1>Checkout</h1>
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Required'
    if (!formData.phone.trim()) newErrors.phone = 'Required'
    else if (!/^\d{10}$/.test(formData.phone.trim())) newErrors.phone = 'Enter a valid 10-digit number'
    if (!formData.street.trim()) newErrors.street = 'Required'
    if (!formData.city.trim()) newErrors.city = 'Required'
    if (!formData.state.trim()) newErrors.state = 'Required'
    if (!formData.pincode.trim()) newErrors.pincode = 'Required'
    else if (!/^\d{6}$/.test(formData.pincode.trim())) newErrors.pincode = 'Enter a valid 6-digit pincode'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          selectedSize: item.selectedSize
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India'
        },
        paymentMethod: formData.paymentMethod
      }

      const order = await createOrder(orderData)
      clearCart()
      navigate(`/order-confirmation/${order._id}`)
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to place order. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="checkout-layout">
          <div className="checkout-details">
            <section className="form-section">
              <h2>Shipping Address</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="street">Address (House No, Street, Area)</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className={errors.street ? 'error' : ''}
                  />
                  {errors.street && <span className="error-text">{errors.street}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-text">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    className={errors.pincode ? 'error' : ''}
                  />
                  {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input type="text" id="country" name="country" value="India" disabled />
                </div>
              </div>
            </section>

            <section className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <span className="payment-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                    Cash on Delivery
                  </span>
                </label>

                <label className={`payment-option ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleChange}
                  />
                  <span className="payment-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3z" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                    UPI
                    {formData.paymentMethod === 'upi' && (
                      <span className="payment-detail">You'll pay via UPI app on delivery confirmation</span>
                    )}
                  </span>
                </label>

                <label className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <span className="payment-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                    Credit / Debit Card
                  </span>
                </label>
              </div>
            </section>

            {errors.submit && (
              <div className="error-message">{errors.submit}</div>
            )}
          </div>

          <aside className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {items.map(item => {
                const price = getDiscountedPrice(item.product)
                return (
                  <div key={item.id} className="summary-item">
                    <span className="summary-item-title">{item.product.title}</span>
                    <span className="summary-item-qty">x{item.quantity}</span>
                    <span className="summary-item-price">{formatINR(price * item.quantity)}</span>
                  </div>
                )
              })}
            </div>

            <div className="summary-totals">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatINR(shippingCost)}</span>
              </div>
              <div className="summary-line">
                <span>Tax (GST 5%)</span>
                <span>{formatINR(tax)}</span>
              </div>
              <div className="summary-line total">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg place-order-btn"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </aside>
        </div>
      </form>
    </div>
  )
}

export default Checkout
