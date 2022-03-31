const { Collection } = require("../models");
const { collectionSchema } = require("../validations/collection");
const Joi = require('joi');

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
  create: async (req, res, next) => {
    try {
      let newCollection = Joi.attempt(req.body, collectionSchema);

      newCollection.user_id = req.user.id;

      const dbRes = await Collection.create(newCollection);

      res.status(201).json(dbRes);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    const collection_id = req.params.id;

    try {
      const collection = Joi.attempt(req.body, collectionSchema);

      const dbRes = await Collection.findOne({ where: { collection_id } });

      if (!dbRes) throw new Error("collection doesn't exist");

      if (dbRes.user_id !== req.user.id) {
        res.statusCode = 403;
        throw new Error("Forbidden");
      }

      await Collection.update(collection, { where: { collection_id } });

      res.sendStatus(202);
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    const collection_id = req.params.id;

    if (!collection_id) return next(new Error("collection id required"));

    try {
      const dbRes = await Collection.findOne({ where: { collection_id } });

      if (!dbRes) throw new Error("collection doesn't exist");

      if (dbRes.user_id !== req.user.id) {
        res.statusCode = 403;
        throw new Error("Forbidden");
      }
      
      await Collection.destroy({ where: { collection_id } });

      const count = await getUserCollectionsCount(req.user.id);

      if(count === 0) {
        await CreateDefaultCollection(req.user.id);
        return res.status(202).json(dbRes);
      }

      res.sendStatus(202);
    } catch (error) {
      next(error);
    }
  },
};
