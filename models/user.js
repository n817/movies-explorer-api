const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/AuthError');

const userSchema = new mongoose.Schema({
  // имя пользователя
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  // email пользователя
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  // хеш пароля пользователя
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// метод проверяет логин/пароль и возвращает объект пользователя или ошибку
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      if (!user) {
        // инструкция throw генерирует исключение и обработка кода переходит в следующий блок catch
        throw new AuthError('неправильная почта и(или) пароль');
      }
      // нашёлся — сравниваем хеши пароля
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('неправильная почта и(или) пароль');
          }
          // хеши совпали — возвращаем пользователя
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
