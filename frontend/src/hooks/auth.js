import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../components/App';

export function useAuth() {
  return React.useContext(AuthContext);
}

export function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
