import { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import { LoaderFunction,json ,} from "@remix-run/node";
import pool from "~/utils/db.server"

// 
import { Form, useLoaderData } from "@remix-run/react";
import authenticator from "~/utils/auth.server";
import { sessionStorage } from "~/utils/session.server";

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

  const [files, setFiles] = useState<File[]>([]);
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
      }

      alert("File uploaded and metadata saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload file or save metadata.");
    } finally {
      setUploading(false);
    }
  };

  return (
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}