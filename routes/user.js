const { getUser } = require('../controllers/user');

const userRoutes = require('express').Router();

userRoutes.get('/me', getUser);

module.exports = userRoutes