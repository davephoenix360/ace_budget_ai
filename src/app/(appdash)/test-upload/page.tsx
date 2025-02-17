// app/test-upload/page.tsx
"use client";

import { useState } from "react";

export default function TestUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await fetch("/api/upload-receipt", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setUploadResult(data.receiptUrl);
      } else {
        setUploadResult("Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadResult("Error uploading file.");
    }
  };

  return (
    <div className="p-8">
      <h1>Test Upload Receipt</h1>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload
      </button>
      {uploadResult && (
        <p className="mt-4">
          {uploadResult.startsWith("/uploads")
            ? `File uploaded: ${uploadResult}`
            : uploadResult}
        </p>
      )}
    </div>
  );
}
