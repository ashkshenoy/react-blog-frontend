import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiInstance } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { summarizeContent } from "../api/aiService";
// Assuming you have a function to generate summary
export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  useEffect(() => {
    const getSummary = async () => {
      if (showSummary && post?.content) {
        const result = await summarizeContent(post.content);
        setSummary(result);
      }
    };
    getSummary();
  }, [showSummary, post]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiInstance.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
        setError("Post not found");
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(typeof payload.sub === 'object' ? payload.sub.username : payload.sub);
      } catch (e) {
        console.error("JWT parse error", e);
      }
    }

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await apiInstance.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError("Failed to delete post");
    }
  };

  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!post) return <div className="text-center text-gray-300">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 app-background min-h-screen">
      <div className="glass-card p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
        <p className="text-gray-300 mb-6">{post.content}</p>

        <div className="text-sm text-gray-400 mb-6">
          <span>Category: {post.category}</span>
          <div className="flex gap-2 mt-2">
            {post.tags?.map((tag, i) => (
              <span key={i} className="bg-gray-700 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6">
            

            <button
                onClick={() => setShowSummary((prev) => !prev)}
                className="text-blue-400 hover:text-blue-300 text-sm"
                >
                {showSummary ? "Hide Summary" : "Show Summary"}
                </button>

                <AnimatePresence>
                {showSummary && (
                    <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 text-gray-300 text-sm overflow-hidden"
                    >
                    {summary}
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        <div className="flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ⬅ Back
          </button>

          {currentUser === post.author && (
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/edit/${post.id}`, { state: { post } })}
                className="text-yellow-400 hover:text-yellow-300"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
