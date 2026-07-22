import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEnvelope } from "react-icons/hi2";

function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    console.log(email);

    navigate("/verify-otp");
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8">

      <h2 className="text-3xl font-bold text-center text-white">
        Forgot Password
      </h2>

      <p className="mt-2 text-center text-slate-400">
        Enter your registered email to receive an OTP.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">

        <div>

          <label className="block mb-2 text-sm text-slate-200">
            Email Address
          </label>

          <div className="relative">

            <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-10 pr-3 text-white outline-none focus:border-teal-500"
            />

          </div>

          {error && (
            <p className="mt-1 text-sm text-red-400">
              {error}
            </p>
          )}

        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700"
        >
          Send OTP
        </button>

        <p className="text-center">

          <Link
            to="/login"
            className="text-teal-400 hover:underline"
          >
            ← Back to Login
          </Link>

        </p>

      </form>

    </div>
  );
}

export default ForgotPasswordForm;