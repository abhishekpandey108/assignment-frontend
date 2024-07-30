import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { validateToken } from './validation';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const valid = await validateToken(token);
        setIsAuthenticated(valid);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, [token]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
