import React, { useEffect, useState } from 'react'
const dummyDepartments = [
  { id: 1, name: "Road Maintenance", head_name: "Alice Smith", email: "road@city.gov" },
  { id: 2, name: "Sanitation", head_name: "Bob Johnson", email: "sanitation@city.gov" },
  { id: 3, name: "Parks & Recreation", head_name: "Carol Lee", email: "parks@city.gov" },
  { id: 4, name: "Traffic Management", head_name: "David Kim", email: "traffic@city.gov" },
];
const Departments = () => {
     const [departments, setDepartments] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    // Simulate fetching departments from backend
    setDepartments(dummyDepartments);
  }, []);

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
        <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
              <h3 className="text-xl font-bold text-black dark:text-white mb-6">
                Departments
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="border border-[#E6E6E6] dark:border-[#333333] rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-black dark:text-white mb-2">
                      {dept.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Head: {dept.head_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email: {dept.email}
                    </p>
                  </div>
                ))}
              </div>
            </div>
        </div>
    </div>
  )
}

export default Departments