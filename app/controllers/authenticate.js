const { User, Collection } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validateEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
    this.name = "ValidationError";
  }
}

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
    const username = req.body.username && req.body.username.trim();
    const password = req.body.password;

    if (!username || !username.length || !password || !password.length)
      return next(
        new ValidationError("username and password are required", [
          {
            field: "username",
            message: "username is required",
          },
          {
            field: "password",
            message: "password is required",
          },
        ])
      );

    const user = await User.findOne({ where: { username } });

    if (!user)
      return next(
        new ValidationError("wrong username", [
          {
            field: "username",
            message: "wrong username",
          },
        ])
      );

    bcrypt.compare(password, user.password, (error, result) => {
      if (error) return next(error);

      if (!result)
        return next(
          new ValidationError("wrong password", [
            {
              field: "password",
              message: "wrong password",
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
  signup: (req, res, next) => {
    let { username, email, password } = req.body;

    username = username && username.trim();

    if (!username || !password || !email)
      return next(new Error("username, email and password are required"));

    if (!validateEmail(email)) return next(new Error("invalid email address"));

    if (password.length < 8)
      return next(new Error("password must be at least 8 characters long"));

    bcrypt.hash(req.body.password, 10, (error, hash) => {
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
