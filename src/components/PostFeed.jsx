import React, { useEffect, useState } from 'react';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagId, setTagId] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 5;

  const fetchPosts = async () => {
    const params = new URLSearchParams({
      query,
      categoryId,
      tagId,
      page,
      size: pageSize
    });

    const res = await fetch(`http://localhost:8080/api/posts/search?${params}`);
    const data = await res.json();
    setPosts(data.content || []);
    setTotalPages(data.totalPages || 1);
  };

  const fetchCategories = async () => {
    const res = await fetch('http://localhost:8080/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const fetchTags = async () => {
    const res = await fetch('http://localhost:8080/api/tags');
    const data = await res.json();
    setTags(data);
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [query, categoryId, tagId, page]);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/3"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/3"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={tagId}
          onChange={(e) => setTagId(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/3"
        >
          <option value="">All Tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="border rounded p-4 shadow">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600">{post.excerpt}</p>
          <p className="text-sm text-gray-400">By {post.authorUsername}</p>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostFeed;
