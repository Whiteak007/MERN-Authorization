// pages/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

const SignUp = () => {
  const navigate = useNavigate();
  const [signUpInfo, setSignUpInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3000/api/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpInfo),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        handleSuccess(result.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        handleError(result.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      handleError("Network error. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="mt-2 opacity-90">Join us today and get started</p>
            </div>
            
            <form onSubmit={handleSignup} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    autoFocus
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                    placeholder="John Doe"
                    value={signUpInfo.name}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                    placeholder="your@email.com"
                    value={signUpInfo.email}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                    placeholder="••••••••"
                    value={signUpInfo.password}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-0.5"
              >
                Sign Up
              </button>
              
              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
                >
                  Log in
                </Link>
              </div>
            </form>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-500">
            By signing up, you agree to our Terms and Privacy Policy
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignUp;