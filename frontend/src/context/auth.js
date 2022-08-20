import axios from 'axios';
import { createContext, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  if (!auth.isLogIn) navigate('/login', { replace: true, state: location });

  return children;
}

export function AuthProvider({ children }) {
  const [isLogIn, setIsLogin] = useLocalStorage('isLog', null);

  const login = (user, callback) => {
    setIsLogin(user);
    callback();
  };
  const logout = callback => {
    localStorage.clear();
    axios.post('api/auth/logout');
    callback();
    window.location.reload();
  };

  return <AuthContext.Provider value={{ isLogIn, login, logout }}>{children}</AuthContext.Provider>;
}
