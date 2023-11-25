const express = require('express');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/moviesdb');
const { PORT = 3000 } = process.env;
const app  = express();
app.listen(PORT, () => {
  console.log(`App listeninng on ${PORT}`)
})
