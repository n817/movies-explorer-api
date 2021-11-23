require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const errorHandler = require('./errors/errorHandler');
const { MONGODB_URL, PORT } = require('./configs');

const app = express();

// подключаемся к локальному серверу mongo
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

app.use(express.json()); // подключаем body-парсер
app.use(cookieParser());// подключаем cookie-парсер
app.use(requestLogger); // подключаем логгер запросов
app.use(cors); // подключаем механизм безопасности браузера cors

app.use(routes); // подключаем маршруты

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // подключаем обработчик ошибок по умолчанию (код 500)

app.listen(PORT, () => {
  console.log(`Express is running on port ${PORT}...`);
});
