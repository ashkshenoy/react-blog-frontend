import React from 'react';

const PostCard = ({ post }) => (
  <div className="bg-white shadow-md rounded-2xl p-4 my-4">
    <h2 className="text-xl font-semibold">{post.title}</h2>
    <p className="text-gray-600 mt-2">{post.excerpt}</p>
    <div className="text-sm text-gray-400 mt-4">By {post.author}</div>
  </div>
);

export default PostCard;
