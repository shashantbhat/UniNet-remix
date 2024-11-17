import { useState } from "react";

export default function StudyMaterial() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleUploadToCloud = async () => {
    // Logic to upload files to cloud storage
    // Example: Using AWS S3, Firebase, or another cloud storage service
    console.log("Files to upload:", files);
    alert("Upload logic to cloud storage goes here.");
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Study Material</h1>

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
        onClick={handleUploadToCloud}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Upload to Cloud
      </button>
    </div>
  );
}