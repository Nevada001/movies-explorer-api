const { NODE_ENV, JWT_SECRET } = process.env;
const { ValidationError, CastError } = require('mongoose').Error;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const Status = require('../utils/statusCodes');
const BadRequestError = require('../errors/badRequest');
const MongoDuplicateError = require('../errors/mongoDuplicateError');
const NotFoundError = require('../errors/notFoundErr');
const UnAuthorizedError = require('../errors/unAuthorized');

const saltRounds = 10;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, saltRounds).then((hash) => {
    Users.create({
      password: hash,
      name,
      email,
    })
      .then((user) => res.status(Status.CREATED).send({
        name: user.name,
        email: user.email,
      }))
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err instanceof ValidationError) {
          return next(new BadRequestError('Ошибка валидации полей'));
        }
        if (err.code === Status.MONGO_DUPLICATE) {
          return next(
            new MongoDuplicateError(
              'Пользователь с таким email уже зарегистрирован',
            ),
          );
        // eslint-disable-next-line no-else-return
        } else {
          next(err);
        }
      })
      .catch((err) => next(err));
  });
};

module.exports.getUser = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      res.status(Status.OK_REQUEST).send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError('Указан невалидный ID.'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Пользователь не найден.'))
    .then((users) => res.send(users))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Ошибка валидации полей'));
      }
      if (err.code === Status.MONGO_DUPLICATE) {
        return next(
          new MongoDuplicateError(
            'Пользователь с таким email уже зарегистрирован',
          ),
        );
      // eslint-disable-next-line no-else-return
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch((err) => {
      if (err.message === 'NotAutanticate') {
        return next(new UnAuthorizedError('Неправильные почта или пароль'));
      }
      return next(err);
    });
};
