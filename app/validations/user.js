const Joi = require('joi');

const loginSchema = Joi.object().keys({
  username: Joi.string().alphanum().required().messages({
    'string.empty': '"username" is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': '"password" is required'
  })
});

const signupSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(15).required().messages({
    'string.empty': '"username" is required'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': '"email" is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': '"password" is required'
  })
});

module.exports = {
  loginSchema,
  signupSchema
}