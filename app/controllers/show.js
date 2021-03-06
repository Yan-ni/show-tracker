const Joi = require('joi');
const { Show, Collection } = require('../models');
const showSchema = require('../validations/show');

module.exports = {
  create: async (req, res, next) => {
    try {
      const newShow = Joi.attempt(req.body, showSchema.create, { abortEarly: false });

      const { collection_id } = newShow;
      const collection_dbRes = await Collection.findOne({ where: { collection_id } });

      if (collection_dbRes.user_id !== req.user.id) {
        res.statusCode = 403;
        throw new Error('Forbidden');
      }

      const show_dbRes = await Show.create(newShow);

      res.status(201).json(show_dbRes);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    const show_id = req.params.id;

    try {
      const show = Joi.attempt(req.body, showSchema.update, { abortEarly: false });

      const show_dbRes = await Show.findOne({ where: { show_id } });

      if (!show_dbRes) throw new Error("show doesn't exist");

      const { collection_id } = show_dbRes;
      const collection_dbRes = await Collection.findOne({ where: { collection_id } });

      if (!collection_dbRes) throw new Error("the show's collection has been deleted");

      if (collection_dbRes.user_id !== req.user.id) {
        res.statusCode = 403;
        throw new Error('Forbidden');
      }

      await Show.update(show, { where: { show_id } });

      res.sendStatus(202);
    } catch (error) {
      next(error);
    }
  },
};
