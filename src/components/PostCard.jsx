import CommentsSection from './CommentsSection';
import { useNavigate } from 'react-router-dom';

export default function PostCard({ post, currentUser, onDelete }) {
  const navigate = useNavigate();

  const isAuthor = currentUser === post.author?.username;

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="text-gray-600 mb-2">
  {(post.content || "No content available").substring(0, 100)}...
</p>

      <p className="text-sm text-blue-600 mb-2">
        Tags: {post.tags?.map(t => t.name).join(", ")}
      </p>

      {isAuthor && (
        <div className="flex gap-2 mb-2">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => navigate(`/edit/${post.id}`)}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => onDelete(post.id)}
          >
            Delete
          </button>
        </div>
      )}

      <CommentsSection postId={post.id} />
    </div>
  );
}
