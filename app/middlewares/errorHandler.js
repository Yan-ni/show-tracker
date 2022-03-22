module.exports = (error, req, res, next) => {
  res.statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.json({
    message: error.message,
    name: error.name,
    errors: error.errors,
    stack: process.env.NODE_ENV === 'development' ? error.stack : '',
  });
}