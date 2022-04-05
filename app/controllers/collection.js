const Joi = require('joi');
const { Collection } = require('../models');
const collectionSchema = require('../validations/collection');

const getUserCollectionsCount = (user_id) =>
  Collection
    .findAll({ where: { user_id } })
    .then((dbRes) => dbRes.length);

const CreateDefaultCollection = (user_id) =>
  Collection
    .create({ user_id, collection_name: 'Collection' })
    .then((dbRes) => dbRes);

module.exports = {
  create: async (req, res, next) => {
    try {
      const newCollection = Joi.attempt(req.body, collectionSchema);

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
        throw new Error('Forbidden');
      }

      await Collection.update(collection, { where: { collection_id } });

      res.sendStatus(202);
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    const collection_id = req.params.id;

    if (!collection_id) throw new Error('collection id required');

    try {
      const collection_dbRes = await Collection.findOne({ where: { collection_id } });

      if (!collection_dbRes) throw new Error("collection doesn't exist");

      if (collection_dbRes.user_id !== req.user.id) {
        res.statusCode = 403;
        throw new Error('Forbidden');
      }

      await Collection.destroy({ where: { collection_id } });

      const count = await getUserCollectionsCount(req.user.id);

      if (count === 0) {
        const dbRes = await CreateDefaultCollection(req.user.id);
        res.status(202).json(dbRes);
      } else res.sendStatus(202);
    } catch (error) {
      next(error);
    }
  },
};
