const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // stored in INR (rupees)
    discountPercentage: { type: Number, default: 0 },
    category: { type: String, required: true, index: true },
    brand: { type: String, default: 'ShopEZ' },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 4.2 },
    images: [{ type: String }],
    sizes: [{ type: String }] // only relevant for apparel, empty array otherwise
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
