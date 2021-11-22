const Movie = require('../models/movie');
const CastError = require('../errors/CastError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// возвращает все сохранённые пользователем фильмы
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((MoviesData) => res.status(200).send(MoviesData))
    .catch(next); // эквивалентна catch(err => next(err))
};

// создаёт фильм с переданными в теле данными
const postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movieData) => res.status(201).send(movieData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError(`При создании фильма переданы некорректные данные: ${err.message}`));
      }
      next(err);
    });
};

// удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieObjectId)
    .orFail(() => {
      throw new NotFoundError('не найден фильм по заданному id');
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('запрещено удалять фильмы других пользователей');
      } else {
        Movie.findByIdAndRemove(req.params.movieObjectId)
          .then((movieData) => res.status(200).send({ movieData, message: 'фильм успешно удален' }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id фильма'));
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
