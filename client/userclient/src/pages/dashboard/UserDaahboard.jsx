import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, Eye, Sun, Moon, Camera } from "lucide-react";
import { ThemeContext } from "../../Context/ThemeContext";
import toast from "react-hot-toast";
import { clearToken } from "../../lib/auth";

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [LoggedIn,setLoggedIn]=useState(localStorage.getItem("token") || sessionStorage.getItem("token"))
  const cards = [
    {
      title: "Report New Issue",
      description: "Submit a civic issue easily and ensure it reaches the right department.",
      icon: <FilePlus size={48} />,
      bg: "from-blue-500 to-blue-700",
      darkBg: "from-blue-700 to-blue-900",
      navigateTo: "/report-issues",
      iconColor: "text-white",
      darkIconColor: "text-white",
    },
    {
      title: "Report with a Photo",
      description: "Just take a picture — we read it and fill in the report for you.",
      icon: <Camera size={48} />,
      bg: "from-cyan-500 to-teal-600",
      darkBg: "from-cyan-700 to-teal-900",
      navigateTo: "/image-report",
      iconColor: "text-white",
      darkIconColor: "text-white",
    },
    {
      title: "Track My Issues",
      description: "View the status of your reported issues and provide feedback on resolved ones.",
      icon: <Eye size={48} />,
      bg: "from-green-400 to-green-600",
      darkBg: "from-green-600 to-green-800",
      navigateTo: "/track-issues",
      iconColor: "text-white",
      darkIconColor: "text-white",
    },
  ];

  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen relative flex flex-col items-center py-8 px-4 sm:px-6`}>
      
      {/* Theme Toggle Button */}
      <button
        onClick={() => toggleTheme(!isDark)}
        className="absolute top-4 right-28 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white shadow-md hover:shadow-lg transition"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <div className="absolute top-4 right-4">
      {LoggedIn?(
         <button
          onClick={() => {
            // clearToken() drops both stores. The old if/else if cleared only
            // one, so a token left in the other kept the user quietly signed in.
            clearToken();
            setLoggedIn(null);
            toast.success("Logged out");
            navigate("/login");
          }}
          className="px-4 py-1 rounded-xl border border-red-500 bg-red-500 text-white hover:bg-red-600 transform transition hover:scale-105"
        >
          Logout
        </button>
       ):(
         <button
          onClick={() => navigate("/login")}
          className="px-4 py-1 rounded-xl border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transform transition hover:scale-105"
        >
          Login
        </button>
       )}
       </div>

      {/* Hero Section */}
      {/* The theme and logout buttons are absolute at top-4 and ~32px tall, so
          they only occupy the first ~48px. A flat 150px was sized for desktop
          and left a dead band on phones — clear the buttons on small screens
          and keep the roomier spacing from sm up. */}
      <div className="max-w-3xl text-center mb-8 sm:mb-12 mt-16 sm:mt-[150px]">
        <h1 className={`text-3xl sm:text-5xl font-bold mb-4 font-sora ${isDark ? "text-white" : "text-gray-900"}`}>
          Welcome, Citizen!
        </h1>
        <p className={`text-base sm:text-lg font-inter ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Your civic dashboard — report problems, track progress, and help improve your community efficiently.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => {
              const token = localStorage.getItem("token") || sessionStorage.getItem("token");
              if (!token) {
                toast.error(`User Have To Login To Access ${card.title}`);
                navigate("/login");
              } else {
                navigate(card.navigateTo);
              }
            }}
            className={`flex flex-col items-center justify-center p-8 cursor-pointer rounded-2xl shadow-xl transform transition-transform hover:-translate-y-2 hover:shadow-2xl border ${isDark ? "border-gray-700" : "border-gray-200"} bg-gradient-to-br ${isDark ? card.darkBg : card.bg}`}
          >
            <div className={`mb-4 ${isDark ? card.darkIconColor : card.iconColor}`}>{card.icon}</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white font-sora">{card.title}</h2>
            <p className="text-center text-sm sm:text-base text-white font-inter">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Additional Section for Community Engagement */}
     
    </div>
  );
};

export default CitizenDashboard;
