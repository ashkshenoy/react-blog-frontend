import { useEffect, useState } from 'react';
import { apiInstance } from '../api/axios';
import PostCard from '../components/PostCard';
import { useNavigate, useLocation } from 'react-router-dom';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (token && isMounted) {
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
            }
          }
        } catch (error) {
          console.error("Auth error:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    checkAuth();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (location.state?.refresh && isAuthenticated) {
      fetchData();
      navigate('/', { 
        replace: true,
        state: {} 
      });
    }
  }, [location.state, isAuthenticated, navigate]);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    try {
      const postsRes = await apiInstance.get("/posts");
      if (postsRes?.data) {
        setPosts(postsRes.data);
        
        const uniqueCategories = [...new Set(postsRes.data
          .filter(post => post.category)
          .map(post => post.category))];
        
        const uniqueTags = [...new Set(postsRes.data
          .flatMap(post => post.tags || []))];
        
        setCategories(uniqueCategories);
        setTags(uniqueTags);
      }
    } catch (error) {
      console.error("Data fetch error:", error);
      setError("Failed to load posts");
      if (error.response?.status === 401 || error.response?.status === 403) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedTag("");
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
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
    
    setLoading(true);
    try {
      const response = await apiInstance.delete(`/posts/${id}`);
      if (response.status === 200 || response.status === 204) {
        setPosts(currentPosts => currentPosts.filter(post => post.id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.response?.data?.message || "Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          {isAuthenticated && currentUser && (
            <span className="text-gray-600">
              Welcome, <span className="font-medium">{currentUser}</span>
            </span>
          )}
        </div>
        
        {!isAuthenticated ? (
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Register
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/create')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Post
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {!isAuthenticated ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome to Blog App</h2>
          <p className="text-gray-600">Please login or register to view and create posts.</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">No posts found.</p>
          <button
            onClick={() => navigate('/create')}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Create your first post
          </button>
        </div>
      ) : (
        <>
          {categories.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Filters</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="p-2 border rounded flex-1 text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((c, index) => (
                    <option key={index} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={selectedTag}
                  onChange={handleTagChange}
                  className="p-2 border rounded flex-1 text-sm"
                >
                  <option value="">All Tags</option>
                  {tags.map((t, index) => (
                    <option key={index} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          <ul className="space-y-6">
            {posts
              .filter(post => {
                if (selectedCategory && post.category !== selectedCategory) return false;
                if (selectedTag && (!post.tags || !post.tags.includes(selectedTag))) return false;
                return true;
              })
              .map(post => {
                const postAuthor = typeof post.author === 'object' ? post.author.username : String(post.author);
                const userString = typeof currentUser === 'object' ? currentUser.username : String(currentUser);
                
                return (
                  <li key={post.id} className="bg-white rounded-lg shadow">
                    <PostCard
                      post={post}
                      currentUser={userString}
                      onDelete={() => deletePost(post.id)}
                      onEdit={() => handleEdit(post.id)}
                      isOwner={postAuthor === userString}
                    />
                  </li>
                );
              })}
          </ul>
        </>
      )}
    </div>
  );
}