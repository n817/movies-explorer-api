const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { SECRET_KEY } = require('../configs');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  // попытаемся верифицировать токен
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
