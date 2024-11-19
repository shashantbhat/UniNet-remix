import React, { useState } from "react";
import { useLoaderData, useParams } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import pool from "~/utils/db.server";
import authenticator from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const client = await pool.connect();

  try {
    // Retrieve the user details
    const user = await authenticator.isAuthenticated(request);

    if (!user) {
      throw new Error("User not authenticated");
    }

    const universityId = user?.university_id;

    // Fetch files belonging to the user's university
    const result = await client.query(
      "SELECT * FROM files WHERE university_id = $1",
      [universityId]
    );

    return json(result.rows);
  } catch (error) {
    console.error("Error fetching files:", error);
    return json({ error: "Failed to fetch files" }, { status: 500 });
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
              <th className="py-2 px-4 border-b text-center">Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {files.length > 0 ? (
              files.map((file: any) => (
                <tr key={file.id}>
                  <td className="py-2 px-4 border-b text-center">
                    <a
                      href={file.file_url} // Link to the file URL
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      {file.title}
                    </a>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {file.description || "No description provided"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {new Date(file.upload_date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {file.average_rating.toFixed(1)} ★
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-2 px-4 border-b text-center">
                  No files available. Please upload a file.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunityOperated;