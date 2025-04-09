import { useState } from 'react';
import api from '../api/axios';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/posts", { title, content });
      alert("Post created!");
    } catch (err) {
      alert("Error creating post");
    }
  };

  const handleAIGenerate = async () => {
    setAiGenerating(true);
    try {
      const res = await api.post("/ai/generate", { title, content });
      setContent(res.data.generatedContent);
    } catch {
      alert("AI failed");
    }
    setAiGenerating(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          rows="8"
          className="w-full p-2 border rounded"
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className="flex gap-4">
          <button
            type="button"
            className="bg-purple-500 text-white px-4 py-2 rounded"
            onClick={handleAIGenerate}
            disabled={aiGenerating}
          >
            {aiGenerating ? "Generating..." : "Use AI"}
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
