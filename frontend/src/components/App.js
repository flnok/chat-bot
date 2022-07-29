import { Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth } from '../hooks/auth';
import About from '../pages/About';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Menu from '../pages/Menu';
import NotFound from '../pages/NotFound';
import Contact from '../pages/Contact';
import Layout from './Layout';

export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
