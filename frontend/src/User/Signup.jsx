import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './whole.css';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, email, password };

    try {
      const result = await axios.post("http://localhost:4000/signup", payload);
      console.log("Signup response:", result.data);

      if (result.data.Status === "Success") {
        alert("✅ Account created successfully!");
        navigate("/login");
      } else {
        alert(result.data.message || "❌ Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response && err.response.data) {
        alert(err.response.data.message || "❌ Error: Signup failed.");
      } else {
        alert("❌ Network Error: Make sure server is running.");
      }
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="high2">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className='space'>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Your Name"
            />
          </div>
          <div className='space'>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="you@example.com"
            />
          </div>
          <div className='space'>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Enter a strong password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-black py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button onClick={goToLogin} className="text-indigo-500 hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
