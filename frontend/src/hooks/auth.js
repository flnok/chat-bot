import * as React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from '../components/App';

export function useAuth() {
  return React.useContext(AuthContext);
}

export function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
