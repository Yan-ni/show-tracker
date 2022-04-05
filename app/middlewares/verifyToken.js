const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.sendStatus(401);

  const token = authorization.split(' ')[1];

  if (!token) return res.sendStatus(401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) return res.sendStatus(401);

  req.user = decoded;

  return next();
};
