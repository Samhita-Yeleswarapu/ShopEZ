import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductById } from '../utils/api'
import { useCart } from '../context/CartContext'
import { formatINR, getDiscountedPrice } from '../utils/currency'
import Loading from '../components/Loading'
import QuantityStepper from '../components/QuantityStepper'
import './ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(null)
  const [addedToCart, setAddedToCart] = useState(false)

  const { addItem } = useCart()

  const hasSizes = product?.sizes?.length > 0

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true)
      setError(null)
      setActiveImage(0)
      setSelectedSize(null)

      try {
        const data = await fetchProductById(id)
        setProduct(data)
      } catch {
        setError('Failed to load product. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) return

    addItem(product, quantity, selectedSize)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (isLoading) {
    return <Loading message="Loading product..." />
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="error-message">{error || 'Product not found.'}</div>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Browse Products
        </Link>
      </div>
    )
  }

  const discountedPrice = product.discountPercentage ? getDiscountedPrice(product) : null
  const images = product.images?.length ? product.images : []

  return (
    <div className="product-detail-page container">
      <Link to="/products" className="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Shop
      </Link>

      <div className="product-detail-layout">
        <div className="product-detail-image">
          {images.length > 0 ? (
            <img src={images[activeImage]} alt={product.title} />
          ) : (
            <div className="product-detail-placeholder" aria-label={product.title} />
          )}

          {images.length > 1 && (
            <div className="thumbnail-row">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  className={`thumbnail-btn ${i === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt={`${product.title} view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.title}</h1>

          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < Math.round(product.rating || 0) ? 'star filled' : 'star'}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <span className="rating-text">
              {product.rating?.toFixed(1) || '0.0'} ({product.stock || 0} in stock)
            </span>
          </div>

          <div className="product-price">
            {discountedPrice ? (
              <>
                <span className="price-current">{formatINR(discountedPrice)}</span>
                <span className="price-original">{formatINR(product.price)}</span>
                <span className="discount-badge">-{Math.round(product.discountPercentage)}%</span>
              </>
            ) : (
              <span className="price-current">{formatINR(product.price)}</span>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          {hasSizes && (
            <div className="size-selector">
              <label>Size</label>
              <div className="size-options">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="quantity-selector">
            <label>Quantity</label>
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={product.stock || 99}
            />
          </div>

          <div className="product-actions">
            <button
              onClick={handleAddToCart}
              disabled={hasSizes && !selectedSize}
              className={`btn btn-primary btn-lg ${addedToCart ? 'added' : ''}`}
            >
              {addedToCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
            <Link to="/cart" className="btn btn-outline btn-lg">
              View Cart
            </Link>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Brand</span>
              <span className="meta-value">{product.brand || 'ShopEZ'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">SKU</span>
              <span className="meta-value">{product._id.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-reviews">
        <h2>Reviews</h2>
        <div className="reviews-list">
          <div className="review-card">
            <div className="review-header">
              <span className="review-author">Priya S.</span>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < 4 ? 'star filled' : 'star'}>&#9733;</span>
                ))}
              </div>
            </div>
            <p className="review-text">Good quality, exactly as pictured. Packaging was solid and delivery was on time.</p>
          </div>
          <div className="review-card">
            <div className="review-header">
              <span className="review-author">Arjun M.</span>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < 5 ? 'star filled' : 'star'}>&#9733;</span>
                ))}
              </div>
            </div>
            <p className="review-text">Great value for the price. Would definitely order again.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
