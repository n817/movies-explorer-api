const router = require('express').Router();
const { errors } = require('celebrate');
const { signInValidator, signUpValidator } = require('../middlewares/validators');
const { signIn, signUp, signOut } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const cors = require('../middlewares/cors');

router.use(requestLogger); // подключаем логгер запросов
router.use(cors); // подключаем механизм безопасности браузера cors

/*
// краш-тест сервера
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
*/

router.post('/signin', signInValidator, signIn); // проводит авторизацию пользователя
router.post('/signup', signUpValidator, signUp); // создаёт пользователя
router.post('/signout', signOut); // выходит из профиля и чистит куки

router.use(auth); // мидлвэр авторизации (всем роутам ниже потребуется авторизация)
router.use('/users', usersRouter); // /users + usersRouter
router.use('/movies', moviesRouter); // /cards + cardsRouter

router.use(errorLogger); // подключаем логгер ошибок
router.use(errors()); // обработчик ошибок celebrate

// обработка запросов на несуществующий роут
router.use('*', () => {
  throw new NotFoundError('запрошен несуществующий роут');
});

module.exports = router;
