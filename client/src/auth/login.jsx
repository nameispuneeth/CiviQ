import React, { useState } from "react";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // "user" or "admin"
  const [loggedIn, setLoggedIn] = useState(null);

  // Dummy data for user and admin
  const dummyUser = {
    name: "Javeed Shaik",
    email: "user@example.com",
    issues: [
      { id: 1, title: "Pothole on street", status: "Pending" },
      { id: 2, title: "Streetlight not working", status: "Resolved" },
    ],
  };

  const dummyAdmin = {
    name: "Admin",
    email: "admin@example.com",
    dashboard: [
      { id: 101, title: "Garbage near school", status: "Pending" },
      { id: 102, title: "Water leakage", status: "In Progress" },
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 In real backend: send { email, password, role } to server for verification
    // Example backend logic:
    // POST /auth/login  { email, password }
    // → return { token, role }
    // Save token in localStorage/session

    if (role === "user" && email === "user@example.com" && password === "123") {
      setLoggedIn({ role: "user", data: dummyUser });
    } else if (
      role === "admin" &&
      email === "admin@example.com" &&
      password === "123"
    ) {
      setLoggedIn({ role: "admin", data: dummyAdmin });
    } else {
      alert("Invalid credentials (use user@example.com / admin@example.com with 123)");
    }
  };

  // If logged in, show different dashboards
  if (loggedIn) {
    if (loggedIn.role === "user") {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold">Welcome {loggedIn.data.name}</h2>
          <p>Email: {loggedIn.data.email}</p>
          <h3 className="mt-4 text-lg font-semibold">Your Issues:</h3>
          <ul>
            {loggedIn.data.issues.map((i) => (
              <li key={i.id}>
                {i.title} — <b>{i.status}</b>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (loggedIn.role === "admin") {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <h3 className="mt-4 text-lg font-semibold">Reported Issues:</h3>
          <ul>
            {loggedIn.data.dashboard.map((i) => (
              <li key={i.id}>
                {i.title} — <b>{i.status}</b>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }

  // Login / Signup form
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isSignup ? "Signup" : "Login"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Role Selector */}
          <label className="block mb-3">
            Role:
            <select
              className="ml-2 border rounded p-1"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isSignup ? "Signup" : "Login"}
          </button>
        </form>

        <p
          className="mt-4 text-blue-500 cursor-pointer"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don’t have an account? Signup"}
        </p>
      </div>
    </div>
  );
}
