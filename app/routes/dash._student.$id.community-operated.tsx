import React, { useState, useEffect, useRef } from "react";
import { useLoaderData, useParams } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import pool from "~/utils/db.server";
import authenticator from "~/utils/auth.server";
import DropdownMenu from "~/components/dropDownMenu";
import AdvancedSearchModal from "~/components/AdvancedSearchModal";

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
    const filesResult = await client.query(
      "SELECT * FROM files WHERE university_id = $1",
      [universityId]
    );

    // Fetch all tags
    const tagsResult = await client.query("SELECT * FROM file_tags");

    // Fetch file-tag assignments
    const fileTagAssignmentsResult = await client.query(
      "SELECT * FROM file_tag_assignments"
    );

    return json({
      files: filesResult.rows,
      tags: tagsResult.rows,
      fileTagAssignments: fileTagAssignmentsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching files or tags:", error);
    return json({ error: "Failed to fetch files or tags" }, { status: 500 });
  } finally {
    client.release();
  }
};

const CommunityOperated = () => {
  const { files, tags, fileTagAssignments } = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredFiles, setFilteredFiles] = useState(files);

  const handleSearch = (selectedTags: number[], relevanceScores: { [key: number]: number }) => {
    // Filter files based on selected tags and relevance scores
    const filtered = files.filter((file) => {
      const fileTags = fileTagAssignments.filter(
        (assignment) => assignment.file_id === file.id
      );

      // Check if all selected tags meet the relevance score criteria
      return selectedTags.every((tagId) => {
        const tagAssignment = fileTags.find((assignment) => assignment.tag_id === tagId);
        return tagAssignment && tagAssignment.relevance_score >= relevanceScores[tagId];
      });
    });

    setFilteredFiles(filtered);
    setIsModalOpen(false); // Close the modal after search
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div
        className={`flex flex-col gap-4 bg-gray-100 bg-opacity-75 rounded-3xl shadow-lg p-6 w-full transition-opacity duration-1000`}
      >
        <div className="flex justify-between items-center w-full">
          <button
            className="flex items-center gap-2 border border-black bg-white text-black hover:bg-black hover:text-white py-2.5 px-4 rounded-xl text-sm font-medium transition"
            onClick={() => {
              window.location.href = `/dash/id/upload-material`;
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

          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 border border-black bg-white text-black hover:bg-black hover:text-white py-2.5 px-4 rounded-xl text-sm font-medium transition"
              onClick={() => setIsModalOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64Zm8,72h72a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm88,48H40a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16Zm109.66,13.66a8,8,0,0,1-11.32,0L206,177.36A40,40,0,1,1,217.36,166l20.3,20.3A8,8,0,0,1,237.66,197.66ZM184,168a24,24,0,1,0-24-24A24,24,0,0,0,184,168Z"></path>
              </svg>
              <span>Adv Search</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="min-w-full bg-white table-fixed">
            <thead>
              <tr className="h-12">
                <th className="py-2 px-4 border-b text-center w-40">
                  File Name
                </th>
                <th className="py-2 px-4 border-b text-center w-64">
                  Description
                </th>
                <th className="py-2 px-4 border-b text-center w-36">
                  Upload Date
                </th>
                <th className="py-2 px-4 border-b text-center w-32">
                  Average Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles?.map((file: any) => (
                <tr key={file.id} className="h-10">
                  <td className="py-2 px-2 border-b text-center w-40 truncate">
                    <a
                      href={`/dash/id/files/${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-black"
                    >
                      {file.title}
                    </a>
                  </td>
                  <td className="py-2 px-2 border-b text-center w-64">
                    <span className="line-clamp-1">{file.description}</span>
                  </td>
                  <td className="py-2 px-2 border-b text-center w-36 truncate">
                    {new Date(file.upload_date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-2 border-b text-center w-32 truncate">
                    {file.average_rating.toFixed(1)} ★
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AdvancedSearchModal
        tags={tags}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default CommunityOperated;