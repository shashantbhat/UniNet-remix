import { useState, useEffect, useCallback } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import { LoaderFunction, json } from "@remix-run/node";
import pool from "~/utils/db.server";
import { Form, useLoaderData } from "@remix-run/react";
import authenticator from "~/utils/auth.server";
import { sessionStorage } from "~/utils/session.server";
import { useNavigate } from 'react-router-dom';

export let loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in",
  });
};

export const action = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const file = formData.get("file") as File;

    if (!file || !title) {
      throw new Error("Missing required fields");
    }

    const { id: uploaderId, university_id: universityId } =
      await authenticator.isAuthenticated(request);

    // Azure Blob Storage Upload
    const accountName = "uninetfilestorage";
    const sasToken =
      "sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-19T01:04:20Z&st=2024-11-18T17:04:20Z&spr=https&sig=W8xjgWJg%2B1iglBBwGFZ2Ch3ztceukLpha%2BLmYc4V%2Fdc%3D";
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
  const data = useLoaderData(); // Contains { id, university_id }

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      files.forEach((file) => formDataToSend.append("file", file));

      const response = await fetch("", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file or save metadata");
        navigate('/404');
      }

      alert("File uploaded and metadata saved successfully!");
      navigate(`/dash/{$id}/community-operated`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload file or save metadata.");
      navigate('/404');

    } finally {
      setUploading(false);
    }
  };

  return (
    <div
        className={`flex flex-col gap-4 bg-gray-100 bg-opacity-75 rounded-3xl shadow-lg p-6 w-full transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
    <div className="p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Study Material</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="block w-full text-sm text-gray-500 border border-gray-300 bg-gray-50 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="block w-full text-sm text-gray-500 border border-gray-300 bg-gray-50 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Upload Files</label>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            required
            className="block w-full text-sm text-gray-500 border border-gray-300 cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 
            ${uploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            } text-white shadow-sm`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
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