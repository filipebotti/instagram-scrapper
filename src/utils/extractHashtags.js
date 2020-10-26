let matcher = /[#]+[A-Za-z0-9-_]+/g;
module.exports = (text) => {
  return text.match(matcher) || [];
};
