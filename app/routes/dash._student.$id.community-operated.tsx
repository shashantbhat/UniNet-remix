import React, { useState, useEffect } from "react";
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
  
  const files = useLoaderData(); // Files data filtered by university
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const { id } = useParams();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredFiles = files?.filter((file: any) => 
    file.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const handleSearchClick = () => {
    alert("Search clicked!");
  };
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col h-screen p-4">
      <div
        className={`flex flex-col gap-4 bg-gray-100 bg-opacity-75 rounded-3xl shadow-lg p-6 w-full transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex justify-between items-center w-full">
          {/* <button
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={() => {
              window.location.href = `/dash/${id}/upload-material`;
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              fill="currentColor" 
              viewBox="0 0 256 256"
            >
              <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-40-64a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V160H104a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16A8,8,0,0,1,160,152Z"></path>
            </svg>
            <span>Add File</span>
          </button> */}
          <button
            className="flex items-center gap-2 border border-black bg-white text-black hover:bg-black hover:text-white py-2.5 px-4 rounded-xl text-sm font-medium transition"
            onClick={() => {
              window.location.href = `/dash/${id}/upload-material`;
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              fill="currentColor" 
              viewBox="0 0 256 256"
            >
              <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-40-64a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V160H104a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16A8,8,0,0,1,160,152Z"></path>
            </svg>
            <span>Add File</span>
          </button>
          
          <div className="flex items-center gap-2 w-1/3 min-w-[300px]">
            <input
              type="text"
              placeholder="Search files"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all hover:border-black duration-200"
            />
            {/* <button
              className="flex items-center gap-2 border border-black bg-white text-black hover:bg-black hover:text-white py-2.5 px-4 rounded-xl text-sm font-medium transition"
              onClick={handleSearchClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-45.54-48.85a36.05,36.05,0,1,0-11.31,11.31l11.19,11.2a8,8,0,0,0,11.32-11.32ZM104,148a20,20,0,1,1,20,20A20,20,0,0,1,104,148Z"></path></svg>
              <span>Search</span>
            </button> */}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
        <table className="min-w-full bg-white table-fixed">
  <thead>
    <tr className="h-12"> {/* Sets uniform row height */}
      <th className="py-2 px-4 border-b text-center w-40">File Name</th>
      <th className="py-2 px-4 border-b text-center w-64">Description</th>
      <th className="py-2 px-4 border-b text-center w-36">Upload Date</th>
      <th className="py-2 px-4 border-b text-center w-32">Average Rating</th>
    </tr>
  </thead>
  <tbody>
    {filteredFiles?.map((file: any) => (
      <tr key={file.id} className="h-14"> {/* Ensures uniform row height */}
        <td className="py-2 px-4 border-b text-center w-40 truncate">
          <a
            href={`/dash/id/files/${file.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-black"
          >
            {file.title}
          </a>
        </td>
        <td className="py-2 px-4 border-b text-center w-64">
          <span className="line-clamp-2">{file.description}</span>
        </td>
        <td className="py-2 px-4 border-b text-center w-36 truncate">
          {new Date(file.upload_date).toLocaleDateString()}
        </td>
        <td className="py-2 px-4 border-b text-center w-32 truncate">
          {file.average_rating.toFixed(1)} ★
        </td>
      </tr>
    ))}
  </tbody>
</table>
        </div>
      </div>
    </div>
  );
};

export default CommunityOperated;


