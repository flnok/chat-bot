import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';
import { useAuth } from '../../hooks/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validate, setValidate] = useState(true);
  const auth = useAuth();
  let navigate = useNavigate();
  let location = useLocation();

  const handleSubmit = async (event) => {
    const from = location.state?.from?.pathname || '/';
    event.preventDefault();
    try {
      const response = await axios({
        method: 'post',
        url: '/api/auth/login',
        data: { username, password },
      });

      if (response.data.code === 400) {
        setValidate(false);
      } else {
        setValidate(true);
        auth.login(() => {
          navigate(from, { replace: true });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkInformation(validate);
  }, [validate]);

  function checkInformation(validate) {
    return (
      !validate && (
        <div className="alert alert-danger my-2" role="alert">
          Sai tên tài khoản hoặc mật khẩu
        </div>
      )
    );
  }

  return (
    <>
      <div className="login mb-3 mb-sm-0">
        <h1 className="display-5 text-center mb-5">Đăng nhập</h1>
        <form onSubmit={handleSubmit} className="container">
          <div className="mb-3 form-floating">
            <input
              type="text"
              name="username"
              className="form-control"
              id="inputUsername"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="something"
            />
            <label htmlFor="inputUsername">Username</label>
          </div>
          <div className="mb-3 form-floating">
            <input
              type="password"
              name="password"
              className="form-control"
              id="inputPassword"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="something"
            />
            <label htmlFor="inputPassword">Password</label>
          </div>
          <button type="submit" className="btn btn-primary my-2">
            Submit
          </button>
          {checkInformation(validate)}
        </form>
      </div>
    </>
  );
}
