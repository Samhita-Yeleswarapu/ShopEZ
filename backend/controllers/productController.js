const Product = require('../models/Product');

// GET /api/products?category=&search=&minPrice=&maxPrice=&sort=
exports.getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter);

    switch (sort) {
      case 'price-low':
        query = query.sort({ price: 1 });
        break;
      case 'price-high':
        query = query.sort({ price: -1 });
        break;
      case 'rating':
        query = query.sort({ rating: -1 });
        break;
      case 'newest':
        query = query.sort({ createdAt: -1 });
        break;
      default:
        query = query.sort({ createdAt: -1 });
    }

    const products = await query.exec();
    res.json({ count: products.length, products });
  } catch (err) {
    console.error('getProducts error:', err.message);
    res.status(500).json({ message: 'Could not fetch products' });
  }
};

// GET /api/products/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch categories' });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(404).json({ message: 'Product not found' });
  }
};

// POST /api/products  (admin only)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error('createProduct error:', err.message);
    res.status(400).json({ message: 'Could not create product', error: err.message });
  }
};

// PUT /api/products/:id  (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Could not update product', error: err.message });
  }
};

// DELETE /api/products/:id  (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete product' });
  }
};
