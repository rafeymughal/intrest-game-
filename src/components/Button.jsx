function Button({ children, variant = 'primary', onClick, type = 'button' }) {
  return (
    <button className={`button ${variant}`} type={type} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
