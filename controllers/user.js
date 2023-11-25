const Users = require("../models/user");
const bcrypt = require("bcrypt");
const Status = require("../utils/statusCodes");
const BadRequestError = require("../errors/badRequest");
const MongoDuplicateError = require("../errors/mongoDuplicateError");
const saltRounds = 10;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, saltRounds).then((hash) => {
    Users.create({
      password: hash,
      name,
      email,
    }).then((user) =>
      res
        .status(Status.CREATED)
        .send({
          name: user.name,
          email: user.email,
  })
    )
        .catch((err) => {
          if (err instanceof ValidationError) {
            return next(new BadRequestError("Ошибка валидации полей."));
          }
          if (err.code === Status.MONGO_DUPLICATE) {
            return next(
              new MongoDuplicateError(
                "Пользователь с таким email уже зарегистрирован."
              )
            )
          } else {
            return next(err)
          }
        })
        .catch((err) => {
          return next(err)
        });
    });
  };


module.exports.getUser = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      res.status(Status.OK_REQUEST).send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError("Указан невалидный ID."));
      }
      return next(err);
    });
};
