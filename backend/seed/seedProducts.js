// Run with: npm run seed
// Wipes the products collection and inserts a fresh demo catalog.
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  // ---- Beauty ----
  {
    title: 'Velvet Matte Liquid Lipstick',
    description:
      'A long-wearing liquid lipstick that dries down to a soft matte finish without feeling dry on the lips. One swipe gives full, even colour that lasts through meals and meetings.',
    price: 449,
    discountPercentage: 10,
    category: 'beauty',
    brand: 'Glamora',
    stock: 86,
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
      'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&q=80'
    ]
  },
  {
    title: 'Volumizing Lash Mascara',
    description:
      'Smudge-proof mascara that builds dramatic volume and length without clumping. Formulated to hold curl all day, even in humid weather.',
    price: 599,
    discountPercentage: 0,
    category: 'beauty',
    brand: 'Essence',
    stock: 64,
    rating: 4.1,
    images: [
      'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=800&q=80'
    ]
  },
  {
    title: 'Vitamin C Brightening Serum',
    description:
      'A lightweight daily serum with 10% Vitamin C and niacinamide to even out skin tone and fade dark spots over time. Suitable for all skin types.',
    price: 749,
    discountPercentage: 15,
    category: 'skin-care',
    brand: 'Dermassure',
    stock: 120,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-da4e83b57b41?w=800&q=80'
    ]
  },
  {
    title: 'Rose Water Hydrating Toner',
    description:
      'Alcohol-free toner made with steam-distilled rose water that refreshes and preps skin before moisturiser. Calms redness and tightens pores.',
    price: 299,
    discountPercentage: 0,
    category: 'skin-care',
    brand: 'Dermassure',
    stock: 95,
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80'
    ]
  },
  {
    title: 'Oud & Amber Eau de Parfum',
    description:
      'A warm, woody fragrance built around oud, amber and a hint of vanilla. Long-lasting projection, perfect for evening wear.',
    price: 2299,
    discountPercentage: 20,
    category: 'fragrances',
    brand: 'Noir House',
    stock: 40,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80'
    ]
  },
  {
    title: 'Citrus Bloom Eau de Toilette',
    description:
      'A bright, refreshing scent with notes of bergamot, mandarin and white musk. Light enough for daily office wear.',
    price: 1599,
    discountPercentage: 0,
    category: 'fragrances',
    brand: 'Noir House',
    stock: 55,
    rating: 4.2,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80'
    ]
  },

  // ---- Fashion - Men ----
  {
    title: "Men's Slim Fit Oxford Shirt",
    description:
      'Crisp cotton oxford shirt with a tailored slim fit, mother-of-pearl buttons and a classic point collar. Works equally well tucked in for office or rolled-up sleeves on weekends.',
    price: 1299,
    discountPercentage: 25,
    category: 'mens-shirts',
    brand: 'Urban Thread',
    stock: 75,
    rating: 4.3,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'
    ]
  },
  {
    title: "Men's Leather Derby Shoes",
    description:
      'Genuine leather derby shoes with a cushioned insole and a classic stitched sole. A versatile pick for both formal and smart-casual outfits.',
    price: 3499,
    discountPercentage: 10,
    category: 'mens-shoes',
    brand: 'Walkmate',
    stock: 38,
    rating: 4.5,
    sizes: ['7', '8', '9', '10', '11'],
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80'
    ]
  },
  {
    title: "Men's Chronograph Steel Watch",
    description:
      'Stainless steel chronograph with a sapphire-coated dial window, luminous hands and 50m water resistance. A reliable everyday watch with a sporty edge.',
    price: 4999,
    discountPercentage: 18,
    category: 'mens-watches',
    brand: 'Chronotime',
    stock: 28,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80'
    ]
  },

  // ---- Fashion - Women ----
  {
    title: "Women's Floral Wrap Dress",
    description:
      'A flattering wrap-style dress in a soft floral print, finished with a tie waist and flutter sleeves. Lightweight fabric that moves well for everyday wear.',
    price: 1799,
    discountPercentage: 30,
    category: 'womens-dresses',
    brand: 'Petal & Co.',
    stock: 60,
    rating: 4.4,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'
    ]
  },
  {
    title: "Women's Quilted Sling Bag",
    description:
      'Compact quilted sling bag with a gold-tone chain strap and a roomy interior with card slots. Doubles up as a crossbody or a clutch.',
    price: 1899,
    discountPercentage: 0,
    category: 'womens-bags',
    brand: 'Maison Belle',
    stock: 45,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80'
    ]
  },
  {
    title: "Women's Block Heel Sandals",
    description:
      'Comfortable block heels with a padded footbed and an adjustable ankle strap. Sturdy enough for all-day wear at weddings or office events.',
    price: 1499,
    discountPercentage: 12,
    category: 'womens-shoes',
    brand: 'Walkmate',
    stock: 52,
    rating: 4.3,
    sizes: ['5', '6', '7', '8', '9'],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80'
    ]
  },
  {
    title: 'Layered Gold-Plated Necklace Set',
    description:
      'A delicate layered necklace set in 18K gold plating, designed to be worn alone or stacked. Tarnish-resistant coating for everyday use.',
    price: 1299,
    discountPercentage: 0,
    category: 'womens-jewellery',
    brand: 'Maison Belle',
    stock: 70,
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
    ]
  },
  {
    title: "Women's Rose Gold Analog Watch",
    description:
      'A slim analog watch with a rose gold mesh strap and a minimal dial. Lightweight enough to wear all day without feeling bulky.',
    price: 2799,
    discountPercentage: 15,
    category: 'womens-watches',
    brand: 'Chronotime',
    stock: 33,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=80'
    ]
  },
  {
    title: 'Classic Aviator Sunglasses',
    description:
      'UV400-protected aviator sunglasses with a metal frame and polarised lenses that cut glare without distorting colour.',
    price: 999,
    discountPercentage: 20,
    category: 'sunglasses',
    brand: 'Urban Thread',
    stock: 90,
    rating: 4.2,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80'
    ]
  },

  // ---- Electronics ----
  {
    title: '14-inch Ultraslim Laptop',
    description:
      'A lightweight 14-inch laptop with a full-HD IPS display, 16GB RAM and a 512GB SSD. Boots in seconds and handles everyday multitasking without breaking a sweat.',
    price: 54999,
    discountPercentage: 8,
    category: 'laptops',
    brand: 'NimbusTech',
    stock: 22,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
    ]
  },
  {
    title: 'Pro 5G Smartphone, 128GB',
    description:
      'A 5G-ready smartphone with a 6.5-inch AMOLED display, triple rear camera setup and all-day battery life. Comes with 128GB storage and 8GB RAM.',
    price: 22999,
    discountPercentage: 12,
    category: 'smartphones',
    brand: 'NimbusTech',
    stock: 41,
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'
    ]
  },
  {
    title: '10.5-inch Tablet with Stylus',
    description:
      'A versatile 10.5-inch tablet with a bundled stylus, ideal for note-taking, sketching and streaming. 64GB storage with expandable memory support.',
    price: 17999,
    discountPercentage: 5,
    category: 'tablets',
    brand: 'NimbusTech',
    stock: 30,
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80'
    ]
  },
  {
    title: 'Wireless Charging Stand',
    description:
      'A fast wireless charging stand that props your phone at a viewing angle while it charges. Compatible with all Qi-enabled phones.',
    price: 1199,
    discountPercentage: 0,
    category: 'mobile-accessories',
    brand: 'NimbusTech',
    stock: 110,
    rating: 4.1,
    images: [
      'https://images.unsplash.com/photo-1591290619762-1b75ee52e2a0?w=800&q=80'
    ]
  },

  // ---- Home & Kitchen ----
  {
    title: 'Mid-Century Accent Armchair',
    description:
      'A solid-wood armchair with tapered legs and a plush fabric cushion. Brings a warm, retro touch to any living room corner.',
    price: 12999,
    discountPercentage: 10,
    category: 'furniture',
    brand: 'Woodcraft Studio',
    stock: 15,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'
    ]
  },
  {
    title: 'Handwoven Jute Area Rug',
    description:
      'A natural jute rug, handwoven for a textured, earthy look. Adds warmth underfoot in living rooms and bedrooms alike.',
    price: 2999,
    discountPercentage: 0,
    category: 'home-decoration',
    brand: 'Woodcraft Studio',
    stock: 25,
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80'
    ]
  },
  {
    title: 'Ceramic Table Lamp with Linen Shade',
    description:
      'A handcrafted ceramic base paired with a soft linen shade, giving off a warm, diffused glow. A calming addition to a bedside table or reading nook.',
    price: 1899,
    discountPercentage: 15,
    category: 'home-decoration',
    brand: 'Woodcraft Studio',
    stock: 34,
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1543198126-43e7fb1923b6?w=800&q=80'
    ]
  },
  {
    title: 'Non-Stick Cookware Set, 5 Pieces',
    description:
      'A 5-piece non-stick cookware set with heat-resistant handles, suitable for gas and induction tops. Easy to clean and built to last.',
    price: 2499,
    discountPercentage: 22,
    category: 'kitchen-accessories',
    brand: 'HomeFix',
    stock: 48,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1584990347955-0a4b3a426f5e?w=800&q=80'
    ]
  },
  {
    title: 'Stainless Steel Insulated Water Bottle',
    description:
      'Double-walled insulated bottle that keeps drinks cold for 24 hours or hot for 12. Leak-proof lid, fits most car cup holders.',
    price: 699,
    discountPercentage: 0,
    category: 'kitchen-accessories',
    brand: 'HomeFix',
    stock: 130,
    rating: 4.2,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80'
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB, seeding products...');

    await Product.deleteMany({});
    const created = await Product.insertMany(products);

    console.log(`Inserted ${created.length} products.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
