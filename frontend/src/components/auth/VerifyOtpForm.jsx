import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyOtpForm() {

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    if (otp.length !== 6) return;

    console.log(otp);

    navigate("/reset-password");

  };

  return (

    <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8">

      <h2 className="text-3xl font-bold text-center text-white">
        Verify OTP
      </h2>

      <p className="mt-2 text-center text-slate-400">
        Enter the 6-digit OTP sent to your email.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">

        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 px-3 text-center text-2xl tracking-[8px] text-white outline-none focus:border-teal-500"
        />

        <button
          className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700"
        >
          Verify OTP
        </button>

      </form>

    </div>

  );

}

export default VerifyOtpForm;