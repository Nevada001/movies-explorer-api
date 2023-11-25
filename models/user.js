const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Неверный формат e-mail',
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
  }
})

module.exports = mongoose.model('user', userSchema)