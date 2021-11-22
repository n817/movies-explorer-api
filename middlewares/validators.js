const { celebrate, Joi } = require('celebrate');

const signInValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUpValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email().min(5),
    password: Joi.string().required(),
  }),
});

const patchMeValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().min(5),
  }),
});

const postMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required().min(1),
    year: Joi.number().integer().required().min(1895),
    description: Joi.string().required(),
    image: Joi.string().required().uri(),
    trailer: Joi.string().required().uri(),
    thumbnail: Joi.string().required().uri(),
    owner: Joi.string().required(),
    movieId: Joi.number().integer().required().min(1),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    movieObjectId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  signInValidator,
  signUpValidator,
  patchMeValidator,
  postMovieValidator,
  deleteMovieValidator,
};
