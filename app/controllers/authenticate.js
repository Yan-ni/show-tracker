const { User, Collection } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ValidationError = require("../config/ValidationError");
const { loginSchema, signupSchema } = require("../validations/user");

const createJWTToken = (user) =>
  jwt.sign(
    {
      id: user.user_id,
      username: user.username,
    },
    process.env.JWT_SECRET
  );

module.exports = {
  login: async (req, res, next) => {
    const { username, password } = req.body;

    const { error } = loginSchema.validate(
      { username, password },
      { abortEarly: false }
    );

    if (error) return next(error);

    const user = await User.findOne({ where: { username } });

    if (!user)
      return next(
        new ValidationError("wrong username", [
          {
            message: "wrong username",
            path: ["username"],
          },
        ])
      );

    bcrypt.compare(password, user.password, (error, result) => {
      if (error) return next(error);

      if (!result)
        return next(
          new ValidationError("wrong password", [
            {
              message: "wrong password",
              path: ["password"],
            },
          ])
        );

      try {
        res.json({ authorization: `Bearer ${createJWTToken(user)}` });
      } catch (error) {
        next(error);
      }
    });
  },
  signup: async (req, res, next) => {
    let { username, email, password } = req.body;

    const { error } = signupSchema.validate(
      { username, email, password },
      { abortEarly: false }
    );

    if (error) return next(error);

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) return next(error);

      password = hash;

      User.create({ username, email, password })
        .then((dbRes) => {
          Collection.create({
            collection_name: "Collection",
            user_id: dbRes.user_id,
          });
          res
            .status(201)
            .json({ authorization: `Bearer ${createJWTToken(dbRes)}` });
        })
        .catch((error) => next(error));
    });
  },
};
