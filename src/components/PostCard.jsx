import { useEffect, useState } from 'react';
import { apiInstance } from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import CommentsSection from './CommentsSection';

export default function PostCard({ post, currentUser, onDelete, onEdit, isOwner }) {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [hasLiked, setHasLiked] = useState(
    post.likes?.some(like => like.user?.username === currentUser)
  );
  const navigate = useNavigate();

  const getAuthorName = (author) => {
    if (!author) return 'Unknown';
    if (typeof author === 'string') return author;
    return author.username || 'Unknown';
  };

  useEffect(() => {
    if (post?.likes) {
      setLikes(post.likes.length);
      setHasLiked(post.likes.some(like =>
        like.user?.username === currentUser
      ));
    }
  }, [post, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    const prevLikes = likes;
    const prevHasLiked = hasLiked;

    try {
      const config = {
        method: hasLiked ? 'DELETE' : 'POST',
        url: `/posts/${post.id}/likes`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await apiInstance(config);
      if (response.data) {
        setLikes(response.data.totalLikes);
        setHasLiked(response.data.hasLiked);
      }
    } catch (error) {
      setLikes(prevLikes);
      setHasLiked(prevHasLiked);
      if (error.response?.status === 403) {
        if (error.response.data?.message?.includes('expired')) {
          localStorage.removeItem('token');
        }
        navigate('/login', { state: { from: window.location.pathname } });
      }
    }
  };

  const truncateContent = (content, wordLimit = 100) => {
    const words = content.split(/\s+/);
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2 text-white">{post.title}</h2>
      
      <p className="text-gray-300 mb-4">
        {truncateContent(post.content)}
        {post.content.split(/\s+/).length > 100 && (
          <Link
            to={`/posts/${post.id}`}
            className="ml-2 text-blue-400 hover:underline"
          >
            Read more
          </Link>
        )}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.category && (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
            {post.category}
          </span>
        )}
        {post.tags && post.tags.map((tag, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-gray-700/30 text-gray-300 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-gray-700/50">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            By {getAuthorName(post.author)}
          </span>
          {isOwner && (
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(post.id)}
                className="text-blue-400 hover:text-blue-300"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 ${
              hasLiked ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
            }`}
          >
            <svg 
              className="w-5 h-5" 
              fill={hasLiked ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <span>{likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            <span>Comments</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-4">
            <CommentsSection 
              postId={post.id}
              currentUser={currentUser}
            />
          </div>
        )}
      </div>
    </div>
  );
}
