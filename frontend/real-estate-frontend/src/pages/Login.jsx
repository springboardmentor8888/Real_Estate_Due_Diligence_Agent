import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService";

function Login() {

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!loginData.email) {
    alert("Please enter your email");
    return;
  }

  if (!loginData.email.includes("@")) {
    alert("Please enter a valid email");
    return;
  }

  if (!loginData.password) {
    alert("Please enter your password");
    return;
  }

  if (loginData.password.length < 8) {
    alert("Password must be at least 8 characters");
    return;
  }

  try {
    const response = await loginUser({
      email: loginData.email,
      password: loginData.password,
    });

    console.log(response.data);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));

    alert("Login Successful!");

    navigate("/dashboard");
  } catch (error) {
    console.error(error);

    if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Unable to connect to the backend.");
    }
  }
};

  return (
   <div
  className="relative min-h-screen flex items-center justify-end bg-cover bg-center overflow-hidden px-20"
  style={{
    backgroundImage: "url('myhome.jpg')",
  }}
>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Glass Glow Effects */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      {/* Login Card */}
      <div
        className="relative z-10 w-96 p-8 rounded-3xl
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          {showForgotPassword ? "Forgot Password" : "Login"}
        </h1>

        {!showForgotPassword ? (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl mb-4
              bg-white/10
              border border-white/20
              text-white
              placeholder-gray-300
              backdrop-blur-md
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl mb-6
              bg-white/10
              border border-white/20
              text-white
              placeholder-gray-300
              backdrop-blur-md
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-400"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl
              bg-cyan-500
              hover:bg-cyan-600
              text-white
              font-semibold
              transition-all
              duration-300
              hover:scale-105"
            >
              Login
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (!loginData.email) {
                alert("Please enter your email");
                return;
              }

              if (!loginData.email.includes("@")) {
                alert("Please enter a valid email");
                return;
              }

              alert("Reset link sent successfully!");
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={loginData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl mb-4
              bg-white/10
              border border-white/20
              text-white
              placeholder-gray-300
              backdrop-blur-md
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-400"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl
              bg-cyan-500
              hover:bg-cyan-600
              text-white
              font-semibold
              transition-all
              duration-300
              hover:scale-105"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full mt-5 text-cyan-300 hover:text-white"
            >
              Back to Login
            </button>
          </form>
        )}

        {!showForgotPassword && (
          <p className="text-center mt-5">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-cyan-300 hover:text-white"
            >
              Forgot Password?
            </button>
          </p>
        )}

        {!showForgotPassword && (
          <p className="text-center mt-3 text-gray-300">
            Don't have an account?
            <Link
              to="/register"
              className="text-cyan-300 ml-2 hover:text-white"
            >
              Register
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;