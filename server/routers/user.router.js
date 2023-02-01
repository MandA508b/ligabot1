const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middleware/authMiddleware')

router.put('/updateUsers', authMiddleware, userController.updateUsers)
router.get('/getAllUsers', authMiddleware,  userController.getAllUsers)
router.post('/getUserByTelegramId',  userController.getUserByTelegramId)

module.exports = router
