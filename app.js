const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { Joi, errors, celebrate } = require('celebrate');
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/notFoundErr');

const { PORT = 3000, NODE_ENV, DB_URL } = process.env;
const { MONGO_URL } = require('./utils/env.config');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(requestLogger);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().min(3).required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.use('/movies', auth, movieRoutes);
app.use('/users', auth, userRoutes);
app.use(errors());
app.use('*', auth, (req, res, next) => next(new NotFoundError('Введенный ресурс не найден.')));
app.use(errorLogger);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  next(err);
});
async function init() {
  await mongoose.connect(NODE_ENV === 'production' ? DB_URL : MONGO_URL);
  await app.listen((PORT), () => {
    console.log(`App listening on ${PORT}`);
  });
}

init();
