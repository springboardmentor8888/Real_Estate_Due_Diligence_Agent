import Navbar from "../../components/Navbar";
import Button from "../../components/Button";

export default function ProfilePage() {
  return (
    <div>
      <Navbar />

      <h1>User Profile</h1>

      <p><strong>Name:</strong> User Name</p>
      <p><strong>Email:</strong> user@example.com</p>
      <p><strong>Role:</strong> Buyer</p>

      <br />

      <Button text="Edit Profile" />
    </div>
  );
}