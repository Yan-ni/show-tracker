const Joi = require('joi');

const collectionSchema = Joi.object().keys({
  collection_name: Joi.string().trim().min(2).max(15).required().messages({
    'string.empty': '"name" is required'
  }).label('name')
});

module.exports = {
  collectionSchema
}