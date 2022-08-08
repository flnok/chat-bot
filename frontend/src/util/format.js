export const formatArray = (str) => {
  return typeof str === 'string' && str
    ? str
        ?.trim()
        ?.toLowerCase()
        .split(',')
        .map((s) => s.trim())
    : str;
};
export const formatPayload = (payload) => {
  return JSON.parse(`[${payload}]`);
};
