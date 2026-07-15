export default function Button({ text, type = "button", onClick, className = "", disabled = false, children }) {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`btn-primary ${className}`}
    >
      {children || text}
    </button>
  );
}