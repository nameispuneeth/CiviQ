// Upload.jsx
import React, { useState } from "react";

function Upload() {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (jpg, png, jpeg, etc.)");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", import.meta.env.VITE_APP_API_UPLOAD_NAME);
      data.append("cloud_name", import.meta.env.VITE_APP_API_CLOUDINARY_NAME);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_API_CLOUDINARY_NAME}/image/upload`,
        { method: "POST", body: data }
      );

      const uploadImage = await res.json();
      if (!uploadImage.url) throw new Error("Upload failed");
      setUrl(uploadImage.url);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <input type="file" accept="image/*" className="file-input" onChange={handleUpload} />

      {uploading && <p className="mt-3 text-sm text-gray-500">Uploading…</p>}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {url && (
        <div className="mt-4">
          <img src={url} alt="Uploaded" className="max-w-xs rounded-lg shadow" />
          <p className="mt-2 text-xs break-all text-gray-500">{url}</p>
        </div>
      )}
    </div>
  );
}

export default Upload;
