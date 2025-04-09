import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

export default function NavBar() {
  const token = localStorage.getItem("token");

  return (
    <nav className="bg-gray-100 p-4 flex justify-between">
      <div className="space-x-4">
        <Link to="/" className="font-semibold">Home</Link>
        {token && <Link to="/create">Create Post</Link>}
      </div>
      <div className="space-x-4">
        {token ? <LogoutButton /> : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
