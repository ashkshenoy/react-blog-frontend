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
      // Format tags before sending
      const formattedTags = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const postData = {
        title,
        content,
        category: category.trim(),
        tags: formattedTags
      };
  
      console.log('Submitting post data:', postData); // Debug log
  
      const response = await apiInstance.post('/posts', postData);
      console.log('Server response:', response.data); // Debug log
  
      navigate('/', { 
        state: { refresh: true }
      });
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

  // ...existing imports...

return (
  <div className="app-background min-h-screen py-12">
  <div className="max-w-2xl mx-auto px-4">
    <div className="glass-card p-8 rounded-xl animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Title</label>
          <input
            className="w-full p-3 bg-white/10 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400/80 focus:outline-none 
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                     hover:bg-white/20 transition-colors duration-200"
            placeholder="What's on your mind?"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Content</label>
          <textarea
            rows="8"
            className="w-full p-3 bg-white/10 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400/80 focus:outline-none 
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                     hover:bg-white/20 transition-colors duration-200"
            placeholder="Write your story here..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Category</label>
          <input
            className="w-full p-3 bg-white/10 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400/80 focus:outline-none 
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                     hover:bg-white/20 transition-colors duration-200"
            placeholder="e.g. Technology, Travel, Food..."
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Tags</label>
          <input
            className="w-full p-3 bg-white/10 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400/80 focus:outline-none 
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                     hover:bg-white/20 transition-colors duration-200"
            placeholder="web, coding, react (comma-separated)"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg 
                       hover:bg-white/5 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-500/90 text-white rounded-lg 
                       hover:bg-blue-600 transition-all duration-200 
                       shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
                       hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}