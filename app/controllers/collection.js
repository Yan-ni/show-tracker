const { User, Collection, Show } = require("../models");

class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
    this.name = "ValidationError";
  }
}

const getUserCollectionsCount = (user_id) =>
  new Promise((resolve, reject) =>
    Collection.findAll({ where: { user_id } })
      .then((dbRes) => resolve(dbRes.length))
      .catch((error) => reject(error))
  );

const CreateDefaultCollection = (user_id) =>
  new Promise((resolve, reject) =>
    Collection.create({ user_id, collection_name: "Collection" })
      .then(dbRes => resolve(dbRes))
      .catch((error) => reject(error))
  );

module.exports = {
  get: (req, res, next) => {
    const collection_id = req.params.id;

    if (collection_id) {
      return Collection.findOne({
        where: { collection_id },
        attributes: ["user_id", "collection_id", "collection_name"],
        include: [
          {
            model: Show,
            attributes: [
              "show_id",
              "show_name",
              "show_description",
              "seasons_watched",
              "episodes_watched",
              "collection_id",
            ],
          },
        ],
      })
        .then((dbRes) => {
          if (!dbRes) return next(new Error("incorrect collection id"));

          if (dbRes.user_id !== req.user.id) {
            res.statusCode = 403;
            return next(new Error("Forbidden"));
          }

          return res.json(dbRes);
        })
        .catch((error) => next(error));
    }

    Collection.findAll({
      where: { user_id: req.user.id },
      attributes: ["user_id", "collection_id", "collection_name"],
      include: [
        {
          model: Show,
          attributes: [
            "show_id",
            "show_name",
            "show_description",
            "seasons_watched",
            "episodes_watched",
            "collection_id",
          ],
        },
      ],
    })
      .then((dbRes) => res.json(dbRes))
      .catch((error) => next(error));
  },
  create: (req, res, next) => {
    const collection_name =
      req.body.collection_name && req.body.collection_name.trim();

    if (!collection_name || !collection_name.length)
      return next(
        new ValidationError("collection name is required", [
          {
            field: "collection_name",
            message: "collection name is required",
          },
        ])
      );

    Collection.create(
      { collection_name, user_id: req.user.id }
    )
      .then((dbRes) => res.status(201).json(dbRes))
      .catch((error) => next(error));
  },
  update: (req, res, next) => {
    const collection_id = req.params.id;
    const collection_name = req.body && req.body.collection_name;

    if (!collection_name) return next(new Error("collection name is required"));

    Collection.findOne({ where: { collection_id } })
      .then((dbRes) => {
        console.log(dbRes);

        if (!dbRes) return next(new Error("incorrect collection id"));

        if (dbRes.user_id !== req.user.id) {
          res.statusCode = 403;
          return next(new Error("Forbidden"));
        }

        Collection.update({ collection_name }, { where: { collection_id } })
          .then(() => res.sendStatus(200))
          .catch((error) => next(error));
      })
      .catch((error) => next(error));
  },
  delete: (req, res, next) => {
    const collection_id = req.params.id;

    if (!collection_id) return next(new Error("collection id required"));

    Collection.findOne({ where: { collection_id } }).then((dbRes) => {
      if (!dbRes) return next(new Error("incorrect collection id"));

      if (dbRes.user_id !== req.user.id) return next(new Error("Forbidden"));

      Collection.destroy({ where: { collection_id } })
        .then(() => {
          getUserCollectionsCount(req.user.id).then((count) => {
            if (!count) {
              return CreateDefaultCollection(req.user.id)
                .then(dbRes => res.status(202).json(dbRes))
                .catch((error) => next(error));
            }

            res.sendStatus(202);
          });
        })
        .catch((error) => next(error));
    });
  },
};
