const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegEx } = require('../configs');
const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

// возвращает все сохранённые пользователем фильмы
router.get('/', getMovies);

// создаёт фильм с переданными в теле country, director, duration, year,
// description, image, trailer, nameRU, nameEN и thumbnail, movieId
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegEx),
  }),
}), postMovie);

// удаляет сохранённый фильм по id
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
