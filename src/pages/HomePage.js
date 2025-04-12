import { useEffect, useState } from 'react';
import { apiInstance } from '../api/axios';
import PostCard from '../components/PostCard';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/maincss.css';

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
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  // Check auth status and fetch posts on mount and auth state changes
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
    if (location.state?.refresh && isAuthenticated) {
      fetchData();
      navigate('/', { replace: true, state: {} });
    }
  }, [location.state, isAuthenticated, navigate]);

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
    // Calculate total pages based on filtered posts
    setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filteredPosts, postsPerPage]);

  const getCurrentPosts = () => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  };

  const PaginationControls = () => {
    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-gray-300 hover:text-white 
                   transition-all duration-200 disabled:opacity-50
                   hover:bg-white/10 rounded-lg"
        >
          Previous
        </button>
        <span className="text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-gray-300 hover:text-white 
                   transition-all duration-200 disabled:opacity-50
                   hover:bg-white/10 rounded-lg"
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
        // Transform posts to include category and tags
        const transformedPosts = postsRes.data.map(post => ({
          ...post,
          // Use categoryName if available, fallback to finding category by ID
          category: post.categoryName || post.category || '',
          // Use tagNames if available, fallback to finding tags by IDs
          tags: post.tagNames || post.tags || []
        }));
  
        console.log('Transformed posts:', transformedPosts);
        setPosts(transformedPosts);
        
        // Extract unique categories and tags
        const uniqueCategories = [...new Set(transformedPosts
          .filter(post => post.category && post.category.trim())
          .map(post => post.category))];
        
        const uniqueTags = [...new Set(transformedPosts
          .flatMap(post => Array.isArray(post.tags) ? post.tags : [])
          .filter(tag => tag && tag.trim()))];
        
        console.log('Extracted categories:', uniqueCategories);
        console.log('Extracted tags:', uniqueTags);
        
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
    setSelectedTag(""); // Reset tag when category changes
  };

  const handleTagChange = (e) => {
    const tag = e.target.value;
    setSelectedTag(tag);
    setSelectedCategory(""); // Reset category when tag changes
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen app-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="app-background min-h-screen py-12">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header Section */}
      <div className="glass-card p-8 mb-8 animate-fade-in rounded-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent 
                         bg-gradient-to-r from-blue-400 to-indigo-400">
              Blog Posts
            </h1>
            {isAuthenticated && currentUser && (
              <span className="text-gray-300 text-lg">
                Welcome, <span className="font-medium text-blue-400">{currentUser}</span>
              </span>
            )}
          </div>
            
            <div className="flex gap-4">
              {isAuthenticated && (
                <>
                  <button
                    onClick={fetchData}
                    disabled={loading}
                    className="px-4 py-2.5 text-gray-300 hover:text-white 
                         transition-all duration-200 flex items-center gap-2
                         hover:bg-white/10 rounded-lg"
                  >
                    <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {loading ? 'Refreshing...' : 'Refresh'}
                  </button>
                  <button
                    onClick={() => navigate('/create')}
                    className="px-6 py-2.5 bg-blue-500/90 text-white rounded-lg 
                         hover:bg-blue-600 transition-all duration-200 
                         shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
                         hover:-translate-y-0.5"
                  >
                    New Post
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2.5 bg-blue-500/90 text-white rounded-lg 
                         hover:bg-blue-600 transition-all duration-200
                         shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
                         hover:-translate-y-0.5"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-2.5 border border-white/20 text-gray-300 
                         rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg shadow animate-fade-in">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {!isAuthenticated ? (
            <div className="glass-card p-8 text-center animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">Welcome to Blog App</h2>
              <p className="text-gray-300 text-lg">Please login or register to view and create posts.</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="glass-card p-8 text-center animate-fade-in">
              <p className="text-gray-300 text-lg mb-4">
                {posts.length === 0 ? "No posts found." : "No posts match the selected filters."}
              </p>
              {posts.length === 0 && (
                <button
                  onClick={() => navigate('/create')}
                  className="text-blue-500 hover:text-blue-600 font-medium text-lg"
                >
                  Create your first post
                </button>
              )}
            </div>
          ) : (
            // Replace your existing grid section with this
<>
  {categories.length > 0 && (
    <div className="glass-card p-6 animate-fade-in rounded-xl mb-6">
      <h2 className="text-lg font-medium text-gray-200 mb-4 
                   border-l-4 border-blue-500 pl-3">
        Tags
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag("")}
          className={`px-3 py-1 rounded-full text-sm transition-all duration-200
                    ${!selectedTag 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}`}
        >
          All
        </button>
        {tags.map((tag, index) => (
          <button
            key={index}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-all duration-200
                      ${selectedTag === tag 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  )}
              
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {getCurrentPosts().map(post => {
      const postAuthor = typeof post.author === 'object' 
        ? post.author.username 
        : String(post.author);
      const userString = typeof currentUser === 'object' 
        ? currentUser.username 
        : String(currentUser);
      
      return (
        <div key={post.id} className="glass-card animate-fade-in">
          <PostCard
            post={post}
            currentUser={userString}
            onDelete={() => deletePost(post.id)}
            onEdit={() => handleEdit(post.id)}
            isOwner={postAuthor === userString}
          />
        </div>
      );
    })}
  </div>

  {totalPages > 1 && <PaginationControls />}
</>
          )}
        </div>
      </div>
    </div>
  );
}