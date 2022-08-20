import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../apis';
import { useAuth } from '../context';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ isError: false, message: '' });
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async event => {
    const from = location.state?.from?.pathname || '/dashboard';
    event.preventDefault();

    const response = await login({ username, password });

    if (response.status === 200) {
      auth.login(response.data?.user, () => {
        navigate(from, { replace: true });
      });
    } else {
      setError({ isError: true, message: response.data?.message });
    }
  };

  if (auth.isLogIn) {
    navigate('/dashboard');
  } else
    return (
      <>
        <div className='login mb-3 mb-sm-0'>
          <h1 className='display-5 text-center mb-5'>Đăng nhập</h1>
          <form onSubmit={handleSubmit} className='container'>
            <div className='mb-3 form-floating'>
              <input
                type='text'
                name='username'
                className='form-control'
                id='inputUsername'
                onChange={e => {
                  setUsername(e.target.value);
                }}
                value={username}
                placeholder='something'
              />
              <label htmlFor='inputUsername'>Username</label>
            </div>
            <div className='mb-3 form-floating'>
              <input
                type='password'
                name='password'
                className='form-control'
                id='inputPassword'
                onChange={e => {
                  setPassword(e.target.value);
                }}
                value={password}
                placeholder='something'
              />
              <label htmlFor='inputPassword'>Password</label>
            </div>
            <button type='submit' className='btn btn-danger my-2'>
              Login
            </button>
          </form>
          <ShowError error={error} />
        </div>
      </>
    );
}

function ShowError({ error }) {
  if (!error.isError) return;
  return (
    <div className='alert alert-danger my-2' role='alert'>
      {error.message}
    </div>
  );
}
