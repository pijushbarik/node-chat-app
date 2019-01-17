const generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime()
  };
};

const generateLocationMessage = (from, cords) => {
  return {
    from,
    url: `https://www.google.com/maps/?q=${cords.latitude},${cords.longitude}`,
    createdAt: new Date().getTime()
  }
};

module.exports = { generateMessage, generateLocationMessage };