import React, { useState } from "react";
import {useParams} from "@remix-run/react";

const CommunityOperated = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    alert("Search clicked!");
  };

  const handleFileClick = () => {
    window.location.href = "/404";
  };
const { id } = useParams();
  return (
    <div className="flex flex-col h-screen p-4">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4 self-start"
        onClick={() => {
          window.location.href = `/dash/${id}/upload-material`;
        }}
      >
        Add New File
      </button>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded flex-grow"
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center">File Name</th>
              <th className="py-2 px-4 border-b text-center">Date Created</th>
              <th className="py-2 px-4 border-b text-center">Tags</th>
              <th className="py-2 px-4 border-b text-center">Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b text-center">
                <a href="#" onClick={handleFileClick} className="text-blue-500">
                  File1.txt
                </a>
              </td>
              <td className="py-2 px-4 border-b text-center">2023-01-01</td>
              <td className="py-2 px-4 border-b text-center">Tag1, Tag2</td>
              <td className="py-2 px-4 border-b text-center">⭐⭐⭐⭐⭐</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b text-center">
                <a href="#" onClick={handleFileClick} className="text-blue-500">
                  File2.txt
                </a>
              </td>
              <td className="py-2 px-4 border-b text-center">2023-01-02</td>
              <td className="py-2 px-4 border-b text-center">Tag3, Tag4</td>
              <td className="py-2 px-4 border-b text-center">⭐⭐⭐⭐</td>
            </tr>
            {/* Add more dummy rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunityOperated;
