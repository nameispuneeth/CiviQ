import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

const dummyDepartments = [
  {
    name: "Roads Department",
    head: "Rajesh Kumar",
    contact: "roads@citygov.in",
    categoriesHandled: ["roads", "traffic", "potholes", "sidewalks"],
  },
  {
    name: "Street Lighting Department",
    head: "Anita Sharma",
    contact: "lighting@citygov.in",
    categoriesHandled: ["lighting", "streetlights", "public lamps", "signal lights"],
  },
  {
    name: "Sanitation Department",
    head: "Vikram Singh",
    contact: "sanitation@citygov.in",
    categoriesHandled: ["sanitation", "garbage", "waste", "sewage", "cleanliness"],
  },
  {
    name: "Parks & Recreation Department",
    head: "Priya Reddy",
    contact: "parks@citygov.in",
    categoriesHandled: ["parks", "recreation", "gardens", "playgrounds", "green spaces"],
  },
  {
    name: "Traffic Management Department",
    head: "Suresh Patel",
    contact: "traffic@citygov.in",
    categoriesHandled: ["traffic", "parking", "signals", "congestion", "road safety"],
  },
  {
    name: "Water & Utilities Department",
    head: "Meena Iyer",
    contact: "water@citygov.in",
    categoriesHandled: ["water", "utilities", "sewage", "leakage", "pipes"],
  },
  {
    name: "General Issues Department",
    head: "Arun Chatterjee",
    contact: "other@citygov.in",
    categoriesHandled: ["other", "miscellaneous", "public grievances", "citizen complaints"],
  },
];

const Departments = ({ theme }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    setDepartments(dummyDepartments);
  }, []);

  const { isDark } = useContext(ThemeContext);

  return (
    <div
      className={` p-1 transition-colors duration-300
    ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <h2 className={`text-4xl font-extrabold mb-10 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
        City Departments
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept) => (
          <div
            key={dept.name}
            className={`relative rounded-2xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105
          ${isDark
                ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white"
                : "bg-white text-gray-900"} 
        `}
          >
            {/* Top colored accent */}
            <div className={`absolute top-0 left-0 w-full h-2 
          ${isDark ? "bg-indigo-500" : "bg-blue-500"}`}></div>

            <div className="py-2 px-5 pt-4 pb-5">
              <h4 className="text-2xl font-bold mb-3">{dept.name}</h4>
              <p className="text-sm text-gray-700 mb-1">{`Head: ${dept.head}`}</p>
              <p className="text-sm text-gray-700 mb-4">{`Email: ${dept.contact}`}</p>

              <span className="font-semibold block mb-2 text-gray-200">Problems Solved:</span>
              <div className="flex flex-wrap gap-2">
                {dept.categoriesHandled.map((cat, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition
                  ${isDark
                        ? "bg-gray-700 text-white hover:bg-indigo-500 hover:text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>



  );
};

export default Departments;
