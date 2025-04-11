import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PostCard from './components/PostCard';
import CreatePostPage from './pages/CreatePostPage';
import PrivateRoute from './components/PrivateRoute';
import RegisterPage from './pages/RegisterPage';
import NavBar from './components/NavBar';
import EditPostPage from './pages/EditPostPage';
import PostFeed from './components/PostFeed';
import CommentsSection from './components/CommentsSection';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; 
import ProtectedRoute from './components/ProtectedRoute';
const dummyPost = {
  title: "A Scenic Weekend in Coorg",
  excerpt: "Coorg is a beautiful hill station known for its lush greenery and coffee plantations.",
  author: "Sebastian"
};

const App = () => (
  <Router>
    <div className="max-w-2xl mx-auto p-4">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage/>} />

        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } 
                />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreatePostPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditPostPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  </Router>
);

export default App;
