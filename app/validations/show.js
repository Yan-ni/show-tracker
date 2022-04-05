const Joi = require('joi');

const create = Joi.object().keys({
  collection_id: Joi.string().guid({ version: 'uuidv4' }).required(),
  show_name: Joi.string().trim().min(2).max(30)
    .required()
    .label('show name')
    .messages({
      'string.empty': '"show name" is required',
    }),
  show_description: Joi.string().trim().allow(null, '').label('show description'),
  seasons_watched: Joi.number().label('seasons watched'),
  episodes_watched: Joi.number().label('episodes watched'),
});

const update = Joi.object().keys({
  show_name: Joi.string().trim().min(2).max(30)
    .label('show name'),
  show_description: Joi.string().trim().allow(null, '').label('show description'),
  seasons_watched: Joi.number().label('seasons watched'),
  episodes_watched: Joi.number().label('episodes watched'),
});

module.exports = {
  create,
  update,
};
