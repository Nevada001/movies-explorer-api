const { getMovies } = require('../controllers/movies');

const movieRoutes = require('express').Router();

movieRoutes.get('/', getMovies);

module.exports = movieRoutes