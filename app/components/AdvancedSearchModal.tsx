import React, { useState } from "react";
import "../Styles/AdvancedSearchModal.css"; // Import the CSS file
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  const [promptInput, setPromptInput] = useState<string>(""); // State for the prompt input

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

  const AnalysePrompt = async () => {
    // Get input from the text box
    const input = promptInput; // Use the state variable for the prompt input
    console.log("Prompt Input:", input); // Corrected to use 'input' instead of 'prompt_input'

    // Send the prompt to Google Bard and ask it to analyze the prompt
    const genAI = new GoogleGenerativeAI(
      "AIzaSyAkBta4Gql98eHyenjI92zd4I-a_va11Fg"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const initialPrompt =
      "Analyse the prompt that I provide and give me give me a list of tags and their relevance scores(Range 0-1) in the format {Tag1:Score1,Tag2:Score2,...} and the tags should be strictly the ones I provided you including their spelling(if the spelling of a tag is not correct let it be that way). Also, only give me this format and nothing more.\n";
    const tagsList = tags.map((tag) => tag.name).join(", ");
    const prompt = `${initialPrompt} The Tags are: ${tagsList}\n The Prompt by user is: ${input}\n`;

    try {
      const list_of_tags = await model.generateContent(prompt);
      const response = await list_of_tags.response.text();
      console.log("Response from Google Bard:", response);

      // Parse the response to extract tags and relevance scores
      const tagScores = response
        .replace(/[\{\}]/g, "")
        .split(",")
        .map((tag) => tag.split(":").map((item) => item.trim()));
      const parsedTagScores: { [key: string]: number } = {};
      tagScores.forEach(([tag, score]) => {
        parsedTagScores[tag.toLowerCase()] = parseFloat(score); // Normalize keys to lowercase
      });
      console.log("Parsed Tag Scores:", parsedTagScores);

      // Update the relevance scores state
      const updatedRelevanceScores: { [key: number]: number } = {};
      const updatedSelectedTags: number[] = [];

      tags.forEach((tag) => {
        const tagScore = parsedTagScores[tag.name.toLowerCase()]; // Match using normalized lowercase names
        if (tagScore !== undefined) {
          updatedRelevanceScores[tag.id] = tagScore;
          updatedSelectedTags.push(tag.id);
        }
      });

      setRelevanceScores(updatedRelevanceScores);
      setSelectedTags(updatedSelectedTags);

      console.log("Updated Relevance Scores:", updatedRelevanceScores);
      console.log("Updated Selected Tags:", updatedSelectedTags);
    } catch (error) {
      console.error(
        "Error connecting to NLP Sentiment Analysis Server:",
        error
      );
    }
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
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="rounded-xl bg-gray-100 w-full h-auto p-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-black transition-all hover:border-black duration-200"
              placeholder="Enter prompt"
            />
            <button
              type="button"
              className="border border-black bg-white text-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition ml-2"
              onClick={AnalysePrompt}
            >
              Analyse
            </button>
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
