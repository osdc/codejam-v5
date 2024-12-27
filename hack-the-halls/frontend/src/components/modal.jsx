import React, { useState, useContext } from "react";
import { UserContext } from "../context/userContext";

const Modal = ({ isOpen, onClose, title, initialTags, onTagsUpdate }) => {
  const [tags, setTags] = useState(initialTags);
  const [newTag, setNewTag] = useState("");

  const { selectedLectureId } = useContext(UserContext);

  // Handle ESC key press
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      console.log("tags added", updatedTags);
      setTags(updatedTags);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    console.log("tags removed", updatedTags);
    setTags(updatedTags);
  };

  const handleSave = () => {
    onClose();
    console.log("tags saved", tags);
    onTagsUpdate?.(tags, selectedLectureId);
  };

  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto"
        onClick={handleModalClick}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          {/* Tag Input Form */}
          <form onSubmit={handleAddTag} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a new tag..."
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add
              </button>
            </div>
          </form>

          {/* Tags Display */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full"
              >
                <span className="text-sm text-gray-700">{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// // Example usage component
// const Example = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [tags, setTags] = useState(["react", "tailwind", "javascript"]);

//   const handleTagsUpdate = (newTags) => {
//     setTags(newTags);
//   };

//   return (
//     <div className="">
//       <button
//         onClick={() => setIsOpen(true)}
//         className="bg-transparent text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//       >
//         Manage Tags
//       </button>

//       <Modal
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//         title="Manage Tags"
//         initialTags={tags}
//         onTagsUpdate={handleTagsUpdate}
//       />
//     </div>
//   );
// };

export default Modal;
