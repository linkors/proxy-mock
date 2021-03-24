const getExtension = function (path) {
  try {
    return path.split('.').pop();
  } catch (e) {
    return '';
  }
}

module.exports = {
  getExtension,
}