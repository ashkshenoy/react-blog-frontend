import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiInstance } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentCard from './CommentCard';

export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const fetchComments = async () => {
    try {
      const response = await apiInstance.get(`/posts/${postId}/comments`);
      setComments(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching comments:', err);
      if (err.response?.status === 403) {
        navigate('/login', { state: { from: window.location.pathname } });
      } else {
        setError('Failed to load comments');
      }
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiInstance.post(`/posts/${postId}/comments`, {
        content: newComment.trim()
      });
      
      setComments(prev => [...prev, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      if (err.response?.status === 403) {
        navigate('/login', { state: { from: window.location.pathname } });
      } else {
        setError('Failed to add comment');
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
            className="flex-1 p-2 bg-white border border-gray-300 rounded-lg 
                     text-gray-800 placeholder-gray-500 focus:outline-none 
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white 
                     ${loading 
                       ? 'bg-blue-400 cursor-not-allowed' 
                       : 'bg-blue-500 hover:bg-blue-600'}`}
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600">
            Please{' '}
            <button 
              onClick={() => navigate('/login', { 
                state: { from: window.location.pathname } 
              })}
              className="text-blue-500 hover:text-blue-600"
            >
              log in
            </button>
            {' '}to add comments
          </span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
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