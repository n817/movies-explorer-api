const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMe,
  patchMe,
  signOut,
} = require('../controllers/users');

// возвращает данные текущего пользователя (email и имя)
router.get('/me', getMe);

// обновляет данные текущего пользователя (email и имя)
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(5),
  }),
}), patchMe);

router.post('/signout', signOut); // выходит из профиля и чистит куки

module.exports = router;
