import './QuantityStepper.css'

function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'default' }) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className={`quantity-stepper quantity-stepper--${size}`}>
      <button
        type="button"
        className="quantity-btn"
        onClick={handleDecrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
        </svg>
      </button>
      <span className="quantity-value">{value}</span>
      <button
        type="button"
        className="quantity-btn"
        onClick={handleIncrease}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  )
}

export default QuantityStepper
