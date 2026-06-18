// Formats a number as Indian Rupees, e.g. 1499 -> "₹1,499"
export function formatINR(amount) {
  const value = Number(amount) || 0
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

// Same thing but allows decimals when needed (e.g. tax breakdowns)
export function formatINRDecimal(amount) {
  const value = Number(amount) || 0
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function getDiscountedPrice(product) {
  if (!product) return 0
  if (product.discountPercentage) {
    return Math.round(product.price * (1 - product.discountPercentage / 100))
  }
  return product.price
}
