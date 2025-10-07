import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!name){
      alert("User Name Is Required");
      return;
    }
    if(!password){
      alert("Email Is Required");
      return;
    }
    if(!email){
      alert("Password Is Required");
      return;
    }
    const response=await fetch("http://localhost:8000/api/register",{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        name:name,
        email:email,
        password:password
      })
    })
    const data=await response.json();
    console.log(data);
    if(data.status=="ok"){
      navigate("/");
    }else{
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl w-96 p-8 relative overflow-hidden">
        {/* Decorative top-right gradient circle */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full opacity-30"></div>
        {/* Decorative bottom-left gradient circle */}
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full opacity-30"></div>

        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold text-lg shadow-md hover:scale-105 transform transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-purple-500 font-semibold cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
