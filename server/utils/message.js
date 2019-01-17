const moment = require('moment');

const generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

const generateLocationMessage = (from, cords) => {
  return {
    from,
    url: `https://www.google.com/maps/?q=${cords.latitude},${cords.longitude}`,
    createdAt: moment().valueOf()
  }
};

module.exports = { generateMessage, generateLocationMessage };