import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { ThemeContext } from "../Context/ThemeContext";

// Start-from-a-photo entry point. One button: the citizen photographs the
// problem, the vision API reads it, and /report-issues opens already filled in.
// Built for people who cannot type the form themselves, so this page asks for
// exactly one thing and nothing else.
export default function ImageReport() {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);

  const [status, setStatus] = useState("idle"); // idle | uploading | reading
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      toast.error("Login required");
      navigate("/login");
    }
  }, [navigate]);

  const uploadPhoto = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_APP_API_UPLOAD_NAME);
    data.append("cloud_name", import.meta.env.VITE_APP_API_CLOUDINARY_NAME);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_API_CLOUDINARY_NAME}/image/upload`, {
      method: "POST",
      body: data,
    });
    const uploadImage = await res.json();
    if (!uploadImage.url) throw new Error("Image upload failed");

    return uploadImage.url;
  };

  const handlePhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a photo (jpg, png)");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setStatus("uploading");

    try {
      const photoUrl = await uploadPhoto(file);

      setStatus("reading");
      const res = await fetch(`${import.meta.env.VITE_APP_CHATBOT_API_URL}/analyze-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: photoUrl }),
      });
      const ai = await res.json();
      if (ai.error) throw new Error(ai.error);

      navigate("/report-issues", {
        state: {
          photoUrl,
          title: ai.title,
          description: ai.description,
          category: ai.category,
          isCivicIssue: ai.is_civic_issue,
        },
      });
    } catch (error) {
      console.error("Photo analysis failed:", error);
      // Fail open: the photo still uploaded, so hand the form what we have and
      // let the user finish by hand rather than trapping them on this page.
      toast.error("Couldn't read the photo — please fill the form yourself");
      navigate("/report-issues");
    }
  };

  const busy = status !== "idle";

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#121212] text-white" : "bg-[#FAFAFA] text-gray-900"}`}>
      <div className="max-w-xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-8 text-sm ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"}`}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-3xl font-bold mb-2">Report with a photo</h1>
        <p className={`mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Take a picture of the problem. We'll fill in the report for you.
        </p>

        <div className={`border-2 border-dashed rounded-2xl p-8 text-center ${isDark ? "border-[#404040]" : "border-[#D9D9D9]"}`}>
          {preview ? (
            <img src={preview} alt="Your photo" className="max-w-full h-56 object-cover rounded-xl mx-auto" />
          ) : (
            <Camera size={64} className={`mx-auto ${isDark ? "text-gray-600" : "text-gray-400"}`} />
          )}

          {busy ? (
            <p className={`mt-6 animate-pulse font-medium ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
              {status === "uploading" ? "Uploading your photo…" : "📷 Reading your photo…"}
            </p>
          ) : (
            <label className="mt-6 block cursor-pointer">
              <span className="inline-block px-8 py-4 rounded-xl text-white text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90">
                Take a photo
              </span>
              {/* capture="environment" opens the rear camera directly on mobile */}
              <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
            </label>
          )}
        </div>

        <button
          onClick={() => navigate("/report-issues")}
          disabled={busy}
          className={`mt-6 w-full py-3 rounded-xl border ${isDark ? "border-[#333] text-gray-300 hover:bg-[#1E1E1E]" : "border-gray-300 text-gray-700 hover:bg-gray-50"} ${busy ? "opacity-50" : ""}`}
        >
          Fill the form myself instead
        </button>
      </div>
    </div>
  );
}
