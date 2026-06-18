import { Link } from 'react-router-dom'
import { formatINR, getDiscountedPrice } from '../utils/currency'
import './ProductCard.css'

function ProductCard({ product }) {
  const discountedPrice = product.discountPercentage ? getDiscountedPrice(product) : null
  const image = product.images?.[0]

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-card-image-link">
        <div className="product-card-image">
          {image ? (
            <img src={image} alt={product.title} loading="lazy" />
          ) : (
            <div className="product-card-placeholder" aria-label={product.title} />
          )}
          {product.discountPercentage > 0 && (
            <span className="discount-badge">-{Math.round(product.discountPercentage)}%</span>
          )}
        </div>
      </Link>

      <div className="product-card-details">
        <Link to={`/products/${product._id}`} className="product-card-title">
          <h3>{product.title}</h3>
        </Link>

        <div className="product-card-price">
          {discountedPrice ? (
            <>
              <span className="price-current">{formatINR(discountedPrice)}</span>
              <span className="price-original">{formatINR(product.price)}</span>
            </>
          ) : (
            <span className="price-current">{formatINR(product.price)}</span>
          )}
        </div>

        <Link to={`/products/${product._id}`} className="btn btn-primary btn-sm product-card-btn">
          Shop Now
        </Link>
      </div>
    </article>
  )
}

export default ProductCard
