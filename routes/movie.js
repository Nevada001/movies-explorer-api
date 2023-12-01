const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

const movieRoutes = require('express').Router();

movieRoutes.get('/', getMovies);
movieRoutes.post('/', createMovie);
movieRoutes.delete('/:_id', deleteMovie);
module.exports = movieRoutes