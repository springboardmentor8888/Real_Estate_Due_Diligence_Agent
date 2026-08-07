import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "register_first") {
      setServerError("No account found. Please register first.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        form
      );

      if (response.data && response.data.token) {
        const emailKey = form.email.toLowerCase().trim();

        // 1. Read registered role cache BEFORE clearing localStorage
        const registeredRolesCache = JSON.parse(
          localStorage.getItem("registeredRolesCache") || "{}"
        );
        const cachedRole = registeredRolesCache[emailKey];

        // 2. Clear session tokens safely
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");

        const token = response.data.token;

        // 3. Extract raw role from backend response
        let rawRole =
          response.data.role ||
          response.data.userRole ||
          response.data.user?.role ||
          "";

        // Handle nested role objects
        if (typeof rawRole === "object" && rawRole !== null) {
          rawRole = rawRole.roleName || rawRole.authority || rawRole.name || "";
        }

        // Clean formatting (e.g. "ROLE_LEGAL_REVIEWER" -> "LEGAL_REVIEWER")
        let cleanRole = String(rawRole)
          .replace(/^ROLE_/, "")
          .trim()
          .toUpperCase()
          .replace(/\s+/g, "_");

        // 4. Smart Fallback: Use cached registration role if backend returned empty, USER, or BUYER
        if ((!cleanRole || cleanRole === "USER" || cleanRole === "BUYER") && cachedRole) {
          cleanRole = cachedRole;
        }

        // Ultimate default
        if (!cleanRole || cleanRole === "USER") {
          cleanRole = "BUYER";
        }

        // 5. Build normalized user object
        const userObj = {
          email: response.data.email || form.email,
          name:
            response.data.name ||
            response.data.user?.name ||
            form.email.split("@")[0],
          role: cleanRole,
        };

        // 6. Store synchronized keys across localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", cleanRole);
        localStorage.setItem("userRole", cleanRole);
        localStorage.setItem("user", JSON.stringify(userObj));

        // Preserve role cache for subsequent logins
        localStorage.setItem("registeredRolesCache", JSON.stringify(registeredRolesCache));

        // 7. Redirect to Dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      if (err.response && err.response.status === 401) {
        setServerError("Invalid email or password.");
      } else {
        setServerError("Connection error. Make sure Spring Boot is running!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl border border-slate-800">
      <h2 className="text-3xl font-bold text-center text-white">
        Welcome Back
      </h2>

      <p className="text-center text-slate-400 mt-2">Login to continue</p>

      {/* Backend API Error Banner */}
      {serverError && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm text-slate-200 mb-2">
            Email Address
          </label>

          <div className="relative">
            <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-3 text-white focus:border-teal-500 outline-none"
            />
          </div>

          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-slate-200 mb-2">Password</label>

          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-10 text-white focus:border-teal-500 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" />
            Remember Me
          </label>

          <Link
            to="/forgot-password"
            className="text-teal-400 hover:text-teal-300"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-slate-700"></div>

          <span className="px-3 text-slate-400 text-sm">OR</span>

          <div className="flex-1 border-t border-slate-700"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 py-3 rounded-lg font-medium transition"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        {/* Register Link */}
        <p className="text-center text-slate-300 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-teal-400 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;