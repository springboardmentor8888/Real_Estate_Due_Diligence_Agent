import { HiOutlineUserCircle } from "react-icons/hi2";

function ProfileCard({
  name,
  email,
  phone,
  role,
  status,
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      {/* Avatar */}
      <div className="flex flex-col items-center">

        <HiOutlineUserCircle
          className="text-teal-400"
          size={90}
        />

        <h2 className="mt-4 text-2xl font-bold text-white">
          {name}
        </h2>

        <p className="text-slate-400">
          {role}
        </p>

      </div>

      {/* Details */}
      <div className="mt-8 grid grid-cols-2 gap-6">

        <div>
          <p className="text-sm text-slate-400">
            Email
          </p>

          <p className="mt-1 text-white break-all">
            {email}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Phone
          </p>

          <p className="mt-1 text-white">
            {phone}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Role
          </p>

          <p className="mt-1 text-white">
            {role}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Status
          </p>

          <span className="mt-1 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
            {status}
          </span>
        </div>

      </div>

      {/* Button */}
      <button
        className="mt-8 w-full rounded-lg bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700"
      >
        Update Profile
      </button>

    </div>
  );
}

export default ProfileCard;