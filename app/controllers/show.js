const { Show, Collection } = require("../models");

class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
    this.name = "ValidationError";
  }
}

module.exports = {
  create: (req, res, next) => {
    const collection_id = req.body.collection_id;
    const show = {
      show_name: req.body.show_name?.trim(),
      show_description: req.body.show_description,
      seasons_watched: req.body.seasons_watched,
      episodes_watched: req.body.episodes_watched,
    };

    if (!collection_id) return next(new Error("collection id is required"));

    if(!show.show_name)
    return next(
      new ValidationError("show name is required", [
        {
          message: "show name is required",
          field: "show_name",
        },
      ])
    );

    if (show.show_name.length >= 30)
      return next(
        new ValidationError("the show name can't exceed 30 characters", [
          {
            message: "the show name can't exceed 30 characters",
            field: "show_name",
          },
        ])
      );

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

    if (!show) return next(new Error("Nothing has been modifed"));

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
