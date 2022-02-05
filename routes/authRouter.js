const Router = require('express')
const router = new Router()
const controller = require('../controllers/authControllers')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/registration', [
	check('username', "Имя пользователя не может быть пустым").notEmpty(),
	check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:4, mX:10})
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(["admin"]), controller.getUsers)


module.exports = router