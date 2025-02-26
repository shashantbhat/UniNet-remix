import { useState, useEffect, useCallback } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import { LoaderFunction, json } from "@remix-run/node";
import pool from "~/utils/db.server";
import { Form, useLoaderData } from "@remix-run/react";
import authenticator from "~/utils/auth.server";
import { sessionStorage } from "~/utils/session.server";
import { useNavigate } from "react-router-dom";

export let loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in",
  });

  const client = await pool.connect();
  const result = await client.query("SELECT * FROM file_tags");
  const tags = result.rows;

  return json({ user, tags });
};

export const action = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const file = formData.get("file") as File;
    const tags = formData.getAll("tags").map((tag) => tag.toString());

    if (!file || !title || tags.length === 0) {
      throw new Error("Missing required fields");
    }

    const { id: uploaderId, university_id: universityId } =
      await authenticator.isAuthenticated(request);

    // Azure Blob Storage Upload
    const accountName = "uninetfilestorage";
    const sasToken =
      "sp=racwdli&st=2025-02-25T14:48:01Z&se=2026-06-15T22:48:01Z&sip=0.0.0.0-255.255.255.255&sv=2022-11-02&sr=c&sig=5nKLpwpwwlXWw72EgaXUV%2BBp7NfDPgkjOZXrvllT76s%3D";
    const containerName = "blobby";

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blockBlobClient = containerClient.getBlockBlobClient(file.name);
    const fileBuffer = await file.arrayBuffer();
    await blockBlobClient.uploadData(fileBuffer);

    const fileUrl = blockBlobClient.url;

    // Save Metadata in PostgreSQL
    const query = `
      INSERT INTO files (
        uploader_id, university_id, title, description, file_url
      ) VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [uploaderId, universityId, title, description, fileUrl];

    await pool.query(query, values);

    // Loop through all the tags and save them in file_tag_assingments table with fields file_id and tag_id and relevance score as 1
    const tagQuery = `
      INSERT INTO file_tag_assignments (file_id, tag_id, relevance_score)
      VALUES ($1, $2, $3)
    `;
    const fileQuery = `
      SELECT id FROM files WHERE file_url = $1
    `;
    const fileValues = [fileUrl];
    const fileResult = await pool.query(fileQuery, fileValues);
    const fileId = fileResult.rows[0].id; // Get the file ID  of the uploaded file

    for (const tag of tags) { 
      const tag_id_query = `
      SELECT id FROM file_tags WHERE name = $1
    `;
      const tag_id = await pool.query(tag_id_query, [tag]);
      if (tag_id.rows.length === 0) {
        const new_tag_query = `
          INSERT INTO file_tags (name) VALUES ($1)
          RETURNING id
        `;
        const new_tag_values = [tag];
        const new_tag_result = await pool.query(new_tag_query, new_tag_values);
        tag_id.rows.push(new_tag_result.rows[0]);
      }
      console.log(tag_id);
      const tagQueryValues = [fileId, tag_id.rows[0].id, 1];
      await pool.query(tagQuery, tagQueryValues);
    }

    return json({ message: "File uploaded and metadata saved successfully" });
  } catch (error) {
    console.error("Error:", error);
    return json(
      { error: "Failed to upload file or save metadata" },
      { status: 500 }
    );
  }
};

export default function StudyMaterial() {
  const { user, tags } = useLoaderData(); // Contains { user, tags }

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = event.target.value;
    if (selectedTag && !formData.tags.includes(selectedTag)) {
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, selectedTag],
      }));
    }
  };

  const handleNewTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };

  const addNewTag = () => {
    // Add new tag to the tags list
    // const new_tag_query=`
    // INSERT INTO file_tags (name) VALUES ($1)
    // `;
    // const new_tag_values=[newTag];
    // pool.query(new_tag_query,new_tag_values);

    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, newTag],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formData.tags.forEach((tag) => formDataToSend.append("tags", tag));
      files.forEach((file) => formDataToSend.append("file", file));

      const response = await fetch("", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file or save metadata");
        navigate("/404");
      }

      alert("File uploaded and metadata saved successfully!");
      navigate(`/dash/{$id}/community-operated`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload file or save metadata.");
      navigate("/404");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div
        className={`flex flex-col gap-6 bg-gray-50 bg-opacity-90 rounded-3xl shadow-2xl p-8 w-full transition-opacity duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Study Material</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          {/* Title Input */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"
            />
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"
            />
          </div>

          {/* Tag Dropdown */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tag
            </label>
            <div className="flex gap-2">
              <select
                name="tag"
                value=""
                onChange={handleTagChange}
                className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"
              >
                <option value="">Select a tag</option>
                {tags.map((tag: { id: number; name: string }) => (
                  <option key={tag.id} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newTag}
                onChange={handleNewTagChange}
                placeholder="New tag name"
                className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"
              />
              <button
                type="button"
                onClick={addNewTag}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Selected Tags */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Selected Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload Files
            </label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              required
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 
            ${
              uploading
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  ></path>
                </svg>
                <span>Upload</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
