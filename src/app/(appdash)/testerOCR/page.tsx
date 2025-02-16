// app/receipts/page.tsx
"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

export default function ReceiptOCR() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Reset previous results
      setOcrText("");
      setProgress(0);
    }
  };

  const handleOCR = async () => {
    if (!file) return;
    setLoading(true);

    // Create an object URL for the uploaded file
    const imageUrl = URL.createObjectURL(file);

    Tesseract.recognize(imageUrl, "eng", {
      logger: (m) => {
        // Update progress when status is "recognizing text"
        if (m.status === "recognizing text") {
          setProgress(Math.floor(m.progress * 100));
        }
      },
    })
      .then(({ data: { text } }) => {
        setOcrText(text);
      })
      .catch((error) => {
        console.error("Error during OCR:", error);
      })
      .finally(() => {
        setLoading(false);
        // Release the object URL once done
        URL.revokeObjectURL(imageUrl);
      });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Receipt OCR</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleOCR}
          disabled={!file || loading}
        >
          {loading ? "Scanning..." : "Scan Receipt"}
        </button>
      </div>
      {progress > 0 && loading && <p className="mt-4">Progress: {progress}%</p>}
      {ocrText && (
        <div className="mt-4">
          <h2 className="text-xl mb-2">OCR Output:</h2>
          <pre className="bg-gray-100 p-4 rounded">{ocrText}</pre>
        </div>
      )}
    </div>
  );
}
