export default function IssuesList({ issues, setIssues, filters, setFilters, setSelectedIssue }) {
  // Update status of an issue in local state
  const updateStatus = (issueId, newStatus) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
      <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
        Issues List
      </h3>

      {/* Search Bar */}
      <input
        type="text"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        placeholder="Search issues..."
        className="w-full mb-4 px-4 py-2 border rounded-lg bg-gray-50 dark:bg-[#2A2A2A] text-black dark:text-white"
      />

      {/* Issues */}
      <div className="space-y-3">
        {issues
         .filter((i) => {
    if (!filters.search) return true; // show all if search is empty
    return i.title.toLowerCase().includes(filters.search.toLowerCase());
  })
          .map((issue) => (
            <div
              key={issue.id}
              className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2A2A] flex flex-col gap-2"
            >
              <div onClick={() => setSelectedIssue(issue)} className="cursor-pointer">
                <h4 className="font-semibold text-black dark:text-white">
                  {issue.title}
                </h4>
                <p className="text-gray-500 text-sm">
                  Status: {issue.status} | Priority: {issue.priority} | Category: {issue.category}
                </p>
                {issue.place && (
                  <p className="text-gray-500 text-sm">
                    Place: {issue.place}
                  </p>
                )}
                {issue.longitude && issue.latitude && (
                  <p className="text-gray-500 text-sm">
                    Coordinates: {issue.latitude}, {issue.longitude}
                  </p>
                )}
                {issue.department && (
                  <p className="text-gray-500 text-sm">
                    Department: {issue.department}
                  </p>
                )}
                {issue.description && (
                  <p className="text-gray-500 text-sm">
                    Description: {issue.description}
                  </p>
                )}
              </div>

              {/* Status Select */}
              <select
                value={issue.status}
                onChange={(e) => updateStatus(issue.id, e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-[#404040] rounded bg-white dark:bg-[#262626] text-black dark:text-white"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          ))}
      </div>
    </div>
  );
}
