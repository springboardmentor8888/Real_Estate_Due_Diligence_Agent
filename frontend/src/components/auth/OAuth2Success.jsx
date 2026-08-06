import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuth2Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/oauth2/success");

      navigate("/dashboard", { replace: true });
      return;
    }
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
      return;
    }

    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      Signing you in...
    </div>
  );
}

export default OAuth2Success;
