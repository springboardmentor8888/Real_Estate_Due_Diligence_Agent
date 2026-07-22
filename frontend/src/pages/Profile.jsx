import ProfileCard from "../components/auth/ProfileCard";

function Profile() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-lg">

        <div className="mb-6 text-center">

          <h1 className="text-3xl font-bold text-teal-400">
            User Profile
          </h1>

          <p className="mt-2 text-slate-300">
            View and manage your account information.
          </p>

        </div>

        <ProfileCard
            name="Harry Harry"
            email="harry@gmail.com"
            phone="+91 90000 00000"
            role="Buyer"
            status="Active"
        />

      </div>

    </div>
  );
}

export default Profile;