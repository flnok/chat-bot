import axios from 'axios';
import { useContext, createContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();
  if (!auth.isLogIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export function AuthProvider({ children }) {
  const [isLogIn, setIsLogin] = useLocalStorage('isLog', null);

  const login = (user, callback) => {
    setIsLogin(user);
    callback();
  };
  const logout = (callback) => {
    localStorage.clear();
    axios.post('api/auth/logout');
    callback();
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ isLogIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
