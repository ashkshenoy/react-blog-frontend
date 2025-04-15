import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-white font-bold text-xl">
              Blog
            </Link>
            
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <span className="text-gray-300">Welcome, {currentUser}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-gray-300 hover:text-white 
                           hover:bg-gray-700 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 text-white bg-blue-500 
                           hover:bg-blue-600 rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;