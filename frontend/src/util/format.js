export const formatArray = (str) => {
  return typeof str === 'string' && str
    ? str?.trim()?.toLowerCase().split(',')
    : str;
};
export const formatPayload = (payload) => {
  return JSON.parse(`[${payload}]`);
};
