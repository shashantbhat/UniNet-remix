import React from "react";

interface DropdownMenuProps {
  tags: { id: number; name: string }[];
  selectedTags: number[];
  onSelectTag: (tagId: number) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ tags, selectedTags, onSelectTag }) => {
  return (
    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
      <div className="flex justify-center items-center py-2">
        <span className="text-center">Search using tags:</span>
      </div>
      <ul className="py-2">
        {tags.map((tag) => (
          <li
            key={tag.id}
            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedTags.includes(tag.id) ? 'bg-gray-200' : ''}`}
            onClick={() => onSelectTag(tag.id)}
          >
            {tag.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;