import './Loading.css'

function Loading({ message = 'Loading...', inline = false }) {
  return (
    <div className={`loading ${inline ? 'loading-inline' : ''}`}>
      <div className="spinner" />
      <span className="loading-message">{message}</span>
    </div>
  )
}

export default Loading
