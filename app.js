const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const { createUser } = require('./controllers/user');
mongoose.connect('mongodb://127.0.0.1:27017/moviesdb');
const { PORT = 3000 } = process.env;
const app  = express();
app.use(bodyParser.json());
app.post('/signup', createUser)
app.listen(PORT, () => {
  console.log(`App listeninng on ${PORT}`)
})
