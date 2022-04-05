module.exports = (error, req, res, next) => {
  res.statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let errors;

  if (error.name === 'ValidationError') {
    res.statusCode = 400;
    errors = error.details.map(({ message, path }) => ({
      message,
      path,
    }));
  }

  res.json({
    message: error.message,
    name: error.name,
    errors,
    stack: process.env.NODE_ENV === 'development' ? error.stack : '',
  });
};
