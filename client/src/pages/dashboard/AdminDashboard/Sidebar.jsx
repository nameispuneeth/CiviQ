export default function Sidebar({ navigationItems, activeView, setActiveView }) {
  return (
    <div className="w-64 bg-white dark:bg-[#1E1E1E] border-r border-[#E6E6E6] dark:border-[#333333] flex flex-col">
      <div className="h-16 flex items-center justify-center text-xl font-bold text-blue-600 border-b border-[#E6E6E6] dark:border-[#333333]">
        Admin Panel
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === item.id
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
