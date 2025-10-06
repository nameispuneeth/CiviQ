import React, { useEffect, useState } from "react";

const dummyDepartments = [
  { id: 1, name: "Road Maintenance", head_name: "Alice Smith", email: "road@city.gov" },
  { id: 2, name: "Sanitation", head_name: "Bob Johnson", email: "sanitation@city.gov" },
  { id: 3, name: "Parks & Recreation", head_name: "Carol Lee", email: "parks@city.gov" },
  { id: 4, name: "Traffic Management", head_name: "David Kim", email: "traffic@city.gov" },
];

const Departments = ({ theme }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    setDepartments(dummyDepartments);
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-xl p-6 border shadow-md hover:shadow-xl transition
        ${isDark ? "bg-[#1E1E1E] border-[#333333]" : "bg-white border-[#E6E6E6]"}`}
    >
      <h3 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-black"}`}>
        Departments
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className={`rounded-lg p-4 border transition
              ${isDark ? "border-[#333333] bg-[#252525]" : "border-[#E6E6E6] bg-white"}`}
          >
            <h4 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-black"}`}>
              {dept.name}
            </h4>
            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Head: {dept.head_name}
            </p>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Email: {dept.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;
