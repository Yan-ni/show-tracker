const Joi = require('joi');

const showSchema = Joi.object().keys({
  show_name: Joi.string().trim().min(2).max(30).required().label('name').messages({
    'string.empty': '"name" is required'
  }),
  show_description: Joi.string().trim().label('description'),
  seasons_watched: Joi.number().label('seasons watched'),
  episodes_watched: Joi.number().label('episodes watched')
});

module.exports = {
  showSchema
}