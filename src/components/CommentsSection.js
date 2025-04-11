import { useEffect, useState } from 'react';
import { apiInstance } from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const fetchComments = async () => {
    try {
      const response = await apiInstance.get(`posts/${postId}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      if (err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const addComment = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await apiInstance.post(`posts/${postId}/comment`, {
        content: text.trim()
      });

      if (response.data) {
        console.log('Comment added successfully:', response.data);
        setText('');
        await fetchComments();
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Comment error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      setError(error.response?.data?.message || "Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    await addComment();
  };

  return (
    <div className="mt-4 border-t pt-2">
      <h3 className="font-semibold mb-2">Comments</h3>
      {error && (
        <div className="text-red-600 text-sm mb-2">{error}</div>
      )}
      {comments.map((comment, index) => (
        <div key={comment.id || index} className="text-sm text-gray-700 border-b py-1">
          <p>{comment.content}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a comment"
          className="flex-1 p-2 border rounded"
          disabled={loading}
          required
        />
        <button 
          type="submit"
          className={`px-4 py-2 text-white rounded ${
            loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}