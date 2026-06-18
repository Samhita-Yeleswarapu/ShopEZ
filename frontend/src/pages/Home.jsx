import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../utils/api'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import './Home.css'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts({ sort: 'rating' }),
          fetchCategories()
        ])

        setFeaturedProducts((productsData.products || []).slice(0, 8))
        setCategories((categoriesData || []).slice(0, 6))
        setError(null)
      } catch (err) {
        setError('Could not load the homepage right now. Please refresh.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return <Loading message="Loading..." />
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="home">
      <section className="hero">
        <img src={HERO_IMAGE} alt="" className="hero-image" />
        <div className="hero-overlay" />
        <div className="hero-content container">
          <h1>Curated Essentials</h1>
          <p>Thoughtfully selected pieces for the modern lifestyle, priced for you.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explore Collection
          </Link>
        </div>
      </section>

      <section className="categories-section container">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="category-card"
            >
              <span className="category-name">{cat.replace(/-/g, ' ')}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section container">
        <div className="section-header">
          <h2>Featured</h2>
          <Link to="/products" className="view-all">
            View all
          </Link>
        </div>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="about-section container">
        <div className="about-content">
          <h2>About ShopEZ</h2>
          <p>
            We believe in quality over quantity. Every piece in our collection is
            carefully selected to bring lasting value and timeless style to your
            everyday life, all at honest prices.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
