// FILE: app/routes/dash._student.$id.community-operated.tsx

import React, { useState } from "react";
import { useLoaderData, useParams } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import pool from "~/utils/db.server";
import { c } from "vite/dist/node/types.d-aGj9QkWt";

// Loader function to fetch files from the database
export const loader: LoaderFunction = async ({ params }) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM files");
    console.log(result.rows);
    return json(result.rows);
  } finally {
    client.release();
  }
};

const CommunityOperated = () => {
  const files = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    alert("Search clicked!");
  };

  const handleFileClick = () => {
    window.location.href = "/404";
  };

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
              <th className="py-2 px-4 border-b text-center">Description</th>
              <th className="py-2 px-4 border-b text-center">Upload Date</th>
              <th className="py-2 px-4 border-b text-center">Rating</th>
            </tr>
          </thead>
          <tbody>
            {files?.map((file: any) => (
              <tr key={file.id}>
                <td className="py-2 px-4 border-b text-center">
                  <a
                    href="#"
                    onClick={handleFileClick}
                    className="text-blue-500"
                  >
                    {file.name}
                  </a>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {file.date_created}
                </td>
                <td className="py-2 px-4 border-b text-center">{file.tags}</td>
                <td className="py-2 px-4 border-b text-center">
                  {file.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunityOperated;
