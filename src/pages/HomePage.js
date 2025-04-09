import { useEffect, useState } from 'react';
import api from '../api/axios';
import CommentsSection from '../components/CommentsSection';
import PostCard from '../components/PostCard';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUser(payload.sub); // assuming 'sub' is username
    }
  }, []);

  const deletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    }
  };
  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
    api.get("/tags").then(res => setTags(res.data));
  }, []);

  useEffect(() => {
    let url = "/posts";
    if (selectedCategory) url = `/posts/category/${selectedCategory}`;
    else if (selectedTag) url = `/posts/tag/${selectedTag}`;
  
    api.get(url)
      .then(res => setPosts(res.data))
      .catch(() => alert("Failed to load posts"));
  }, [selectedCategory, selectedTag]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Blog Feed</h1>
      <div className="flex gap-4 mb-4">
    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="p-2 border rounded">
    <option value="">All Categories</option>
    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
    </select>

   <select value={selectedTag} onChange={e => setSelectedTag(e.target.value)} className="p-2 border rounded">
    <option value="">All Tags</option>
    {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
    </select>
    </div>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul className="space-y-4">
         {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onDelete={deletePost}
              />
            ))}
        </ul>
      )}
    </div>
  );
}
