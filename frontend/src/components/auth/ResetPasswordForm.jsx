import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";

function ResetPasswordForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
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

    if (!form.password.trim()) {
      newErrors.password = "New password is required";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log(form);

    alert("Password Reset Successfully!");

    navigate("/login");
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8">

      <h2 className="text-3xl font-bold text-center text-white">
        Reset Password
      </h2>

      <p className="mt-2 text-center text-slate-400">
        Create your new password.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">

        {/* New Password */}

        <div>
          <label className="block text-sm text-slate-200 mb-2">
            New Password
          </label>

          <div className="relative">

            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-10 pr-10 text-white outline-none focus:border-teal-500"
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
            <p className="mt-1 text-sm text-red-400">
              {errors.password}
            </p>
          )}

        </div>

        {/* Confirm Password */}

        <div>
          <label className="block text-sm text-slate-200 mb-2">
            Confirm Password
          </label>

          <div className="relative">

            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-10 pr-10 text-white outline-none focus:border-teal-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showConfirmPassword ? (
                <HiOutlineEyeSlash />
              ) : (
                <HiOutlineEye />
              )}
            </button>

          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">
              {errors.confirmPassword}
            </p>
          )}

        </div>

        {/* Reset Button */}

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700"
        >
          Reset Password
        </button>

        {/* Back */}

        <p className="text-center text-sm text-slate-300">
          <Link
            to="/login"
            className="text-teal-400 font-medium hover:underline"
          >
            ← Back to Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default ResetPasswordForm;