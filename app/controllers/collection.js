const { Collection } = require("../models");
const { collectionSchema } = require("../validations/collection");

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
  create: (req, res, next) => {
    const collection_name = req.body.collection_name;

    const { error } = collectionSchema.validate({collection_name});
    
    if(error) return next(error);

    Collection.create(
      { collection_name, user_id: req.user.id }
    )
      .then((dbRes) => res.status(201).json(dbRes))
      .catch((error) => next(error));
  },
  update: (req, res, next) => {
    const collection_id = req.params.id;
    const collection_name = req.body.collection_name;

    const { error } = collectionSchema.validate({collection_name});

    if(error) return next(error);

    Collection.findOne({ where: { collection_id } })
      .then((dbRes) => {
        if (!dbRes) return next(new Error("collection doesn't exist"));

        if (dbRes.user_id !== req.user.id) {
          res.statusCode = 403;
          return next(new Error("Forbidden"));
        }

        Collection.update({ collection_name }, { where: { collection_id } })
          .then(() => res.sendStatus(202))
          .catch((error) => next(error));
      })
      .catch((error) => next(error));
  },
  delete: (req, res, next) => {
    const collection_id = req.params.id;

    if (!collection_id) return next(new Error("collection id required"));

    Collection.findOne({ where: { collection_id } }).then((dbRes) => {
      if (!dbRes) return next(new Error("collection doesn't exist"));

      if (dbRes.user_id !== req.user.id) {
        res.statusCode = 403;
        return next(new Error("Forbidden"));
      }

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
