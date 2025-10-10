import React from "react";
import { Link } from "react-router-dom";
import { FilePlus, Eye } from "lucide-react";

const CitizenDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white font-sora">
          Welcome, Citizen! 
        </h1>
        <p className="text-gray-600 dark:text-gray-300 font-inter text-lg">
          Manage your civic issues are  efficiently — report new problems or track existing ones.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl w-full">
        {/* Report Issue Card */}
        <Link
          to="/report-issues"
          className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <FilePlus size={48} className="text-blue-600 dark:text-blue-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white font-sora">
            Report New Issue
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center font-inter">
            Submit a civic issue easily and ensure it reaches the right department.
          </p>
        </Link>

        {/* Track Issues Card */}
        <Link
          to="/track-issues"
          className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <Eye size={48} className="text-green-600 dark:text-green-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white font-sora">
            Track My Issues
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center font-inter">
            View the status of your reported issues and provide feedback on resolved ones.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default CitizenDashboard;
