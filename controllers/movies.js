const Movies = require("../models/movie");

module.exports.getMovies = (req, res, next) => {
  Movies.find({}).then((movies) => res.send(movies))
  .catch(next)
};
