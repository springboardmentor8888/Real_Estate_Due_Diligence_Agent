import LoginForm from "../components/auth/LoginForm";
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

function Login() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-5xl grid md:grid-cols-[0.95fr_1.05fr] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

        {/* Left */}

        <div className="p-8 md:p-10 flex flex-col justify-center">

          <h2 className="text-3xl md:text-2xl font-bold text-teal-400 leading-tight">
            Real Estate Due Diligence Agent
          </h2>
          
          <h1 className="mt-5 text-4xl font-bold leading-tight text-white">
            Verify Ownership
            <br />
            Validate Trust.
          </h1>

          <p className="mt-5 text-slate-300 leading-7">
            Verify ownership records, legal documents,
            tax history and property information
            through one secure platform.
          </p>

          <div className="mt-8 space-y-4">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <Icon
                    className="text-teal-400"
                    size={22}
                  />

                  <span className="text-slate-200">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right */}

        <div className="flex items-center justify-center p-8">

          <LoginForm />

        </div>

      </div>
    </div>
  );
}

export default Login;