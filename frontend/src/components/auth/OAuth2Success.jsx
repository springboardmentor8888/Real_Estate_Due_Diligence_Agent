import { useEffect } from "react";

function OAuth2Success() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const role = params.get("role");
    const email = params.get("email");
    const name = params.get("name");

    if (token) {
      localStorage.clear();

      const cleanRole = String(role || "BUYER")
        .replace(/^ROLE_/, "")
        .trim()
        .toUpperCase();

      localStorage.setItem("token", token);
      localStorage.setItem("role", cleanRole);
      localStorage.setItem("userRole", cleanRole);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          email,
          role: cleanRole,
        }),
      );

      window.location.replace("/dashboard");
      return;
    }

    window.location.replace("/login");
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-white">
      Signing you in...
    </div>
  );
}

export default OAuth2Success;
