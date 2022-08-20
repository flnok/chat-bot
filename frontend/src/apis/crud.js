import axios from 'axios';

export const axiosQuery = async (type, request) => {
  const { data } = await axios.post(`/api/query/${type}`, request);
  return data;
};

export const deleteBookingById = async id => {
  const { data, status } = await axios.delete(`/api/bookings/${id}`).catch(err => {
    return { data: err.response.data, status: err.response.status };
  });
  return { data, status };
};

export const createIntent = async dto => {
  const { data, status } = await axios.post(`/api/intents`, dto).catch(err => {
    return { data: err.response.data, status: err.response.status };
  });
  return { data, status };
};

export const getIntentById = async id => {
  const { data, status } = await axios.get(`/api/intents/${id}`).catch(err => {
    return { data: err.response.data, status: err.response.status };
  });
  return { data, status };
};

export const deleteIntentById = async id => {
  const { data, status } = await axios.delete(`/api/intents/${id}`).catch(err => {
    return { data: err.response.data, status: err.response.status };
  });
  return { data, status };
};

export const updateIntent = async (id, dto) => {
  const { data, status } = await axios.put(`/api/intents/${id}`, dto).catch(err => {
    return { data: err.response.data, status: err.response.status };
  });
  return { data, status };
};
