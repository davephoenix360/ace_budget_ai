import {
  createBlankReceipt,
  createReceiptFromExtractedJSON,
} from "@/firebase/helpers/createReceipt";
import Link from "next/link";
import { NextResponse } from "next/server";
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { ExpenseCategory } from "@/firebase/models/expense"; // Adjust path if needed

interface Props {
  userId: string;
  callback: () => void;
}

export default function AddReceipt({ userId, callback }: Props) {
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleUploadPicture = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUploadReceipt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    try {
      // 1. Cloud Storage: Upload file using fetch
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload-receipt", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        const data = await response.json();
        setReceiptUrl(data.receiptUrl);
        console.log("Receipt URL:", data.receiptUrl);
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        alert("Upload failed. Check console for details.");
        return;
      }

      // 2. Read the receipt using OCR
      setLoading(true);
      const imageUrl = URL.createObjectURL(selectedFile);
      let extractedText = "";
      try {
        const result = await Tesseract.recognize(imageUrl, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(Math.floor(m.progress * 100));
            }
          },
        });
        extractedText = result.data.text;
        setOcrText(extractedText);
      } catch (error) {
        console.error("Error during OCR:", error);
      } finally {
        setLoading(false);
        URL.revokeObjectURL(imageUrl);
      }

      // Ensure OCR text was extracted before proceeding.
      if (!extractedText) {
        alert("OCR failed to extract text from the image.");
        return;
      }

      // 3. Fetch the parsed receipt data from the /api/parse-expense endpoint using the local extractedText
      console.log("Sending OCR text to /api/parse-expense:", extractedText);
      const parsedReceiptResponse = await fetch("/api/parse-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: extractedText }),
      });
      const parsedReceiptData = await parsedReceiptResponse.json();

      console.log("Parsed receipt data:", parsedReceiptData);

      // 4. Create a new receipt in Firestore with the parsed data
      await createReceiptFromExtractedJSON(
        userId,
        receiptUrl || "",
        parsedReceiptData
      );
      callback();
    } catch (error) {
      console.error("Error during upload:", error);
      alert("An error occurred during upload.");
    }
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg text-center">Add Receipt</h2>
      <div className="flex flex-col items-center space-y-4 mt-4">
        <div className="flex flex-col items-center space-y-4">
          <form
            onSubmit={handleUploadReceipt}
            className="w-full max-w-sm space-y-4"
          >
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleUploadPicture}
            />
            <label
              htmlFor="fileInput"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer block text-center"
            >
              Upload Picture
            </label>
            {progress > 0 && loading && (
              <p className="text-center text-gray-700">Progress: {progress}%</p>
            )}
            {selectedFile && (
              <p className="text-center text-gray-700">
                Selected file: {selectedFile.name}
              </p>
            )}
            <input type="submit" id="submitButton" className="hidden" />
            <label
              htmlFor="submitButton"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline block text-center"
            >
              {loading ? "Scanning..." : "Upload Receipt to Start"}
            </label>
          </form>
        </div>
        <div className="flex items-center space-x-2">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="text-gray-500">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={async () => {
            const receiptId = (await createBlankReceipt(userId)).id;
            window.location.href = `/receipts/create-receipt/${receiptId}`;
          }}
        >
          Manually Create Receipt
        </button>
      </div>
      {ocrText && loading && (
        <div className="mt-4">
          <h2 className="text-xl mb-2">OCR Output:</h2>
          <pre className="bg-gray-100 p-4 rounded">{ocrText}</pre>
        </div>
      )}
    </div>
  );
}
