export default function Navbar() {
  return (
    <nav
      style={{
        padding: "15px",
        backgroundColor: "#2563eb",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h2>Real Estate Due Diligence</h2>

      <div>
        <a
          href="/login"
          style={{ color: "white", marginRight: "20px" }}
        >
          Login
        </a>

        <a
          href="/register"
          style={{ color: "white", marginRight: "20px" }}
        >
          Register
        </a>

        <a
          href="/profile"
          style={{ color: "white" }}
        >
          Profile
        </a>
      </div>
    </nav>
  );
}