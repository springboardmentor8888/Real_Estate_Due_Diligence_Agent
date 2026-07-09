import { Link } from "react-router-dom";
import { useState } from "react";
function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  }
);
const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
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

    console.log(loginData);
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
      className="w-full border p-3 rounded-lg mb-4"
    />

    <input
      type="password"
      name="password"
      placeholder="Password"
      value={loginData.password}
      onChange={handleChange}
      className="w-full border p-3 rounded-lg mb-4"
    />

    <button
      type="submit"
      className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
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
      className="w-full border p-3 rounded-lg mb-4"
    />

    <button
      type="submit"
      className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
    >
      Send Reset Link
    </button>
    <button
     type="button"
     onClick={() => setShowForgotPassword(false)}
     className="w-full mt-4 text-blue-600 hover:underline"
    >
     Back to Login
    </button>

  </form>
)}
        {!showForgotPassword && (
  <p className="text-center mt-4">
    <button
      type="button"
      onClick={() => setShowForgotPassword(true)}
      className="text-blue-600 hover:underline"
    >
      Forgot Password?
    </button>
  </p>
)}

        {!showForgotPassword && (
         <p className="text-center mt-2 text-gray-600">
         Don't have an account?
        <Link
         to="/register"
         className="text-blue-600 ml-1"
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