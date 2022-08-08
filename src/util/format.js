const mappingPayload = (str) => {
  if (!str) return;
  if (str?.length < 1) return null;
  const result = { text: [], payload: [] };
  str.forEach((r) => {
    switch (r.type) {
      case 'text':
        result.text = [...result.text, r.text];
        break;
      default:
        result.payload = [...result.payload, JSON.stringify(r)];
        break;
    }
  });
  return result;
};

module.exports = {
  mappingPayload,
};
