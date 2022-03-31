const { Show, Collection } = require("../models");
const ValidationError = require('../config/ValidationError');
const showSchema = require('../validations/show');
const Joi = require('joi');

module.exports = {
  create: async (req, res, next) => {
    try {
      const newShow = Joi.attempt(req.body, showSchema.create, { abortEarly: false });
      
      const collection_dbRes = await Collection.findOne({ where: { collection_id: newShow.collection_id } });

      if (collection_dbRes.user_id !== req.user.id) {
        res.statusCode = 403;
        throw new Error("Forbidden");
      }

      const show_dbRes = await Show.create(newShow);

      res.status(201).json(show_dbRes);
    } catch (error) {
      next(error);
    }
  },
  update: (req, res, next) => {
    const show_id = req.params.id;
    const show = req.body;

    const { error } = showSchema.validate(show, { abortEarly: false });

    if(error) return next(error);

    delete show.show_id;
    delete show.collection_id;

    if (!Object.keys(show).length)
      return next(new Error("Nothing has been modifed"));

    Show.update(show, { where: { show_id } })
      .then(() => res.sendStatus(200))
      .catch((error) => next(error));
  }
};
