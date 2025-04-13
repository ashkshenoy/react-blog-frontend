import { formatDistanceToNow } from 'date-fns';

export default function CommentCard({ comment, currentUser, onDelete }) {
  const isOwner = currentUser === comment.author.username;

  return (
    <div className="p-4 bg-white/5 rounded-lg animate-fade-in">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-medium">
            {comment.author.username}
          </span>
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        {isOwner && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Delete
          </button>
        )}
      </div>
      <p className="text-gray-300 break-words">{comment.content}</p>
    </div>
  );
}