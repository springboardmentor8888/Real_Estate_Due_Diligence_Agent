export default function SavedPropertyCard({
  image,
  title,
  location,
  price,
}) {
  return (
    <div className="property-card">

      <img
        src={image}
        alt={title}
      />

      <h3>{title}</h3>

      <p>{location}</p>

      <span>{price}</span>

    </div>
  );
}