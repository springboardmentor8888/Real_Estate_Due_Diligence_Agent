import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        🏢 Diligence Agent
      </Link>

      <div className="navbar-links">
        <Link href="/explore" className="navbar-link">
          Explore
        </Link>
        <Link href="/login" className="navbar-link">
          Login
        </Link>
        <Link href="/register" className="navbar-link">
          Register
        </Link>
        <Link href="/profile" className="navbar-btn">
          Profile Dashboard
        </Link>
      </div>
    </nav>
  );
}