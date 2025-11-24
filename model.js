// example ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

export default function ProtectedRoute({ children, roles }) {
    const { user } = useUser();
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" />;
    return children;
}
