const { getUser, updateUser } = require('../controllers/user');

const userRoutes = require('express').Router();

userRoutes.get('/me', getUser);
userRoutes.patch('/me', updateUser);
module.exports = userRoutes