const Joi = require('joi');

module.exports = Joi.object().keys({
  collection_name: Joi.string().trim().min(2).max(15).required().messages({
    'string.empty': '"collection name" is required'
  }).label('collection name')
});
