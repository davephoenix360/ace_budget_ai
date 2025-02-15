// dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { firestoredb } from "../../../firebase/config"; // Adjust the import path as necessary
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";

const DashboardPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [dataList, setDataList] = useState<DocumentData[]>([]);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    try {
      // Add a new document with the input value
      await addDoc(collection(firestoredb, "testCollection"), {
        value: inputValue,
        timestamp: new Date(),
      });
      setInputValue(""); // Clear the input field
      fetchData(); // Refresh the data list
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(firestoredb, "testCollection")
      );
      const dataArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDataList(dataArray);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter some data"
        />
        <button type="submit">Add Data</button>
      </form>
      <ul>
        {dataList.map((item) => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
