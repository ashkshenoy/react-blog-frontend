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
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-4">{post.content}</p>
      
      {post.category && (
        <div className="mb-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
            {post.category}
          </span>
        </div>
      )}
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>By {authorName}</span>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(post.id)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
               onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}