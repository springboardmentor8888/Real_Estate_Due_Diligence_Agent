import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Mail, ArrowLeft, Send } from "lucide-react";
import Button from "../components/common/Button";
import { showErrorAlert, showSuccessAlert } from "../utils/swal";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      showErrorAlert("Valid Email Required", "Please enter a valid account email address.");
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      setLoading(false);
      await showSuccessAlert(
        "Reset Link Dispatched!",
        `Instructions to reset your password have been sent to ${email}.`
      );
      navigate("/login");
    }, 600);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 overflow-hidden px-4 py-12">
      {/* Subtle Blueprint Grid Background */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-70 pointer-events-none" />

      {/* Soft Radial Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-slate-200">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs mb-3">
              <Building2 size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered work email to receive a recovery link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramacharan@enterprise.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
              icon={Send}
            >
              Send Recovery Link
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;