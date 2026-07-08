"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function RegisterPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !role) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Registration validation successful!");
  }

  return (
    <div>
      <Navbar />

      <h1>Registration</h1>

      <form onSubmit={handleRegister}>

        <Input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <Input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <br /><br />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option>Buyer</option>
          <option>Real Estate Agent</option>
          <option>Legal Reviewer</option>
          <option>Financial Institution</option>
          <option>Administrator</option>
        </select>

        <br /><br />

        <Button text="Register" type="submit" />

      </form>
    </div>
  );
}