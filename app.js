const express = require("express");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Joi, errors, celebrate } = require("celebrate");
const { createUser, getUser, login } = require("./controllers/user");
const  auth  = require("./middlewares/auth");
const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");
mongoose.connect("mongodb://127.0.0.1:27017/moviesdb");
const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.post("/signup", createUser);
app.post('/signin', login);
app.use('/movies', auth, movieRoutes )
app.use('/users', auth,  userRoutes);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? "На сервере произошла ошибка" : message,
    });
    next(err);
});
app.listen(PORT, () => {
  console.log(`App listeninng on ${PORT}`);
});
