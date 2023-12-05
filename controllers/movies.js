const { CastError, ValidationError } = require('mongoose').Error;
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundErr');
const BadRequestError = require('../errors/badRequest');
const Movies = require('../models/movie');
const Status = require('../utils/statusCodes');

module.exports.getMovies = (req, res, next) => {
  Movies.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;
  const owner = req.user._id;
  Movies.create({
    country,
    director,
    duration,
    year,
    movieId,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner,
  })
    .then((movie) => res.status(Status.CREATED).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(
          new Error('Указаны некорректные данные при создании фильма.'),
        );
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movies.findById(req.params._id)
    .orFail(new Error('Not Found'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалять чужие фильмы.');
      }
      return Movies.findByIdAndRemove(req.params._id);
    })
    .then((deletedMovie) => {
      res.status(Status.OK_REQUEST).send(deletedMovie);
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        return next(new NotFoundError('ID не найден'));
      }
      if (err instanceof CastError) {
        return next(new BadRequestError('Неккоректный ID'));
      }
      return next(err);
    });
};
