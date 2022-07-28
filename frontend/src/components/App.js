import Layout from './Layout';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from '../hooks/auth';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  let value = {
    loggedIn,
    login: (cb) => {
      setLoggedIn(true);
      cb();
    },
    logout: (cb) => {
      setLoggedIn(false);
      axios.post('api/auth/logout');
      cb();
    },
  };

  useEffect(() => {
    axios.get('api/auth/login').then((res) => {
      console.log(res);
      if (res.data.loggedIn) setLoggedIn(true);
      else setLoggedIn(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={value}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="menu" element={<Menu />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route
          path="dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}
