import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiInstance } from '../api/axios';
import CommentCard from './CommentCard';

export default function CommentsSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      const response = await apiInstance.get(`/posts/${postId}/comments`);
      setComments(response.data);
      setError(''); // Clear any existing errors
    } catch (err) {
      console.error('Error fetching comments:', err);
      // Don't set error for 403 if user is not logged in
      if (err.response?.status === 403 && !currentUser) {
        return;
      }
      setError('Failed to load comments');
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    // Check authentication first
    if (!currentUser) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiInstance.post(`/posts/${postId}/comments`, {
        content: newComment.trim()
      });
      
      if (response.data) {
        setComments(prev => [...prev, response.data]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      
      // Handle different error scenarios
      if (err.response?.status === 403) {
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login', { state: { from: window.location.pathname } });
      } else if (err.message === 'No authentication token found') {
        navigate('/login', { state: { from: window.location.pathname } });
      } else {
        setError('Failed to add comment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentUser ? (
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 bg-white/5 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400/80 focus:outline-none 
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500/90 text-white rounded-lg 
                     hover:bg-blue-600 transition-all duration-200
                     disabled:bg-blue-500/50 disabled:cursor-not-allowed"
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      ) : (
        <div className="text-center p-4 bg-white/5 rounded-lg">
          <span className="text-gray-400">
            Please{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300"
            >
              log in
            </button>
            {' '}to add comments
          </span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/50 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {comments.map(comment => (
          <CommentCard
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
}