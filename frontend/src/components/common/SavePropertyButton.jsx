import { useEffect, useState } from "react";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";

export const toggleSavedProperty = (property) => {
  const existing = JSON.parse(localStorage.getItem("savedProperties") || "[]");
  const index = existing.findIndex((p) => p.id === property.id);

  let updated;
  if (index >= 0) {
    updated = existing.filter((p) => p.id !== property.id);
  } else {
    updated = [...existing, property];
  }

  localStorage.setItem("savedProperties", JSON.stringify(updated));
  // Notifies the Sidebar to update instantly without refreshing the page
  window.dispatchEvent(new Event("savedPropertiesUpdated"));
  return index < 0; 
};

const SavePropertyButton = ({ property, className = "" }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!property?.id) return;
    const existing = JSON.parse(localStorage.getItem("savedProperties") || "[]");
    setIsSaved(existing.some((p) => p.id === property.id));
  }, [property]);

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevents opening property details when clicking save
    if (!property?.id) return;
    const saved = toggleSavedProperty(property);
    setIsSaved(saved);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isSaved ? "Remove from Saved" : "Save Property"}
      className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm ${
        isSaved
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-white/90 text-gray-600 hover:text-blue-600 hover:bg-white"
      } ${className}`}
    >
      {isSaved ? <HiBookmark className="text-lg" /> : <HiOutlineBookmark className="text-lg" />}
    </button>
  );
};

export default SavePropertyButton;