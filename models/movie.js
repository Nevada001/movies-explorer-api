const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
  },
  director: {
    type: String,
  },
  duration: {
    type: Number,
  },
  year: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: 'Неверный формат ссылки',
    },
  },
  trailerLink: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: 'Неверный формат ссылки',
    },
  },
  thumbNail: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: 'Неверный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: {
      value: true,
      message: 'Необходимо указать автора карточки с фильмом',
    },
  },
  movieId: {
    type: Number,
  },
  nameRU: {
    type: String,
  },
  nameEN: {
    type: String,
  },
});

module.exports = mongoose.model('movie', movieSchema);
