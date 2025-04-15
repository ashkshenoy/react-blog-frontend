import { useEffect, useState } from 'react';
import { apiInstance } from '../api/axios';
import PostCard from '../components/PostCard';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/maincss.css';
import { summarizeContent } from "../api/aiService";


export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loadingSummaries, setLoadingSummaries] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp && payload.exp * 1000 > Date.now()) {
              const username = typeof payload.sub === 'object' ?
                payload.sub.username :
                String(payload.sub);
              setCurrentUser(username);
              setIsAuthenticated(true);
              await fetchData();
            } else {
              handleLogout();
            }
          }
        } catch (error) {
          console.error("Auth error:", error);
          handleLogout();
        }
      } else {
        handleLogout();
      }
      setLoading(false);
    };

    checkAuthAndFetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!posts) return;

    const filtered = posts.filter(post => {
      const categoryMatch = !selectedCategory || post.category === selectedCategory;
      const tagMatch = !selectedTag || (post.tags && post.tags.includes(selectedTag));
      return categoryMatch && tagMatch;
    });

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, selectedTag]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setPosts([]);
    setCategories([]);
    setTags([]);
    setError(null);
  };

  useEffect(() => {
    setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
    setCurrentPage(1);
  }, [filteredPosts]);

  const getCurrentPosts = () => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  };

  const handleSummaryToggle = async (postId, content) => {
    setSummaries(prev => ({
      ...prev,
      [postId]: prev[postId] ? null : prev[postId]
    }));

    if (!summaries[postId]) {
      try {
        setLoadingSummaries(prev => ({ ...prev, [postId]: true }));
        const summary = await summarizeContent(content);
        setSummaries(prev => ({ ...prev, [postId]: summary }));
      } catch (error) {
        console.error("Failed to generate summary:", error);
        setSummaries(prev => ({ ...prev, [postId]: "⚠️ Failed to generate summary." }));
      } finally {
        setLoadingSummaries(prev => ({ ...prev, [postId]: false }));
      }
    }
  };

  const PaginationControls = () => {
    return (
      <div className="flex justify-center items-center gap-3 mt-10">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full text-gray-400 hover:text-white transition disabled:opacity-30 bg-white/5"
      >
        Previous
      </button>
      <span className="text-gray-300 text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full text-gray-400 hover:text-white transition disabled:opacity-30 bg-white/5"
      >
        Next
      </button>
    </div>
    );
  };

  const fetchData = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const postsRes = await apiInstance.get("/posts");

      if (postsRes?.data) {
        const transformedPosts = postsRes.data.map(post => ({
          ...post,
          category: post.categoryName || post.category || '',
          tags: post.tagNames || post.tags || []
        }));

        setPosts(transformedPosts);

        const uniqueCategories = [...new Set(transformedPosts
          .filter(post => post.category && post.category.trim())
          .map(post => post.category))];

        const uniqueTags = [...new Set(transformedPosts
          .flatMap(post => Array.isArray(post.tags) ? post.tags : [])
          .filter(tag => tag && tag.trim()))];

        setCategories(uniqueCategories);
        setTags(uniqueTags);
        setFilteredPosts(transformedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedTag("");
  };

  const handleTagChange = (e) => {
    const tag = e.target.value;
    setSelectedTag(tag);
    setSelectedCategory("");
  };

  const handleEdit = (postId) => {
    const postToEdit = posts.find(p => p.id === postId);
    if (postToEdit) {
      navigate(`/edit/${postId}`, {
        state: { post: postToEdit }
      });
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await apiInstance.delete(`/posts/${id}`);
      if (response.status === 200 || response.status === 204) {
        setPosts(currentPosts => currentPosts.filter(post => post.id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.response?.data?.message || "Failed to delete post");
    }
  };

  // Check if current user is the author of the post
  const isPostOwner = (postAuthor) => {
    const authorName = typeof postAuthor === 'object' ? postAuthor?.username : postAuthor;
    return currentUser === authorName;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen app-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="relative flex items-center justify-center min-h-screen bg-center bg-cover app-background"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center text-gray-200 p-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Wonted Blogs ✍️
          </h1>
          <p className="text-lg">
            Please log in to explore and write meaningful posts. You're just one step away from sharing your voice with the world.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-background min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 mb-10 shadow-sm border border-white/10 transition-all">
  <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <h1 className="text-3xl sm:text-4xl font-semibold text-gray-100 text-center">
        Wonted Blogs — You are what you write.
      </h1>
      {isAuthenticated && currentUser && (
        <span className="text-gray-400 text-lg mt-2 sm:mt-0">
          Welcome back, <span className="font-medium text-blue-300">{currentUser}</span>
        </span>
      )}
    </div>
    <button
      onClick={fetchData}
      disabled={loading}
      className="px-4 py-2.5 rounded-full border border-gray-500 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition"
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ) : (
        'Refresh'
      )}
    </button>
  </div>
</div>
        {/* Filters */}
        <div className="flex justify-between items-center mb-10 gap-4">
  <select
    onChange={handleCategoryChange}
    value={selectedCategory}
    className="px-5 py-2 rounded-full bg-white/10 text-sm text-gray-200 border border-white/20 focus:outline-none"
  >
    <option value="">All Categories</option>
    {categories.map((cat, idx) => (
      <option key={idx} value={cat}>{cat}</option>
    ))}
  </select>
  <button
    onClick={() => navigate("/create")}
    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-full shadow transition"
  >
    + Create New Blog
  </button>
  <select
    onChange={handleTagChange}
    value={selectedTag}
    className="px-5 py-2 rounded-full bg-white/10 text-sm text-gray-200 border border-white/20 focus:outline-none"
  >
    <option value="">All Tags</option>
    {tags.map((tag, idx) => (
      <option key={idx} value={tag}>{tag}</option>
    ))}
  </select>
</div>

        {/* Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentPosts().map((post) => (
           <div key={post.id} className="flex">
              <PostCard post={post} onDelete={deletePost} onEdit={handleEdit} 
              currentUser={currentUser} 
              isOwner={isPostOwner(post.author)}  />
              
            </div>
          ))}
        </div>

        <PaginationControls />
      </div>
    </div>
  );
}