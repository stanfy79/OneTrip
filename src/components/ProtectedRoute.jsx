import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { auth } = useAuth();

  if (!auth.token) return <Navigate to="/auth?mode=login" />;

  if (!auth.user) return <Navigate to="/auth?mode=login" />;

  return children;
};

export default ProtectedRoute;
