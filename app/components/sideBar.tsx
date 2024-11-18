import { useParams } from "@remix-run/react";

export default function Sidebar() {
  const { id } = useParams(); // Fetch the id from the URL
  
  return (
    <div className="w-64 bg-gray-200 text-white flex flex-col">
      <nav className="flex flex-col space-y-2 p-4">
        <a
          href={`/dash/${id}/community-operated`}
          className="text-gray-700 hover:text-gray-500"
        >
          Community operated study material
        </a>

        <a
          href="/404"
          className="text-gray-700 hover:text-gray-500"
        >
          College operated study material
        </a>
      </nav>
    </div>
  );
}