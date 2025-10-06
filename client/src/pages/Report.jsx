// import React, { useState, useEffect } from "react";

// export default function Report() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState(null);
//   const [coords, setCoords] = useState(null);
//   const [anonymous, setAnonymous] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const [reports, setReports] = useState([]);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           setCoords({
//             lat: pos.coords.latitude,
//             lng: pos.coords.longitude,
//           });
//         },
//         (err) => console.warn("geo err", err)
//       );
//     }
//   }, []);

//   const submit = (e) => {
//     e.preventDefault();
//     if (!coords) {
//       alert("Waiting for location");
//       return;
//     }
//     setSubmitting(true);

//     const newReport = {
//       id: Date.now(),
//       title,
//       description,
//       file: file ? file.name : "No file",
//       location: coords,
//       anonymous,
//       status: "Pending",
//     };

//     setReports((prev) => [newReport, ...prev]);

//     setTitle("");
//     setDescription("");
//     setFile(null);
//     setAnonymous(false);

//     alert("Dummy Report Submitted!");
//     setSubmitting(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4">
//       <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">
//           🚩 Report an Issue
//         </h2>

//         <form onSubmit={submit} className="space-y-5">
//           {/* Title */}
//           <div>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Short title"
//               required
//               className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Describe the issue"
//               rows={4}
//               className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>

//           {/* File Upload */}
//           <div>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
//                          file:rounded-full file:border-0 file:text-sm file:font-semibold
//                          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//           </div>

//           {/* Anonymous */}
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={anonymous}
//               onChange={(e) => setAnonymous(e.target.checked)}
//               className="h-4 w-4 text-blue-600 rounded"
//             />
//             <label className="text-gray-700">Report anonymously</label>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={submitting}
//             className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50"
//           >
//             {submitting ? "⏳ Sending..." : "📨 Send Report"}
//           </button>
//         </form>

//         {/* Location */}
//         <div className="mt-6 text-gray-600">
//           <strong>📍 Location:</strong>{" "}
//           {coords
//             ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
//             : "Detecting..."}
//         </div>
//       </div>

//       {/* Submitted Reports */}
//       <div className="max-w-3xl mx-auto mt-10">
//         <h3 className="text-xl font-semibold mb-4">📋 Submitted Reports</h3>
//         {reports.length === 0 ? (
//           <p className="text-gray-500">No reports yet</p>
//         ) : (
//           <div className="space-y-4">
//             {reports.map((r) => (
//               <div
//                 key={r.id}
//                 className="bg-white p-4 rounded-lg shadow border border-gray-200"
//               >
//                 <h4 className="font-bold text-lg text-gray-800">{r.title}</h4>
//                 <p className="text-gray-600">{r.description}</p>
//                 <p className="text-sm mt-1">
//                   <span className="font-medium">Status:</span>{" "}
//                   <span className="text-yellow-600">{r.status}</span>
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   📍 {r.location.lat.toFixed(4)}, {r.location.lng.toFixed(4)}
//                 </p>
//                 <p className="text-sm text-gray-500">📂 File: {r.file}</p>
//                 {r.anonymous && (
//                   <span className="inline-block mt-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
//                     Anonymous ✅
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import {
  Camera,
  MapPin,
  Mic,
  Send,
  User,
  Phone,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";

export default function ReportPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    photo: null,
    photoPreview: null,
    latitude: null,
    longitude: null,
    address: "",
    reporter_name: "",
    reporter_email: "",
    reporter_phone: "",
    is_anonymous: false,
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const categories = [
    { value: "roads", label: "Roads & Potholes", icon: "🚧" },
    { value: "lighting", label: "Street Lighting", icon: "💡" },
    { value: "sanitation", label: "Garbage & Waste", icon: "🗑️" },
    { value: "parks", label: "Parks & Recreation", icon: "🌳" },
    { value: "traffic", label: "Traffic & Parking", icon: "🚦" },
    { value: "water", label: "Water & Utilities", icon: "💧" },
    { value: "other", label: "Other Issues", icon: "❗" },
  ];

  // Auto-detect location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));

          // Reverse geocode to get address
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 300000 },
      );
    }
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using a free geocoding service (in production, use Google Maps API)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      );
      const data = await response.json();

      if (data.locality) {
        const address = `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`;
        setFormData((prev) => ({ ...prev, address }));
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleLocationRefresh = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError(
            "Could not get your location. Please enable location services.",
          );
        },
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        throw new Error("Please fill in all required fields");
      }

      const submitData = { ...formData };

      // If anonymous, clear personal info
      if (isAnonymous) {
        submitData.reporter_name = "";
        submitData.reporter_email = "";
        submitData.reporter_phone = "";
        submitData.is_anonymous = true;
      }

      // Handle photo upload if present
      if (formData.photo) {
        const photoFormData = new FormData();
        photoFormData.append("file", formData.photo);

        const photoResponse = await fetch("/api/upload", {
          method: "POST",
          body: photoFormData,
        });

        if (!photoResponse.ok) {
          throw new Error("Failed to upload photo");
        }

        const photoData = await photoResponse.json();
        submitData.photo_url = photoData.url;
      }

      // Get AI analysis for enhanced classification
      try {
        const aiResponse = await fetch("/api/ai/classify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: submitData.title,
            description: submitData.description,
            category: submitData.category,
            latitude: submitData.latitude,
            longitude: submitData.longitude,
            address: submitData.address,
          }),
        });

        if (aiResponse.ok) {
          const aiAnalysis = await aiResponse.json();

          // Enhance submission data with AI insights
          submitData.ai_classification = aiAnalysis.classification;
          submitData.ai_priority_score = aiAnalysis.priority_score;
          submitData.priority = aiAnalysis.priority;
          submitData.assigned_department = aiAnalysis.assigned_department;
        }
      } catch (aiError) {
        console.log("AI analysis failed, proceeding with basic submission");
        // Continue with submission even if AI fails
      }

      // Submit the issue
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit issue");
      }

      setShowSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          photo: null,
          photoPreview: null,
          latitude: null,
          longitude: null,
          address: "",
          reporter_name: "",
          reporter_email: "",
          reporter_phone: "",
          is_anonymous: false,
        });
        setShowSuccess(false);
        setIsAnonymous(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting issue:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-green-200 dark:border-green-800 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle
                size={32}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-sora">
              Issue Reported Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-inter">
              Thank you for reporting this issue. You'll receive updates on the
              progress soon.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* <Navigation /> */}
      <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] py-4 px-4">
  
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-t-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2 font-sora">
              Report Civic Issue
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-inter">
              Help improve your community by reporting problems quickly and
              easily
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#1E1E1E] border-x border-[#E6E6E6] dark:border-[#333333] p-6 space-y-6"
          >
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Issue Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                Issue Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Brief description of the problem"
                className="w-full p-3 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-inter focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 font-inter">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, category: cat.value }))
                    }
                    className={`p-3 rounded-lg border text-left transition-all duration-150 ${formData.category === cat.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "border-[#D9D9D9] dark:border-[#404040] bg-white dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                  >
                    <div className="text-xl mb-1">{cat.icon}</div>
                    <div className="text-sm font-medium font-inter">
                      {cat.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Provide detailed information about the issue"
                rows={4}
                className="w-full p-3 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-inter focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                Photo Evidence
              </label>
              <div className="border-2 border-dashed border-[#D9D9D9] dark:border-[#404040] rounded-lg p-6 text-center">
                {formData.photoPreview ? (
                  <div className="space-y-4">
                    <img
                      src={formData.photoPreview}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded-lg mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          photo: null,
                          photoPreview: null,
                        }))
                      }
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Camera
                      size={32}
                      className="mx-auto text-gray-400 dark:text-gray-500 mb-2"
                    />
                    <p className="text-gray-600 dark:text-gray-400 font-inter">
                      Click to capture or upload a photo
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoCapture}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">
                Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Address will be auto-detected"
                  className="flex-1 p-3 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-inter"
                />
                <button
                  type="button"
                  onClick={handleLocationRefresh}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MapPin size={20} />
                </button>
              </div>
              {formData.latitude && formData.longitude && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-inter">
                  Coordinates: {formData.latitude.toFixed(6)},{" "}
                  {formData.longitude.toFixed(6)}
                </p>
              )}
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#262626] rounded-lg">
              <div className="flex items-center gap-3">
                {isAnonymous ? <EyeOff size={20} /> : <Eye size={20} />}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white font-inter">
                    Anonymous Report
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                    Report without providing personal information
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-12 h-6 rounded-full transition-colors ${isAnonymous ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${isAnonymous ? "translate-x-6" : "translate-x-0.5"
                    }`}
                />
              </button>
            </div>

            {/* Reporter Information (only if not anonymous) */}
            {!isAnonymous && (
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white font-inter">
                  Contact Information (Optional)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                      <User size={16} className="inline mr-1" />
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.reporter_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reporter_name: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                      <Mail size={16} className="inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.reporter_email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reporter_email: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Submit Button */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-b-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-150 hover:from-blue-700 hover:to-blue-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed font-inter flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
