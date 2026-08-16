import * as React from 'react';
import { useState, useEffect, useContext } from "react";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
  Camera,
  MapPin,
  House,
  Send,
  Eye,
  Sun,Moon,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from '../Context/ThemeContext'; // using ThemeContext
import Chatbot from '../components/Chatbot';

export default function ReportPage() {
  const navigate = useNavigate();
  const { isDark ,toggleTheme} = useContext(ThemeContext);

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
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      toast.error("Login required");
      navigate("/login");
      return;
    }
  }, [])
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [duplicateMatches, setDuplicateMatches] = useState(null);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFilled, setAiFilled] = useState([]);

  // Arrives from /image-report, which uploaded the photo and had the vision API
  // read it. Nothing here is mandatory — reaching this page directly just leaves
  // the form blank, exactly as before.
  const handoff = useLocation().state;

  useEffect(() => {
    if (!handoff?.photoUrl) return;

    setFormData(prev => ({
      ...prev,
      photoUrl: handoff.photoUrl,
      photoPreview: handoff.photoUrl,
      title: handoff.title || prev.title,
      description: handoff.description || prev.description,
      category: handoff.category || prev.category,
    }));
    setAiFilled(["title", "description", "category"].filter(field => handoff[field]));

    if (handoff.isCivicIssue === false) {
      setSnackbarMessage("⚠️ This may not be a civic issue — please check the details before submitting.");
      setOpen(true);
    }
  }, [handoff]);

  // Marks a field as filled from the photo rather than typed, so nobody submits
  // a machine's wording believing they wrote it.
  const SuggestedBadge = ({ field }) =>
    aiFilled.includes(field) ? (
      <span className={`ml-2 text-xs font-normal ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
        ✨ suggested from your photo
      </span>
    ) : null;
  const [error, setError] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const categories = [
    { value: "Roads", label: "Roads & Potholes", icon: "🚧" },
    { value: "Lighting", label: "Street Lighting", icon: "💡" },
    { value: "Sanitation", label: "Garbage & Waste", icon: "🗑️" },
    { value: "Parks", label: "Parks & Recreation", icon: "🌳" },
    { value: "Traffic", label: "Traffic & Parking", icon: "🚦" },
    { value: "Water", label: "Water & Utilities", icon: "💧" },
    { value: "Other", label: "Other Issues", icon: "❗" },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 300000 },
      );
    }
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_GEOCODEAPI}?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      );
      const data = await response.json();
      if (data.locality) {
        const address = `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`;
        setFormData(prev => ({ ...prev, address }));
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  // The Cloudinary upload that used to live inline in submitIssue. It now runs
  // when the photo is chosen instead of at submit, because the vision API needs
  // a URL to read — and submitIssue reuses the result rather than re-uploading.
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

  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
        photoUrl: null, // a hand-picked photo replaces whatever /image-report uploaded
      }));
      setAiFilled([]);
    }
  };

  const handleLocationRefresh = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        () => setError("Could not get your location. Please enable location services."),
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("User Have To Login");
        navigate("/login");
        return;
      }
      if (!formData.title) { setSnackbarMessage("⚠️ Title is required!"); setOpen(true); return; }
      if (!formData.description) { setSnackbarMessage("⚠️ Description is required!"); setOpen(true); return; }
      if (!formData.category) { setSnackbarMessage("⚠️ Category is required!"); setOpen(true); return; }
      // photoUrl covers the /image-report handoff, where the photo is already on
      // Cloudinary and no File object was ever created on this page.
      if (!formData.photo && !formData.photoUrl) { setSnackbarMessage("📷 Please upload a photo!"); setOpen(true); return; }

      if (formData.photo && !formData.photo.type.startsWith("image/")) { setSnackbarMessage("❌ Please upload a valid image file (jpg, png, jpeg)"); setOpen(true); return; }

      const res = await fetch(`${import.meta.env.VITE_APP_API_BACKEND_URL}/api/user/checkDuplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: token },
        body: JSON.stringify({
          category: formData.category,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });
      const result = await res.json();
      if (result.ok && result.matches.length) {
        setDuplicateMatches(result.matches);
        return;
      }

      await submitIssue(false);
    } catch (error) {
      console.error("Error submitting issue:", error);
      setSnackbarMessage("❌ " + error.message);
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitIssue = async (confirmedUnique) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const submitData = { ...formData, confirmed_unique: confirmedUnique };

      // Already uploaded when the photo was picked; only re-upload if that failed.
      submitData.photo = formData.photoUrl || (await uploadPhoto(formData.photo));
      delete submitData.photoUrl;

      if (isAnonymous) {
        submitData.is_anonymous = true;
      }

      const response = await fetch(`${import.meta.env.VITE_APP_API_BACKEND_URL}/api/user/Generateissue`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: token},
        body: JSON.stringify(submitData),
      });
      if (!response.ok) throw new Error("Failed to submit issue");
      const result = await response.json();

      setDuplicateMatches(null);
      toast.success(
        result.duplicate_of
          ? `Linked to an existing report — ${result.report_count} people have reported this`
          : "Issue successfully submitted!"
      );
      navigate("/track-issues");
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
        setIsAnonymous(false);
      }, 3000);

    } catch (error) {
      console.error("Error submitting issue:", error);
      setSnackbarMessage("❌ " + error.message);
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={snackbarMessage}
        action={action}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      {duplicateMatches && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <h3 className="text-xl font-bold mb-2">Similar issue already reported</h3>
            <p className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {duplicateMatches.length} report{duplicateMatches.length > 1 ? "s" : ""} of the same category near this location.
              Adding yours to an existing report helps it get prioritised faster.
            </p>

            <div className="space-y-3 max-h-64 overflow-y-auto mb-5">
              {duplicateMatches.map((match) => (
                <div key={match.id} className={`p-3 rounded-xl border ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold">{match.title}</span>
                    <span className={`text-xs whitespace-nowrap ${isDark ? "text-gray-400" : "text-gray-500"}`}>{match.distance}m away</span>
                  </div>
                  <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{match.description}</p>
                  <div className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {match.status} · {match.report_count} report{match.report_count > 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => submitIssue(false)}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold disabled:opacity-60"
              >
                This is the same issue
              </button>
              <button
                onClick={() => submitIssue(true)}
                disabled={isSubmitting}
                className={`flex-1 py-3 rounded-xl font-semibold border disabled:opacity-60 ${isDark ? "border-gray-600 text-white" : "border-gray-300 text-gray-700"}`}
              >
                Report separately
              </button>
            </div>
            <button
              onClick={() => setDuplicateMatches(null)}
              className={`w-full mt-2 py-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className={`absolute top-5 left-5 cursor-pointer p-2 border ${isDark?'border-white':'border-black'} rounded-full`}>
          <House color={`${isDark?'white':'black'}`} size={18} onClick={()=>navigate("/user-home")}/>
      </div>
      <button
        onClick={() => toggleTheme(!isDark)}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white shadow-md hover:shadow-lg transition"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <div className={`min-h-screen py-4 px-4 ${isDark ? "bg-[#0A0A0A]" : "bg-[#F3F3F3]"}`}>
        <div className="max-w-2xl mx-auto">
          <div className={`rounded-t-2xl p-6 ${isDark ? "bg-[#1E1E1E] border-[#333]" : "bg-white border-[#E6E6E6]"} border`}>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-black"}`}>Report Civic Issue</h1>
            <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>Help improve your community by reporting problems quickly and easily</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`p-6 space-y-6 border-x ${isDark ? "bg-[#1E1E1E] border-[#333]" : "bg-white border-[#E6E6E6]"}`}>
            {error && <div className={`bg-red-50 dark:bg-red-900/20 border rounded-lg p-4 ${isDark ? "border-red-800" : "border-red-200"}`}>
              <p className={isDark ? "text-red-400" : "text-red-600"}>{error}</p>
            </div>}

            {/* Title */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Issue Title *<SuggestedBadge field="title" /></label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the problem"
                className={`w-full p-3 border rounded-lg ${isDark ? "bg-[#262626] border-[#404040] text-white placeholder-gray-500" : "bg-white border-[#D9D9D9] text-black placeholder-gray-400"}`}
              />
            </div>

            {/* Category */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Category *<SuggestedBadge field="category" /></label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`p-3 rounded-lg border text-left transition-all duration-150 ${formData.category === cat.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : `${isDark ? "border-[#404040] bg-[#262626] text-gray-300 hover:border-gray-500" : "border-[#D9D9D9] bg-white text-gray-700 hover:border-gray-300"}`
                      }`}
                  >
                    <div className="text-xl mb-1">{cat.icon}</div>
                    <div className="text-sm font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Description *<SuggestedBadge field="description" /></label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about the issue"
                rows={4}
                className={`w-full p-3 border rounded-lg ${isDark ? "bg-[#262626] border-[#404040] text-white placeholder-gray-500" : "bg-white border-[#D9D9D9] text-black placeholder-gray-400"}`}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Photo Evidence</label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${isDark ? "border-[#404040]" : "border-[#D9D9D9]"}`}>
                {formData.photoPreview ? (
                  <div className="space-y-4">
                    <img src={formData.photoPreview} alt="Preview" className="max-w-full h-48 object-cover rounded-lg mx-auto" />
                    <button
                      type="button"
                      onClick={() => { setAiFilled([]); setFormData(prev => ({ ...prev, photo: null, photoPreview: null, photoUrl: null })); }}
                      className={`font-medium ${isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"}`}
                    >Remove Photo</button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Camera size={32} className={`mx-auto mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                    <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>Click to capture or upload a photo</p>
                    {/* No `capture` attribute: it would force the rear camera and
                        hide the gallery. Without it the OS shows its own chooser,
                        which already offers camera, photos and files. */}
                    <input type="file" accept="image/*" onChange={handlePhotoCapture} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Address will be auto-detected"
                  className={`flex-1 p-3 border rounded-lg ${isDark ? "bg-[#262626] border-[#404040] text-white placeholder-gray-500" : "bg-white border-[#D9D9D9] text-black placeholder-gray-400"}`}
                />
                <button type="button" onClick={handleLocationRefresh} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MapPin size={20} />
                </button>
              </div>
              {formData.latitude && formData.longitude && (
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
              )}
            </div>

            {/* Anonymous Toggle */}
            <div className={`flex items-center justify-between p-4 rounded-lg ${isDark ? "bg-[#262626]" : "bg-gray-50"}`}>
              <div className="flex items-center gap-3">
                {isAnonymous ? <EyeOff size={20} /> : <Eye size={20} />}
                <div>
                  <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Anonymous Report</p>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Report without providing personal information</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-12 h-6 rounded-full transition-colors ${isAnonymous ? "bg-blue-600" : (isDark ? "bg-gray-600" : "bg-gray-300")}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isAnonymous ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </form>

          {/* Submit Button */}
          <div className={`p-6 rounded-b-2xl border ${isDark ? "bg-[#1E1E1E] border-[#333]" : "bg-white border-[#E6E6E6]"}`}>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <Chatbot  />
      </div>
    </>
  );
}
