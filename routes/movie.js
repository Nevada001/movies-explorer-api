const movieRoutes = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

movieRoutes.get('/', getMovies);
movieRoutes.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    movieId: Joi.number().required(),
    trailerLink: Joi.string().uri().required()
      .regex(/https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}/),
    image: Joi.string().uri().required()
      .regex(/https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}/),
    thumbNail: Joi.string().required().uri().regex(/https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
movieRoutes.delete('/:_id', celebrate({
  params: Joi.object().keys({ _id: Joi.string().hex().required().length(24) }),
}), deleteMovie);
module.exports = movieRoutes;
