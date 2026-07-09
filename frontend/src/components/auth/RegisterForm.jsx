import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="w-full max-w-md">

      <h2 className="text-2xl font-bold text-center text-white">
        Create Account
      </h2>

      <p className="mt-2 text-center text-slate-400">
        Register to access the platform
      </p>

      <form className="mt-6 space-y-4">

        {/* Full Name */}
        <div>
          <label className="block mb-2 text-sm text-slate-200">
            Full Name
          </label>

          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
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
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-white outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block mb-2 text-sm text-slate-200">
            Select Role
          </label>

          <select className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 px-3 text-white outline-none focus:border-teal-500">
            <option>Select your role</option>
            <option>Buyer</option>
            <option>Real Estate Agent</option>
            <option>Legal Reviewer</option>
            <option>Financial Institution</option>
            <option>Administrator</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-sm text-slate-200">
            Password
          </label>

          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
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
          className="w-full rounded-lg bg-teal-600 py-2.5 font-semibold text-white transition hover:bg-teal-700"
        >
          Create Account
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