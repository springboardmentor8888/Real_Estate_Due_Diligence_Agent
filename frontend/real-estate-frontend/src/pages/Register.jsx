import { Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/authService";
function Register() {
   const [formData, setFormData] = useState({
     firstName: "",
     lastName: "",
     email: "",
     phone: "",
     password: "",
     confirmPassword: "",
     role: "",
   });

  const handleChange = (e) => {
     const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.firstName) {
   alert("Please enter your first name");
   return;
 }

if (!formData.lastName) {
   alert("Please enter your last name");
   return;
}

if (!formData.phone) {
   alert("Please enter your phone number");
   return;
}

if (!/^[0-9]{10}$/.test(formData.phone)) {
   alert("Phone number must be 10 digits");
   return;
}
  if (!formData.email) {
   alert("Please enter your email");
   return;
}
  if (!formData.email.includes("@")) {
   alert("Please enter a valid email address");
   return;
}
 if (formData.password.length < 8) {
   alert("Password must be at least 8 characters long");
   return;
}
 if (formData.password !== formData.confirmPassword) {
   alert("Passwords do not match");
   return;
}
 if (!formData.role) {
   alert("Please select a role");
   return;
}
  try {
  const response = await registerUser({
  firstName: formData.firstName,
  lastName: formData.lastName,
  email: formData.email,
  phone: formData.phone,
  password: formData.password,
  role: formData.role,
});

  alert("Registration Successful!");
  console.log(response.data);

} catch (error) {
  console.error(error);

  if (error.response) {
    alert(error.response.data.message || "Registration Failed!");
  } else {
    alert("Unable to connect to the backend.");
  }
}
};

  return (
   <div
  className="relative min-h-screen flex items-center justify-end bg-cover bg-center overflow-hidden pr-24"
  style={{
    backgroundImage: "url('myhome.jpg')",
  }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Glow Effect */}
  <div className="absolute -top-24 -left-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>

  <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
   <div
  className="relative z-10 w-[700px] rounded-3xl
  bg-white/10 backdrop-blur-2xl
  border border-white/20
  shadow-2xl
  p-8
  text-white"
>
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
       Create Account
      </h1>
      <form onSubmit={handleSubmit}>

       <div className="grid grid-cols-2 gap-4 mb-5">

  <div>
    <label className="block mb-2">First Name</label>

    <input
      type="text"
      name="firstName"
      value={formData.firstName}
      onChange={handleChange}
      placeholder="Enter First Name"
      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300"
    />
  </div>

  <div>
    <label className="block mb-2">Last Name</label>

    <input
      type="text"
      name="lastName"
      value={formData.lastName}
      onChange={handleChange}
      placeholder="Enter Last Name"
      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300"
    />
  </div>

</div>
     <div className="grid grid-cols-2 gap-4 mb-5">

  <div>
    <label className="block mb-2">Phone Number</label>

    <input
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      placeholder="Phone Number"
      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300"
    />
  </div>

  <div>
    <label className="block mb-2">Email</label>

    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Email"
      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300"
    />
  </div>

</div>

        <div className="grid grid-cols-2 gap-4 mb-5">

  <div>
    <label className="block mb-2">Password</label>

    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Password"
      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300"
    />
  </div>

  <div>
    <label className="block mb-2">Confirm Password</label>

    <input
      type="password"
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      placeholder="Confirm Password"
      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300"
    />
  </div>

</div>
        <div className="mb-6">
  <label className="block mb-2 font-medium text-white">
    Role
  </label>

  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
  >
    <option value="" className="text-black">
      Select Role
    </option>

    <option value="Buyer" className="text-black">
      Buyer
    </option>

    <option value="Real Estate Agent" className="text-black">
      Real Estate Agent
    </option>

    <option value="Legal Reviewer" className="text-black">
      Legal Reviewer
    </option>

    <option value="Financial Institution" className="text-black">
      Financial Institution
    </option>

    <option value="Administrator" className="text-black">
      Administrator
    </option>
  </select>
</div>
       <div className="flex justify-center mt-8">
  <button
    type="submit"
    className="w-64 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-all duration-300 hover:scale-105"
  >
    Register
  </button>
</div>
      </form>
       <p className="text-center mt-6 text-gray-300">
       Already have an account?
       <Link
         to="/login"
         className="text-cyan-300 ml-2 hover:text-white"
         >
         Login
       </Link>
</p>
    </div>
      </div>
  );
}

export default Register;