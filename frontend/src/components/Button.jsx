export default function Button({ text, type = "button" }) {
  return (
    <button type={type}>
      {text}
    </button>
  );
}