import axios from 'axios';

export const fetchBookings = async () => {
  const { data, status } = await axios.get('/api/bookings').catch(err => {
    return { data: err.response.data, status: err.response.status };
  });
  return { data, status };
};

export const fetchIntents = async () => {
  const { data, status } = await axios.get('/api/intents', { withCredentials: true }).catch(err => {
    return { data: err.response.data, status: err.response.status };
  });
  return { data, status };
};
