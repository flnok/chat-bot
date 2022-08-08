const mappingResponsesInternal = (str) => {
  if (!str) return null;
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

const mappingResponsesToQuery = (responses) => {
  if (!responses) return null;
  const result = [];
  responses.map((res) => {
    switch (res.type) {
      case 'text':
        result.push({ text: { text: res.text } });
        break;
      case 'options':
        result.push({ type: 'options', payload: res.options });
        break;
      case 'image':
        result.push({ type: 'image', payload: res.image });
        break;
      case 'chips':
        result.push({ type: 'chips', payload: res.chips });
        break;
      default:
        break;
    }
  });
  return result;
};

module.exports = {
  mappingResponsesInternal,
  mappingResponsesToQuery,
};
