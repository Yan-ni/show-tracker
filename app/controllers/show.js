const { Show, Collection } = require("../models");
const ValidationError = require('../config/ValidationError');
const { showSchema } = require('../validations/show');

module.exports = {
  create: (req, res, next) => {
    const collection_id = req.body.collection_id;
    const show = {
      show_name: req.body.show_name,
      show_description: req.body.show_description,
      seasons_watched: req.body.seasons_watched,
      episodes_watched: req.body.episodes_watched,
    };

    if (!collection_id) return next(new Error("collection id is required"));

    const { error } = showSchema.validate(show, { abortEarly: false });

    if(error) return next(error);

    Collection.findOne({ where: { collection_id } })
      .then((dbRes) => {
        if (dbRes.user_id !== req.user.id) return next(new Error("Forbidden"));

        Show.create({ collection_id, ...show })
          .then((dbRes) => res.status(201).json(dbRes))
          .catch((error) => next(error));
      })
      .catch((error) => next(error));
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
  },
  delete: (req, res, next) => {
    const show_id = req.params.id;

    

    res.json(show_id);
  },
};
