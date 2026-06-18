import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../utils/api'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import './Products.css'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const categoryParam = searchParams.get('category') || ''
  const searchQuery = searchParams.get('q') || ''
  const sortBy = searchParams.get('sort') || 'default'
  const priceMin = searchParams.get('min') || ''
  const priceMax = searchParams.get('max') || ''

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchProducts({
          category: categoryParam,
          search: searchQuery,
          minPrice: priceMin,
          maxPrice: priceMax,
          sort: sortBy === 'default' ? '' : sortBy
        })
        setProducts(data.products || [])
      } catch {
        setError('Failed to load products. Please try again.')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [categoryParam, searchQuery, sortBy, priceMin, priceMax])

  const handleCategoryChange = (e) => {
    const value = e.target.value
    const params = new URLSearchParams(searchParams)
    if (value) params.set('category', value)
    else params.delete('category')
    setSearchParams(params)
  }

  const handleSortChange = (e) => {
    const value = e.target.value
    const params = new URLSearchParams(searchParams)
    if (value === 'default') params.delete('sort')
    else params.set('sort', value)
    setSearchParams(params)
  }

  const handlePriceChange = (type, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(type, value)
    else params.delete(type)
    setSearchParams(params)
  }

  const clearFilters = () => setSearchParams({})

  const hasActiveFilters = categoryParam || priceMin || priceMax || sortBy !== 'default'

  if (isLoading) {
    return <Loading message="Loading products..." />
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-layout">
          <aside className="products-sidebar">
            <div className="sidebar-section">
              <h3>Category</h3>
              <select value={categoryParam} onChange={handleCategoryChange} className="filter-select">
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="sidebar-section">
              <h3>Price Range (₹)</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  min="0"
                  step="1"
                />
                <span className="price-separator">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  min="0"
                  step="1"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn btn-secondary btn-sm clear-filters">
                Clear Filters
              </button>
            )}
          </aside>

          <main className="products-main">
            <div className="products-header">
              <h1>{searchQuery ? `Search: "${searchQuery}"` : categoryParam ? categoryParam.replace(/-/g, ' ') : 'All Products'}</h1>
              <div className="products-meta">
                <span className="product-count">{products.length} products</span>
                <div className="sort-wrapper">
                  <label htmlFor="sort">Sort by:</label>
                  <select id="sort" value={sortBy} onChange={handleSortChange} className="filter-select sort-select">
                    <option value="default">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="no-products">
                <p>No products match your filters.</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Products
