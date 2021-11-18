const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SALT_ROUND } = require('../configs');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const { NODE_ENV, JWT_SECRET } = process.env;

// проводит аутентификацию пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((userData) => {
      // успешная аутентификация, пользователь в переменной userData
      // создадим и вернем токен
      const token = jwt.sign(
        { _id: userData._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        // отправим токен, браузер сохранит его в куках
        .cookie('jwt', token, {
          httpOnly: true,
        })
        // Отправляем ответ от сервера, исключаем хеш пароля
        .status(200)
        .send({
          name: userData.name,
          about: userData.about,
          avatar: userData.avatar,
          email: userData.email,
        });
    })
    .catch(next); // эквивалентна catch(err => next(err))
};

// возвращает данные текущего пользователя
const getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((userData) => {
      if (userData) {
        res.status(200).send(userData);
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь не найден'));
      }
      next(err);
    });
};

// создаёт пользователя
const createUser = (req, res, next) => {
  const { email, password } = req.body;

  // проверяем, существует ли уже пользователь с таким email
  // если нет, то возвращаем хэш пароля
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(`Такой email уже существует у пользователя id ${user._id}`);
      }
      return bcrypt.hash(password, SALT_ROUND);
    })
    // создаем пользователя
    .then((hash) => User.create({ email, password: hash }))
    .then((userData) => {
      res
        .status(201)
        .send({
          name: userData.name,
          about: userData.about,
          avatar: userData.avatar,
          email: userData.email,
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`При создании пользователя переданы некорректные данные: ${err.message}`));
      }
      next(err);
    });
};

// обновляет данные текущего пользователя
const patchMe = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }, // then получит обновлённые данные + валидация данных
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден по заданному id');
    })
    .then((userData) => res.status(200).send(userData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`При обновлении профиля переданы некорректные данные: ${err.message}`));
      }
      next(err);
    });
};

// выходит из профиля и чистит куки
const signOut = (req, res) => {
  res
    .clearCookie('jwt', {
      httpOnly: true,
    })
    .status(200)
    .send({ message: 'Пользователь успешно разлогинен, куки удалены' });
};

module.exports = {
  login,
  getMe,
  createUser,
  patchMe,
  signOut,
};
