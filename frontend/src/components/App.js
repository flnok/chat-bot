import { Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth } from '../context/auth';
import About from '../pages/About';
import Dashboard from '../pages/admin/Dashboard';
import ChatbotDashboard from '../pages/admin/ChatbotDashboard';
import AdminLayout from '../pages/admin/AdminLayout';
import Intent from '../pages/admin/Intent';
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
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="chatbot" element={<ChatbotDashboard />} />
          <Route path="chatbot/intent/:id" element={<Intent />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
