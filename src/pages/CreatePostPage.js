import { useState } from 'react';
import  {apiInstance} from '../api/axios';
import { summarizeContent, generateTags } from "../api/aiService";
import { useNavigate } from 'react-router-dom';
export default function CreatePostPage() {
  const [title, setTitle] = useState(''); 
  const [content, setContent] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  // Added error state
  const [category, setCategory] = useState(''); // Add category state
  const navigate = useNavigate(); 
  const [tags, setTags] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiInstance.post('/posts', {
        title,
        content,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });
      
      if (response.status === 201 || response.status === 200) {
        // Force an immediate refresh when redirecting to home
        navigate('/', { 
          state: { 
            refresh: true,
            message: 'Post created successfully!' 
          },
          replace: true  // Replace current history entry
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    setAiGenerating(true);
    try {
      const summaryResult = await summarizeContent(content);
      const tagsResult = await generateTags(content);

      setSummary(summaryResult);
      setSuggestedTags(tagsResult); // Store AI tags as array
      setTags(tagsResult.join(', ')); // Convert to comma-separated string for input
      const res = await apiInstance.post("/ai/generate", { title, content });
      setContent(res.data.generatedContent);
    } catch (error) {
      setError("AI generation failed");
    } finally {
      setAiGenerating(false);
    }
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
        <input
          className="w-full p-2 border rounded"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <div className="flex gap-4">
          <button
            type="button"
            className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleAIGenerate}
            disabled={aiGenerating || !content}
          >
            {aiGenerating ? "Generating..." : "Use AI"}
          </button>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading || !title || !content}
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>

      {summary && (
        <div className="bg-gray-100 p-3 rounded mt-4">
          <strong>Suggested Summary:</strong>
          <p>{summary}</p>
        </div>
      )}

      {suggestedTags.length > 0 && (
        <div className="bg-gray-100 p-3 rounded mt-4">
          <strong>Suggested Tags:</strong>
          <p>{suggestedTags.join(", ")}</p>
        </div>
      )}
    </div>
  );
}