const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;
const UnAuthorizedError = require("../errors/unAuthorized");

const extraBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnAuthorizedError("Необходима авторизация");
  }
  const token = extraBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "prodection" ? JWT_SECRET : "dev-secret"
    );
  } catch (err) {
    return next(new UnAuthorizedError("Необходима авторизация"));
  }
  req.user = payload;
  return next();
};
