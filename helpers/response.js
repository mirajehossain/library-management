module.exports = {
  success(message, data = {}, success = true) {
    return {
      success,
      message,
      data,
    };
  },
  error(message = 'Something went wrong', error = 'Something went wrong', data = {}) {
    return {
      success: false,
      message,
      error,
      data,
    };
  },
};
