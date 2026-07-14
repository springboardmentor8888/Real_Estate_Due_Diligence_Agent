"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Button from "../../components/Button";

import "./login.css";


export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  function handleLogin(e) {

    e.preventDefault();

    if(email === "" || password === "") {
      alert("Please fill all fields");
      return;
    }

    alert("Login successful!");
  }


  return (

    <div className="login-page">

      <Navbar />


      <div className="login-container">


        <div className="login-card">


          <h1>
            Welcome Back
          </h1>


          <p className="subtitle">
            Sign in to access your Real Estate Due Diligence dashboard
          </p>



          <form onSubmit={handleLogin}>


            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />



            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />



            <div className="options">


              <label>
                <input type="checkbox"/>
                Remember me
              </label>



              <a href="#">
                Forgot Password?
              </a>


            </div>



            <Button
              text="Login"
              type="submit"
            />



            <p className="signup">

              Don't have an account?

              <a href="/register">
                Sign Up
              </a>

            </p>


          </form>


        </div>


      </div>


    </div>

  );
}