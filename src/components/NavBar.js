import { useNavigate, Link } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');
  const username = isAuthenticated ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).sub : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); // Force refresh to update auth state
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Blog App
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-medium">{username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}