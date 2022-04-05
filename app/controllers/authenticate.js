const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User, Collection } = require('../models');
const ValidationError = require('../config/ValidationError');
const { loginSchema, signupSchema } = require('../validations/authenticate');

const createJWT = (user) =>
  jwt.sign(
    {
      id: user.user_id,
      username: user.username,
    },
    process.env.JWT_SECRET,
  );

module.exports = {
  login: async (req, res, next) => {
    try {
      const loginCredentials = Joi.attempt(req.body, loginSchema, { abortEarly: false });

      const user = await User.findOne({ where: { username: loginCredentials.username } });

      if (!user) throw new ValidationError('wrong username', [
        {
          message: 'wrong username',
          path: ['username'],
        },
      ]);

      const result = await bcrypt.compare(loginCredentials.password, user.password);

      if (!result) throw new ValidationError('wrong password', [
        {
          message: 'wrong password',
          path: ['password'],
        },
      ]);

      res.json({ authorization: `Bearer ${createJWT(user)}` });
    } catch (error) {
      next(error);
    }
  },
  signup: async (req, res, next) => {
    try {
      const newUser = Joi.attempt(req.body, signupSchema, { abortEarly: false });

      newUser.password = await bcrypt.hash(newUser.password, 10);

      const dbRes = await User.create(newUser);

      await Collection.create({
        user_id: dbRes.user_id,
        collection_name: 'Collection',
      });

      res
        .status(201)
        .json({ authorization: `Bearer ${createJWT(dbRes)}` });
    } catch (error) {
      next(error);
    }
  },
};
