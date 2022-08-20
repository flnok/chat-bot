import axios from 'axios';

export const login = async ({ username, password }) => {
  const { data, status } = await axios
    .post('/api/auth/login', { username, password })
    .catch(err => {
      return { data: err.response.data, status: err.response.status };
    });
  return { data, status };
};
