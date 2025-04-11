// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import {apiInstance} from '../api/axios';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add this line
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    let isMounted = true;  // Add mounted flag

    const checkAuth = async () => {
      console.log("=== Auth Check ===");
      const token = localStorage.getItem("token");
      
      if (!token && isMounted) {
        console.log("No token found - redirecting to login");
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate('/login');
        return;
      }

      try {
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid token format');

        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          throw new Error('Token expired');
        }

        if (isMounted) {
          setCurrentUser(payload.sub);
          setIsAuthenticated(true);
          console.log("User authenticated:", payload.sub);
          await fetchData();  // Wait for data fetch
        }
      } catch (error) {
        console.error("Auth error:", error.message);
        localStorage.removeItem("token");
        if (isMounted) {
          setCurrentUser(null);
          setIsAuthenticated(false);
          navigate('/login');
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;  // Cleanup on unmount
    };
  }, [navigate]);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            navigate('/login');
            return;
        }

        // Update URLs to match backend endpoints
        let url = "/posts";  // Base URL from BlogPostController
        if (selectedCategory) url = `/api/posts/category/${selectedCategory}`;
        else if (selectedTag) url = `/api/posts/tag/${selectedTag}`;

        // For now, just fetch posts since we don't have category/tag endpoints
        const postsRes = await apiInstance.get(url);

        if (postsRes?.data) {
            setPosts(postsRes.data);
            console.log('Posts fetched successfully');
            
            // Extract unique categories and tags from posts
            const uniqueCategories = [...new Set(postsRes.data
                .filter(post => post.category)
                .map(post => post.category))];
            
            const uniqueTags = [...new Set(postsRes.data
                .flatMap(post => post.tags || []))];
            
            setCategories(uniqueCategories);
            setTags(uniqueTags);
        }
    } catch (error) {
        console.error("Data fetch error:", {
            status: error.response?.status,
            message: error.message
        });
        
        if (error.response?.status === 403 || error.response?.status === 401) {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            navigate('/login');
        }
    } finally {
        setLoading(false);
    }
};
  // Remove duplicate useEffect for categories and tags
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, selectedCategory, selectedTag]);

  // ...rest of your component code...


  // Handler for when a category is selected
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedTag(""); // reset tag filter
  };

  // Handler for when a tag is selected
  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
    setSelectedCategory(""); // reset category filter
  };

  // Fetch posts whenever selected filters change
  // In the posts fetching useEffect


  // Delete action
  const deletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await apiInstance.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Blog Feed</h1>
      <div className="flex gap-4 mb-4">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedTag}
          onChange={handleTagChange}
          className="p-2 border rounded"
        >
          <option value="">All Tags</option>
          {tags.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id}>
              <PostCard
                post={post}
                currentUser={currentUser}
                onDelete={deletePost}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
