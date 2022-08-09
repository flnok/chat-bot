import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';
import DashboardHeader from './DashboardHeader';

export default function AdminLayout() {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.isLogIn) {
    console.log('Chưa đăng nhập');
    navigate('/login');
  }

  return (
    <>
      <div className="header">
        <DashboardHeader />
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}
