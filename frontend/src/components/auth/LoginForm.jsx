import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

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

    if (!form.role) {
      newErrors.role = "Please select your role";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log(form);

  };

  return (
    <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl border border-slate-800">

      <h2 className="text-3xl font-bold text-center text-white">
        Welcome Back
      </h2>

      <p className="text-center text-slate-400 mt-2">
        Login to continue
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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
            <p className="text-red-400 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-slate-200 mb-2">
            Password
          </label>

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
            <p className="text-red-400 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm text-slate-200 mb-2">
            Select Role
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-3 text-white focus:border-teal-500 outline-none"
          >
            <option value="">Select your role</option>
            <option value="Buyer">Buyer</option>
            <option value="Real Estate Agent">Real Estate Agent</option>
            <option value="Legal Reviewer">Legal Reviewer</option>
            <option value="Financial Institution">Financial Institution</option>
            <option value="Administrator">Administrator</option>
          </select>

          {errors.role && (
            <p className="text-red-400 text-sm mt-1">
              {errors.role}
            </p>
          )}
        </div>

        {/* Remember & Forgot */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" />
            Remember Me
          </label>

          <button
            type="button"
            className="text-teal-400 hover:text-teal-300"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Login
        </button>

        {/* Register */}
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