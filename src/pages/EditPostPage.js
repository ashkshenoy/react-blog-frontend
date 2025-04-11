import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiInstance } from '../api/axios';

export default function EditPostPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiInstance.get(`/posts/${id}`).then(res => {
      setTitle(res.data.title);
      setContent(res.data.content);
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await apiInstance.put(`/posts/${id}`, { title, content });
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          rows="8"
          className="w-full p-2 border rounded"
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Update Post
        </button>
      </form>
    </div>
  );
}
