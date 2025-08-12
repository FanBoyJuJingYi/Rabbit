import { useState, useRef } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

const SimpleEditor = ({ content, setContent }) => {
  const [isPreview, setIsPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    setContent(e.target.value);
  };

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);

    const newText = `${before}${text}${after}`;
    setContent(newText);

    // Reset cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.imageUrl;
      const markdownImage = `\n\n![Image](${imageUrl})\n\n`;
      insertAtCursor(markdownImage);
    } catch (err) {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const renderMarkdown = (text) => {
    const lines = text.split("\n");

    return lines.map((line, i) => {
      // Headings
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-bold mb-2">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        return (
          <h1 key={i} className="text-2xl font-bold mb-3">
            {line.slice(2)}
          </h1>
        );
      }

      // Bold
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i}>
            <strong>{line.slice(2, -2)}</strong>
          </p>
        );
      }

      // Images in line
      const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
      const elements = [];
      let lastIndex = 0;
      let match;

      while ((match = imageRegex.exec(line)) !== null) {
        const before = line.substring(lastIndex, match.index);
        if (before) elements.push(before);

        elements.push(
          <img
            key={`img-${i}-${match.index}`}
            src={match[2]}
            alt={match[1]}
            className="my-4 max-w-full rounded"
          />
        );

        lastIndex = match.index + match[0].length;
      }

      const after = line.substring(lastIndex);
      if (after) elements.push(after);

      return <p key={i}>{elements.length > 0 ? elements : line || <br />}</p>;
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-6">
      {/* Toolbar */}
      <div className="bg-gray-100 p-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded ${
              !isPreview ? "bg-white shadow" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded ${
              isPreview ? "bg-white shadow" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Preview
          </button>
        </div>

        {/* Upload Button */}
        <div className="flex items-center space-x-2">
          <label className="text-sm bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
          </label>
          {uploading && (
            <span className="text-xs text-gray-500">Uploading...</span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 px-4 py-2 text-sm">{error}</div>}

      {/* Content Area */}
      {!isPreview ? (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextareaChange}
          className="w-full p-4 min-h-[300px] focus:outline-none"
          placeholder="Write your post content here..."
        />
      ) : (
        <div className="p-4 bg-white min-h-[300px] prose">
          {renderMarkdown(content)}
        </div>
      )}
    </div>
  );
};

export default SimpleEditor;
