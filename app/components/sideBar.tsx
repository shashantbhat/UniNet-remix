import { useParams } from "@remix-run/react";
import { useState } from "react";

export default function Sidebar() {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-64 bg-[#fafafa] text-[#333333] flex flex-col">
      <nav className="flex flex-col p-4">
        {/* Dropdown Header */}
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="font-medium">Study Material</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="pl-4 mt-2 space-y-2">
            <a
              href={`/dash/${id}/community-operated`}
              className="block text-gray-700 hover:text-gray-500 px-4 py-2 rounded-lg"
            >
              Community operated
            </a>
            <a
              href="/404"
              className="block text-gray-700 hover:text-gray-500 px-4 py-2 rounded-lg"
            >
              College operated
            </a>
          </div>
        )}
      </nav>
    </div>
  );
}