import { useState, useEffect } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import {
  fetchProducts,
  fetchCategories,
  deleteProduct,
  createProduct,
  fetchAllOrders,
  updateOrderStatus as updateOrderStatusApi
} from '../utils/api'
import { formatINR } from '../utils/currency'
import Loading from '../components/Loading'
import './Admin.css'

function Admin() {
  return (
    <div className="admin-page container">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <h2>Admin</h2>
          <nav className="admin-nav">
            <NavLink to="/admin" end className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
              Products
            </NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
              Orders
            </NavLink>
            <NavLink to="/admin/add-product" className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
              Add Product
            </NavLink>
          </nav>
        </aside>

        <main className="admin-content">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="add-product" element={<AddProduct />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function DashboardHome() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, ordersData] = await Promise.all([
          fetchProducts(),
          fetchAllOrders()
        ])
        setProducts(productsData.products || [])
        setOrders(ordersData || [])
      } catch {
        setProducts([])
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return <Loading message="Loading dashboard..." />
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'processing').length

  return (
    <div className="admin-section">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{products.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{orders.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending Orders</span>
          <span className="stat-value">{pendingOrders}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">{formatINR(totalRevenue)}</span>
        </div>
      </div>
    </div>
  )
}

function ProductsManagement() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ])
      setProducts(productsData.products || [])
      setCategories(categoriesData || [])
    } catch {
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loading message="Loading products..." />
  }

  const filteredProducts = categoryFilter
    ? products.filter(p => p.category === categoryFilter)
    : products

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return

    setDeletingId(productId)
    try {
      await deleteProduct(productId)
      setProducts(prev => prev.filter(p => p._id !== productId))
    } catch (err) {
      alert(err.message || 'Could not delete product')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h1>Products</h1>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td className="product-name">{product.title}</td>
                <td className="category-cell">{product.category}</td>
                <td>{formatINR(product.price)}</td>
                <td>{product.stock ?? 'N/A'}</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deletingId === product._id}
                      className="btn btn-outline btn-sm"
                    >
                      {deletingId === product._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrdersManagement() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAllOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false))
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus)
      setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o)))
    } catch (err) {
      alert(err.message || 'Could not update order status')
    }
  }

  if (isLoading) {
    return <Loading message="Loading orders..." />
  }

  return (
    <div className="admin-section">
      <h1>Orders</h1>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.slice(-8).toUpperCase()}</td>
                <td>{order.user?.name || 'Unknown'}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{order.items.length} items</td>
                <td>{formatINR(order.total)}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AddProduct() {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    discountPercentage: '',
    stock: '',
    brand: '',
    imageUrl: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await createProduct({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        discountPercentage: Number(formData.discountPercentage) || 0,
        stock: Number(formData.stock),
        brand: formData.brand || 'ShopEZ',
        images: formData.imageUrl ? [formData.imageUrl] : []
      })

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          title: '',
          description: '',
          category: '',
          price: '',
          discountPercentage: '',
          stock: '',
          brand: '',
          imageUrl: ''
        })
      }, 2000)
    } catch (err) {
      setError(err.message || 'Could not add product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-section">
      <h1>Add New Product</h1>

      {submitted ? (
        <div className="success-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Product added successfully
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="admin-form">
          {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="title">Product Name</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. mens-shirts"
                list="category-suggestions"
                required
              />
              <datalist id="category-suggestions">
                {categories.map(cat => <option key={cat} value={cat} />)}
              </datalist>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="discountPercentage">Discount (%)</label>
              <input
                type="number"
                id="discountPercentage"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                step="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg">
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      )}
    </div>
  )
}

export default Admin
