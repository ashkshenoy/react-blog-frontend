import React from 'react';

export default function PostCard({ post, currentUser, onDelete, onEdit, isOwner }) {
  const handleDelete = async () => {
    try {
      await onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // Ensure post.author is rendered as a string

  const authorName = typeof post.author === 'object' ? post.author.username : String(post.author);
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2 text-white">{post.title}</h2>
      <p className="text-gray-300 mb-4">{post.content}</p>
      
      {post.category && (
        <div className="mb-2">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
            {post.category}
          </span>
        </div>
      )}
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-gray-700/30 text-gray-300 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
        <span>By {authorName}</span>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(post.id)}
              className="px-3 py-1 bg-blue-600 text-gray-100 rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
               onClick={handleDelete}
              className="px-3 py-1 bg-red-600 text-gray-100 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}