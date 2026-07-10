function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-700 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">
          Real Estate Due Diligence
        </h1>

        <button className="bg-white text-blue-700 px-4 py-2 rounded">
          Logout
        </button>
      </nav>

      {/* Dashboard Content */}
      <div className="p-8">

        <h2 className="text-3xl font-bold mb-6">
          Welcome, Rama Charan 👋
        </h2>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-gray-500">
              Total Properties
            </h3>

            <p className="text-3xl font-bold">
              24
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-gray-500">
              Reports Generated
            </h3>

            <p className="text-3xl font-bold">
              12
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-gray-500">
              Risk Alerts
            </h3>

            <p className="text-3xl font-bold text-red-500">
              3
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;