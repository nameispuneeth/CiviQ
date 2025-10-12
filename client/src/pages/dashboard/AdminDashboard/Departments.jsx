import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

const departmentCategoryMap = new Map([
  ["Roads Department", ["roads", "traffic", "potholes", "sidewalks"]],
  ["Street Lighting Department", ["lighting", "streetlights", "public lamps", "signal lights"]],
  ["Sanitation Department", ["sanitation", "garbage", "waste", "sewage", "cleanliness"]],
  ["Parks & Recreation Department", ["parks", "recreation", "gardens", "playgrounds", "green spaces"]],
  ["Traffic Management Department", ["traffic", "parking", "signals", "congestion", "road safety"]],
  ["Water & Utilities Department", ["water", "utilities", "sewage", "leakage", "pipes"]],
  ["General Issues Department", ["other", "miscellaneous", "public grievances", "citizen complaints"]],
]);

const Departments = ({ dept }) => {
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    setDepartments(dept);
  }, [dept]);

  const openModal = (deptName) => {
    setSelectedDept(deptName);
    setEmployeeForm({ name: "", email: "", password: "", phone: "" });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setEmployeeForm({ ...employeeForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDept) return;

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...employeeForm, departmentName: selectedDept }),
      });
      if (!res.ok) throw new Error("Failed to add employee");

      alert(`✅ ${employeeForm.name} added to ${selectedDept}`);
      setModalOpen(false);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <h2 className={`text-4xl font-extrabold mb-10 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
        City Departments
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept) => (
          <div
            key={dept.name}
            className={`relative rounded-2xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105
            ${isDark ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white" : "bg-white text-gray-900"}`}
          >
            <div className={`absolute top-0 left-0 w-full h-2 ${isDark ? "bg-indigo-500" : "bg-blue-500"}`}></div>

            <div className="py-5 px-6">
              <h4 className="text-2xl font-bold mb-3">{dept.name}</h4>
              <p className={`text-sm mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{`Head: ${dept.head}`}</p>
              <p className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{`Email: ${dept.email}`}</p>

              <span className={`font-semibold block mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Problems Solved:</span>
              <div className="flex flex-wrap gap-2">
                {(departmentCategoryMap.get(dept.name) || []).map((cat, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                      ${isDark
                        ? "bg-gray-700 text-white hover:bg-indigo-500 hover:text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <button
                className="p-2 mt-3 border border-white bg-white text-black rounded-lg"
                onClick={() => openModal(dept.name)}
              >
                ADD EMPLOYEE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white p-6 rounded-lg w-96 ${isDark ? "bg-[rgba(31,31,31,1)] text-white" : "text-black"}`}>
            <h3 className="text-xl font-bold mb-4">Add Employee to {selectedDept}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={employeeForm.name}
                onChange={handleChange}
                className={`p-2 border rounded ${isDark?'bg-[rgba(51,51,51,1)]':''}`}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={employeeForm.email}
                onChange={handleChange}
                className={`p-2 border rounded ${isDark?'bg-[rgba(51,51,51,1)]':''}`}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={employeeForm.password}
                onChange={handleChange}
                className={`p-2 border rounded ${isDark?'bg-[rgba(51,51,51,1)]':''}`}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={employeeForm.phone}
                onChange={handleChange}
                className={`p-2 border rounded ${isDark?'bg-[rgba(51,51,51,1)]':''}`}
                required
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
