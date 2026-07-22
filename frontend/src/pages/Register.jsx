import RegisterForm from "../components/auth/RegisterForm";
import {
  HiShieldCheck,
  HiBuildingOffice2,
  HiDocumentCheck,
  HiUserGroup,
} from "react-icons/hi2";

const features = [
  { icon: HiShieldCheck, text: "Secure Authentication" },
  { icon: HiBuildingOffice2, text: "Property Verification" },
  { icon: HiDocumentCheck, text: "Legal Record Validation" },
  { icon: HiUserGroup, text: "Role-Based Access" },
];

function Register() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-5xl grid md:grid-cols-[1fr_1fr] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

        {/* Left Section */}

        <div className="p-8 md:p-10 flex flex-col justify-center">

          <h2 className="text-3xl md:text-2xl font-bold text-teal-400">
            Real Estate Due Diligence Agent
          </h2>

          <h1 className="mt-8 text-3xl md:text-4xl font-bold text-white leading-tight">
            Secure Property
            <br />
            Verification
          </h1>

          <p className="mt-5 text-slate-300 leading-7">
            Access verified ownership records, legal documents,
            tax history and property information
            through one secure platform.
          </p>

          <div className="mt-8 space-y-3">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={index} className="flex items-center gap-3">
                  <Icon className="text-teal-400" size={22} />
                  <span className="text-slate-200">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Section */}

        <div className="flex items-center justify-center border-l border-slate-800 p-10">

          <RegisterForm />

        </div>

      </div>
    </div>
  );
}

export default Register;