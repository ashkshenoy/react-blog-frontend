import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiInstance } from '../api/axios';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // First try to use the post from navigation state
        if (location.state?.post) {
          const { title, content, category, tags } = location.state.post;
          setTitle(title);
          setContent(content);
          setCategory(category || '');
          setTags(Array.isArray(tags) ? tags.join(', ') : tags || '');
          setLoading(false);
          return;
        }

        // If no state, fetch from API
        const response = await apiInstance.get(`/posts/${id}`);
        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category || '');
        setTags(Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '');
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post');
      }
      setLoading(false);
    };

    fetchPost();
  }, [id, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiInstance.put(`/posts/${id}`, {
        title,
        content,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });

      navigate('/', {
        state: { 
          refresh: true,
          message: 'Post updated successfully!'
        }
      });
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error.response?.data?.message || 'Failed to update post');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-6 p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="app-background min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="glass-card p-8 rounded-xl animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-6">Edit Post</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Title</label>
              <input
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                         focus:ring-1 focus:ring-blue-500"
                placeholder="Enter title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Content</label>
              <textarea
                rows="8"
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                         focus:ring-1 focus:ring-blue-500"
                placeholder="Enter content"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Category</label>
              <input
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                         focus:ring-1 focus:ring-blue-500"
                placeholder="Enter category"
                value={category}
                onChange={e => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Tags</label>
              <input
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                         focus:ring-1 focus:ring-blue-500"
                placeholder="Enter tags (comma-separated)"
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
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}