import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";

function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 1. Form state initialized with standardized role value 'BUYER'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "BUYER",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Submit API Call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Standardize role string before sending to Spring Boot backend
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role, // Ensures string like 'AGENT' or 'BUYER'
      };

      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration Success:", data);

      // Optional: Store registration info if backend returns token/user immediately
      if (data.user || data.role) {
        const userRole = data.role || payload.role;
        localStorage.setItem("role", userRole);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user || {
              name: payload.name,
              email: payload.email,
              role: userRole,
            },
          ),
        );
      }

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.message || "Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-white">
        Create Account
      </h2>

      <p className="mt-2 text-center text-slate-400">
        Register to access the platform
      </p>

      {error && (
        <div className="mt-4 p-3 rounded bg-red-500/20 border border-red-500 text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Full Name */}
        <div>
          <label className="block mb-2 text-sm text-slate-200">Full Name</label>
          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-white outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm text-slate-200">
            Email Address
          </label>
          <div className="relative">
            <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-white outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Role Select Dropdown (Fixed option values) */}
        <div>
          <label className="block mb-2 text-sm text-slate-200">
            Select Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 px-3 text-white outline-none focus:border-teal-500"
          >
            <option value="BUYER">Buyer</option>
            <option value="REAL_ESTATE_AGENT">Real Estate Agent</option>
            <option value="LEGAL_REVIEWER">Legal Reviewer</option>
            <option value="FINANCIAL_INSTITUTION">Financial Institution</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-sm text-slate-200">Password</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-10 text-white outline-none focus:border-teal-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-2 text-sm text-slate-200">
            Confirm Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-10 text-white outline-none focus:border-teal-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showConfirm ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
            </button>
          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-teal-600 py-2.5 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-teal-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
