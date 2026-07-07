export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-black">
        Real Estate Due Diligence Agent
      </h1>

      <p className="mt-4 text-lg text-gray-600">
        AI-powered property document analysis system
      </p>

      <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg">
        Upload Property Documents
      </button>
    </main>
  );
}