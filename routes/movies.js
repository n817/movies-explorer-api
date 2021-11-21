const router = require('express').Router();
const { postMovieValidator, deleteMovieValidator } = require('../middlewares/validators');
const { getMovies, postMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies); // возвращает все сохранённые пользователем фильмы
router.post('/', postMovieValidator, postMovie); // создаёт фильм с переданными в теле данными
router.delete('/:movieId', deleteMovieValidator, deleteMovie); // удаляет сохранённый фильм по id

module.exports = router;
