import { useEffect, useState } from "react";
import ProfileCard from "../components/auth/ProfileCard";

function Profile() {
  const [userData, setUserData] = useState({
    name: "User",
    email: "user@example.com",
    phone: "N/A",
    role: "USER",
    status: "Active",
  });

  useEffect(() => {
    // 🚀 Read dynamic user details from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const storedRole =
      localStorage.getItem("role") ||
      localStorage.getItem("userRole") ||
      storedUser.role ||
      "USER";

    const name =
      storedUser.name ||
      (storedUser.email ? storedUser.email.split("@")[0] : "User");

    setUserData({
      name: name,
      email: storedUser.email || "user@example.com",
      phone: storedUser.phone || "N/A", // Defaults cleanly to "N/A"
      role: storedRole.toUpperCase(),
      status: "Active",
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-teal-400">User Profile</h1>

          <p className="mt-2 text-slate-300">
            View and manage your account information.
          </p>
        </div>

        <ProfileCard
          name={userData.name}
          email={userData.email}
          phone={userData.phone}
          role={userData.role}
          status={userData.status}
        />
      </div>
    </div>
  );
}

export default Profile;