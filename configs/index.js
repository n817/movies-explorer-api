const {
  MONGODB_URL = 'mongodb://localhost:27017/moviesdb',
  PORT = 3000,
  NODE_ENV,
  JWT_SECRET,
} = process.env;

const SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
const SALT_ROUND = 10;

module.exports = {
  MONGODB_URL,
  PORT,
  SECRET_KEY,
  SALT_ROUND,
};
