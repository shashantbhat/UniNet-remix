import { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";

export default function StudyMaterial() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleUploadToCloud = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setUploading(true);
    try {
      const accountName = "uninetfilestorage";
      const sasToken =
        "sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2024-11-18T15:47:11Z&st=2024-11-18T07:47:11Z&spr=https&sig=fsDu97UakuPAzdv0IuLnAjdVK%2FtXEJ5LWqnATRCnSFo%3D";
      const containerName = "blobby";

      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      for (const file of files) {
        const blockBlobClient = containerClient.getBlockBlobClient(file.name);
        await blockBlobClient.uploadBrowserData(file);
      }
      // Give me the the URL of the uploaded file and print it in console
      console.log(
        `Files uploaded to Azure Blob Storage successfully. URL: ${containerClient.url}`
      );

      alert("Files uploaded to Azure Blob Storage successfully.");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert(
        "Failed to upload files. Please check the console for more details."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Study Material</h1>

      <form onSubmit={handleUploadToCloud}>
        {/* File Upload Section */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Upload Files</label>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 border border-gray-300 cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>

        {/* Uploaded Files List */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Selected Files</h2>
          <ul className="mt-2">
            {files.map((file, index) => (
              <li key={index} className="text-gray-700">
                {file.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload to Cloud"}
        </button>
      </form>
    </div>
  );
}
