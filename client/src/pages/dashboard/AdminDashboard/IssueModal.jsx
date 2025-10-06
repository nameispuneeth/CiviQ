export default function IssueModal({ issue, onClose, departments, theme }) {
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-xl w-[90%] md:w-[500px] transition
          ${isDark ? "bg-[#1E1E1E]" : "bg-white"}`}
      >
        <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-black"}`}>
          {issue.title}
        </h3>
        <p className={`mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {issue.description}
        </p>

        <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Category: <span className="font-medium">{issue.category}</span>
        </p>
        <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Status: <span className="font-medium">{issue.status}</span>
        </p>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Department: <span className="font-medium">{issue.department}</span>
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
