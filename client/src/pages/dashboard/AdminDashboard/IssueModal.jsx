export default function IssueModal({ issue, onClose, departments }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl w-[90%] md:w-[500px]">
        <h3 className="text-xl font-bold text-black dark:text-white mb-2">
          {issue.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {issue.description}
        </p>

        <p className="text-sm text-gray-500 mb-2">
          Category: <span className="font-medium">{issue.category}</span>
        </p>
        <p className="text-sm text-gray-500 mb-2">
          Status: <span className="font-medium">{issue.status}</span>
        </p>

        <p className="text-sm text-gray-500">
          Department:{" "}
          <span className="font-medium">{issue.department}</span>
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
