import { useEffect, useState } from 'react';
import { apiInstance } from '../api/axios';

export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    apiInstance.get(`/posts/${postId}/comments`)
        .then(res => setComments(res.data));
}, [postId]);

const addComment = async () => {
  await apiInstance.post(`/posts/${postId}/comments`, { content: text });
  setText("");
  const res = await apiInstance.get(`/posts/${postId}/comments`);
  setComments(res.data);
};

  return (
    <div className="mt-4 border-t pt-2">
      <h3 className="font-semibold mb-2">Comments</h3>
      {comments.map((c, i) => (
        <p key={i} className="text-sm text-gray-700 border-b py-1">{c.content}</p>
      ))}
      <div className="mt-2 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a comment"
          className="flex-1 p-2 border rounded"
        />
        <button onClick={addComment} className="px-4 py-2 bg-blue-500 text-white rounded">Post</button>
      </div>
    </div>
  );
}
