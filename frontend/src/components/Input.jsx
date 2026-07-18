export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  required = false,
  name,
  id,
  disabled = false,
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`form-input ${className}`}
      required={required}
      name={name}
      id={id}
      disabled={disabled}
      {...props}
    />
  );
}