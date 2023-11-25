const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Неверный формат e-mail',
    }
  },
  password: {
    required: true,
    select: false,
  }
})

module.exports = mongoose.model('user', userSchema)