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
    <div className="max-w-xl mx-auto mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Post</h2>
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
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}