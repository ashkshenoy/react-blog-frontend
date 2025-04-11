import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('No token found in protected route - redirecting to login');
        return <Navigate to="/login" replace />;
    }
    
    return children;
}