export default function DashboardOverview({ stats, issues, setActiveView, setSelectedIssue }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
        Dashboard Overview
      </h2>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-4 text-center"
          >
            <p className="text-sm text-gray-500 capitalize">{key}</p>
            <h3 className="text-2xl font-bold text-blue-600">{value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Issues */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
          Recent Issues
        </h3>
        <ul className="space-y-3">
          {issues.slice(0, 5).map((issue) => (
            <li
              key={issue.id}
              className="cursor-pointer p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
              onClick={() => setSelectedIssue(issue)}
            >
              <p className="font-semibold text-black dark:text-white">
                {issue.title}
              </p>
              <p className="text-gray-500 text-sm">{issue.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
