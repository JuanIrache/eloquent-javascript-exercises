module.exports = function(array) {
  const choice = Math.floor(Math.random() * array.length);
  return array[choice];
};
