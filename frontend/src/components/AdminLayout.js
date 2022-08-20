import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { Header } from './';

export default function AdminLayout() {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.isLogIn) navigate('/login');

  return (
    <>
      <div className='header'>
        <Header />
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}
