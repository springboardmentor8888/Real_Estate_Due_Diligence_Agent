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
    className="min-h-screen flex items-center
   justify-center bg-cover
   bg-center"
    style={{
    backgroundImage: "url('/register-bg.jpg')"
  }}
>
    <div className="bg-white/95 p-8 rounded-xl shadow-2xl w-[430px] max-h-[90vh] overflow-y-auto backdrop-blur-sm">
      <h1 className="text-3xl font-bold text-center mb-6">
       Create Account
      </h1>
      <form onSubmit={handleSubmit}>

       <div className="mb-4">
       <label className="block mb-1 font-medium">
         First Name
      </label>
      <input
       type="text"
       name="firstName"
       value={formData.firstName}
       onChange={handleChange}
       placeholder="Enter First Name"
       className="w-full border p-3 rounded-lg"
     />
    </div>
      <div className="mb-4">
      <label className="block mb-1 font-medium">
       Last Name
      </label>

      <input
       type="text"
       name="lastName"
       value={formData.lastName}
       onChange={handleChange}
       placeholder="Enter Last Name"
       className="w-full border p-3 rounded-lg"
     />
     </div>
     <div className="mb-4">
       <label className="block mb-1 font-medium">
         Phone Number
        </label>
        <input
         type="tel"
         name="phone"
         value={formData.phone}
         onChange={handleChange}
         placeholder="Enter Phone Number"
         className="w-full border p-3 rounded-lg"
       />
     </div>

        <div className="mb-4">
           <label className="block mb-1 font-medium">
             Email
           </label>

          <input
           type="email"
           name="email"
           value={formData.email}
           onChange={handleChange}
           placeholder="Enter Email"
           className="w-full border p-3 rounded-lg"
         />
       </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Password
          </label>

         <input
           type="password"
           name="password"
           value={formData.password}
           onChange={handleChange}
           placeholder="Enter Password"
           className="w-full border p-3 rounded-lg"
         />
    </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
           Confirm Password
         </label>

         <input
           type="password"
           name="confirmPassword"
           value={formData.confirmPassword}
           onChange={handleChange}
           placeholder="Confirm Password"
           className="w-full border p-3 rounded-lg"
         />
       </div>

        <div className="mb-4">
            <label className="block mb-1 font-medium">
             Role
           </label>

            <select
             name="role"
             value={formData.role}
             onChange={handleChange}
             className="w-full border p-3 rounded-lg"
             >
             <option value="">Select Role</option>
             <option value="BUYER">Buyer</option>
             <option value="AGENT">Real Estate Agent</option>
             <option value="LEGAL_REVIEWER">Legal Reviewer</option>
             <option value="FINANCIAL_INSTITUTION">Financial Institution</option>
           </select>
         </div>

        <button
         type="submit"
         className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
         >
         Register
        </button>

      </form>
       <p className="text-center mt-4 text-gray-600">
       Already have an account?
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

export default Register;