const router = require('express').Router();
const { patchMeValidator } = require('../middlewares/validators');
const { getMe, patchMe } = require('../controllers/users');

router.get('/me', getMe); // возвращает данные текущего пользователя (email и имя)
router.patch('/me', patchMeValidator, patchMe); // обновляет данные текущего пользователя (email и имя)

module.exports = router;
