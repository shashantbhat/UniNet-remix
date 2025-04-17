import React, { useState } from "react";
import "../Styles/AdvancedSearchModal.css"; // Import the CSS file

interface AdvancedSearchModalProps {
  tags: { id: number; name: string }[];
  isOpen: boolean;
  onClose: () => void;
  onSearch: (selectedTags: number[], relevanceScores: { [key: number]: number }) => void;
}

const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  tags,
  isOpen,
  onClose,
  onSearch,
}) => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [relevanceScores, setRelevanceScores] = useState<{
    [key: number]: number;
  }>({});

  const handleTagSelection = (tagId: number) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tagId)
        ? prevSelectedTags.filter((id) => id !== tagId)
        : [...prevSelectedTags, tagId]
    );
  };

  const handleRelevanceScoreChange = (tagId: number, score: number) => {
    setRelevanceScores((prevScores) => ({
      ...prevScores,
      [tagId]: score,
    }));
  };

  const handleSearch = () => {
    onSearch(selectedTags, relevanceScores);
    onClose(); // Close the modal after search
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-md">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h1 className="text-2xl font-bold mb-4">Advanced Search</h1>
        <hr />
        <h1 className="text-xl font-semibold mb-4 pt-4">
          Enter Prompt (AI Tag Analysis)
        </h1>
        <form>
          <div className="flex items-center mb-2 w-full">
            <input
              type="text"
              className="rounded-xl bg-gray-100 w-full h-auto p-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-black transition-all hover:border-black duration-200"
              placeholder="Enter prompt"
            />
          </div>
        </form>
        <h1 className="text-xl font-semibold mb-4 pt-4">Search using tags:</h1>
        <form>
          <div className="flex flex-wrap">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center mb-2">
                <div
                  className={`px-3 py-1 m-1 hover:bg-gray-400 bg-gray-200 cursor-pointer rounded-full ${
                    selectedTags.includes(tag.id) ? "bg-gray-400" : ""
                  }`}
                  onClick={() => handleTagSelection(tag.id)}
                >
                  {tag.name}
                </div>
              </div>
            ))}
          </div>
          <hr />
          <div className="mt-4">
            {selectedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              return (
                <div key={tagId} className="flex items-center mb-2">
                  <div className="w-1/2">
                    <span className="mr-2 px-3 py-1 bg-gray-200 cursor-pointer rounded-full">
                      {tag?.name}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={relevanceScores[tagId] || 0}
                    onChange={(e) =>
                      handleRelevanceScoreChange(
                        tagId,
                        parseFloat(e.target.value)
                      )
                    }
                    className="slider ml-2"
                  />
                  <span className="ml-2">{relevanceScores[tagId] || 0}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="border border-black bg-white text-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition mr-2"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="border border-black bg-black text-white px-4 py-2 rounded-xl hover:bg-white hover:text-black transition"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;
