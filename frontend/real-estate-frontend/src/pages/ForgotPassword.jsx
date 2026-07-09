import { Link } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    console.log(email);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/register-bg.jpg')"
      }}
    >
      <div className="bg-white/95 p-8 rounded-xl shadow-2xl w-96 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your registered email address to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Remember your password?
          <Link
           to="/login"
           className="text-blue-600 cursor-pointer ml-1"
           >
           Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;