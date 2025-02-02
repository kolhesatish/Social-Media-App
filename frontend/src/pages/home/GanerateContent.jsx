import { useState } from "react";
import axios from "axios";

const GeminiTextGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/posts/generate', { prompt });
      setResponse(res.data.generatedContent);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Failed to generate text. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Gemini AI Text Generator</h1>
      <textarea
        className="w-80 p-2 border border-gray-300 rounded-lg mb-4"
        rows="3"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Text"}
      </button>
      {response && (
        <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg w-80">
          <p className="text-gray-700">{response}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiTextGenerator;