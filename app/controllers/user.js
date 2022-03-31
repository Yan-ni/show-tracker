const { User, Collection, Show } = require('../models')

module.exports = {
  get: (req, res, next) => {
    User.findOne({
      where: {
        user_id: req.user.id
      },
      attributes: [ 'user_id', 'username', 'email' ],
      include: [
        {
          model: Collection,
          attributes: ['collection_id', 'collection_name'],
          include: [ {
            model: Show,
            attributes: [ 'show_id', 'show_name', 'show_description', 'seasons_watched', 'episodes_watched', 'collection_id' ]
          } ]
        }
      ]
    }).then(dbRes => res.json(dbRes))
    .catch(error => next(error));
  }
}