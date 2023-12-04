const userRoutes = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getUser, updateUser } = require('../controllers/user');

userRoutes.get('/me', getUser);
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateUser);
module.exports = userRoutes;
