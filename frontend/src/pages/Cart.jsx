import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatINR, getDiscountedPrice } from '../utils/currency'
import QuantityStepper from '../components/QuantityStepper'
import './Cart.css'

// keep these in sync with the backend's order calculation
const FREE_SHIPPING_THRESHOLD = 999
const SHIPPING_COST = 79
const TAX_RATE = 0.05

function Cart() {
  const { items, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCart()

  const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : SHIPPING_COST
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + shippingCost + tax

  if (items.length === 0) {
    return (
      <div className="cart-page container">
        <div className="cart-empty">
          <h1>Your Cart</h1>
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page container">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <span className="cart-count">{totalItems} items</span>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => {
            const price = getDiscountedPrice(item.product)
            const image = item.product.images?.[0]
            const itemTotal = price * item.quantity

            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {image ? (
                    <img src={image} alt={item.product.title} />
                  ) : (
                    <div className="cart-item-placeholder" />
                  )}
                </div>

                <div className="cart-item-details">
                  <Link to={`/products/${item.product._id}`} className="cart-item-title">
                    {item.product.title}
                  </Link>
                  {item.selectedSize && (
                    <span className="cart-item-size">Size: {item.selectedSize}</span>
                  )}
                  <span className="cart-item-price">{formatINR(price)} each</span>
                </div>

                <div className="cart-item-actions">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(newQty) => updateQuantity(item.id, newQty)}
                    min={1}
                    max={item.product.stock || 99}
                    size="small"
                  />
                  <span className="cart-item-total">{formatINR(itemTotal)}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="remove-btn"
                    aria-label="Remove item"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 6l12 12M6 18L18 6" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
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

          {shippingCost > 0 && (
            <p className="free-shipping-note">
              Add {formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
            </p>
          )}

          <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn">
            Proceed to Checkout
          </Link>

          <button onClick={clearCart} className="btn btn-secondary clear-cart-btn">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
