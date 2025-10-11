import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Star,
  MessageCircle,
} from "lucide-react";
import Navigation from "../components/Navigation";
import { Link, useNavigate } from "react-router-dom";

export default function TrackIssues() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const statusColors = {
    pending:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    inprogress:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    resolved:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  };

  const statusIcons = {
    pending: Clock,
    inprogress: AlertTriangle,
    resolved: CheckCircle,
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // ✅ Dummy data instead of backend API
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const dummyData = [
        {
          id: 1,
          title: "Pothole on Main Road",
          description: "Large pothole causing traffic near market area.",
          address: "Main Street, Near City Market",
          category: "Road Maintenance",
          status: "pending",
          assigned_department: "Public Works Department",
          createdAt: "2025-09-29T10:00:00Z",
          photo: "https://picsum.photos/400/200?random=1",
          ai_classification: "Road Damage",
          ai_priority_score: 0.85,
        },
        {
          id: 2,
          title: "Streetlight not working",
          description: "Streetlight flickers and stays off most of the night.",
          address: "5th Avenue, Near Park",
          category: "Electrical",
          status: "inprogress",
          assigned_department: "Electrical Department",
          createdAt: "2025-09-25T09:00:00Z",
          photo: "https://picsum.photos/400/200?random=2",
          ai_classification: "Lighting Issue",
          ai_priority_score: 0.62,
        },
        {
          id: 3,
          title: "Garbage pile-up",
          description: "Uncollected garbage causing bad odor and flies.",
          address: "Sector 14, Near Temple",
          category: "Sanitation",
          status: "resolved",
          assigned_department: "Sanitation Department",
          createdAt: "2025-09-20T12:00:00Z",
          resolved_at: "2025-09-28T16:00:00Z",
          photo: "https://picsum.photos/400/200?random=3",
          ai_classification: "Waste Management",
          ai_priority_score: 0.72,
          citizen_rating: 4,
          citizen_feedback: "Cleaned well, but took some time.",
        },
      ];
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        alert("Login required");
        navigate("/login");
        return;
      }
      const response = await fetch("http://localhost:8000/api/user/issues", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        }
      });
      const data = await response.json();
      setIssues([...dummyData, ...data.issues]);
    } catch (error) {
      console.error("Error loading dummy data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Dummy submitRating — updates local state instead of calling API
  const submitRating = async () => {
    if (!selectedIssue || rating === 0) return;

    try {
      const updatedIssues = issues.map((issue) =>
        issue.id === selectedIssue.id
          ? { ...issue, citizen_rating: rating, citizen_feedback: feedback }
          : issue
      );

      setIssues(updatedIssues);
      setShowRatingModal(false);
      setRating(0);
      setFeedback("");
    } catch (error) {
      console.error("Error submitting dummy rating:", error);
    }
  };

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const IssueCard = ({ issue }) => {
    const StatusIcon = statusIcons[issue.status];
    const daysSinceReported = Math.floor(
      (new Date() - new Date(issue.createdAt)) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1" key={issue.createdAt}>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2 font-sora">
              {issue.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3 font-inter">
              {issue.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {issue.address || "Location not provided"}
              </span>
              <span>📁 {issue.category}</span>
              <span>{daysSinceReported} days ago</span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[issue.status]}`}
              >
                <StatusIcon size={12} />
                {issue.status.replace("_", " ").toUpperCase()}
              </span>

              {issue.assigned_department && (
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                  {issue.assigned_department}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <button
              onClick={() => setSelectedIssue(issue)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <Eye size={16} />
              Details
            </button>

            {issue.status === "resolved" && !issue.citizen_rating && (
              <button
                onClick={() => {
                  setSelectedIssue(issue);
                  setShowRatingModal(true);
                }}
                className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
              >
                <Star size={16} />
                Rate
              </button>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${issue.status === "pending"
                ? "bg-red-500 w-1/3"
                : issue.status === "inprogress"
                  ? "bg-yellow-500 w-2/3" 
                  : "bg-green-500 w-full"
              }`}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Reported</span>
          <span>In Progress</span>
          <span>Resolved</span>
        </div>

        {issue.citizen_rating && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-green-800 dark:text-green-400">
                Your Rating:
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < issue.citizen_rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
            {issue.citizen_feedback && (
              <p className="text-sm text-green-700 dark:text-green-300">
                "{issue.citizen_feedback}"
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const IssueModal = ({ issue, onClose }) => {
    if (!issue) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-white font-sora">
                {issue.title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[issue.status]}`}
                >
                  {issue.status.replace("_", " ").toUpperCase()}
                </span>
                {issue.assigned_department && (
                  <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                    Assigned to: {issue.assigned_department}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {issue.description}
                </p>
              </div>

              {/* Photo */}
              {issue.photo && (
                <div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">
                    Photo Evidence
                  </h3>
                  <img
                    src={issue.photo}
                    alt="Issue evidence"
                    className="max-w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Location */}
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-2">
                  Location
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {issue.address}
                </p>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-3">
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#262626] rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-black dark:text-white">
                        Issue Reported
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(issue.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {issue.status !== "pending" && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#262626] rounded-lg">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          Work Started
                        </p>
                        <p className="text-sm text-gray-500">
                          Issue assigned to {issue.assigned_department}
                        </p>
                      </div>
                    </div>
                  )}

                  {issue.status === "resolved" && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#262626] rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          Issue Resolved
                        </p>
                        <p className="text-sm text-gray-500">
                          {issue.resolved_at
                            ? new Date(issue.resolved_at).toLocaleString()
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Insights */}
              {issue.ai_classification && (
                <div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">
                    AI Analysis
                  </h3>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Classification: <strong>{issue.ai_classification}</strong>
                    </p>
                    {issue.ai_priority_score && (
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        Priority Score:{" "}
                        <strong>
                          {(issue.ai_priority_score * 100).toFixed(0)}%
                        </strong>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RatingModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-black dark:text-white mb-4 font-sora">
          Rate Resolution Quality
        </h3>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            How satisfied are you with the resolution of your issue?
          </p>

          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-colors"
              >
                <Star
                  size={32}
                  className={
                    star <= rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional feedback about the resolution..."
            rows={4}
            className="w-full p-3 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowRatingModal(false)}
            className="flex-1 py-2 px-4 border border-[#D9D9D9] dark:border-[#404040] rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#262626]"
          >
            Cancel
          </button>
          <button
            onClick={submitRating}
            disabled={rating === 0}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-t-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2 font-sora">
              Track Your Issues
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-inter mb-6">
              Monitor the progress of your reported civic issues
            </p>

            {/* Search */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search your issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-inter"
              />
            </div>
          </div>

          {/* Issues List */}
          <div className="bg-white dark:bg-[#1E1E1E] border-x border-[#E6E6E6] dark:border-[#333333] p-6">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No issues found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "You haven't reported any issues yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-b-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
            <div className="text-center">
              <Link
                to="/report-issues"
                className="inline-flex items-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors font-inter"
              >
                Report New Issue
              </Link>
            </div>
          </div>
        </div>

        {/* Modals */}
        {selectedIssue && !showRatingModal && (
          <IssueModal
            issue={selectedIssue}
            onClose={() => setSelectedIssue(null)}
          />
        )}

        {showRatingModal && <RatingModal />}
      </div>
    </>
  );
}
