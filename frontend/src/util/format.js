export const formatArray = (str) => {
  return typeof str === 'string' && str
    ? str
        ?.trim()
        ?.toLowerCase()
        .split(',')
        .filter(Boolean)
        .map((s) => s.trim())
    : str;
};

export const formatPayload = (payload) => {
  return JSON.parse(`[${payload}]`);
};

export const mapParams = (arr, text) => {
  if (!arr || !text) return null;
  const valueArr = text.trim().split(',').filter(Boolean);
  const result = {};
  arr.forEach((key, index) => (result[key] = valueArr[index]?.trim()));
  return result;
};
