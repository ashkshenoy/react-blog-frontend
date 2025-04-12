export default function PostCard({ post, currentUser, onDelete, onEdit, isOwner }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2 text-white">{post.title}</h2>
      <p className="text-gray-300 mb-4">{post.content}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {post.category && (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
            {post.category}
          </span>
        )}
        {Array.isArray(post.tags) && post.tags.map((tag, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-gray-700/30 text-gray-300 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
        <span className="text-sm text-gray-400">
          By {typeof post.author === 'object' ? post.author.username : post.author}
        </span>
        {isOwner && (
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(post.id)}
              className="text-blue-400 hover:text-blue-300"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}