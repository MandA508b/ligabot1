const Router = require('express')
const router = new Router()
const adminController = require('../controllers/admin.controller')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', adminController.registration)
router.post('/login', adminController.login)
router.post('/logout', adminController.logout)
router.get('/refresh', authMiddleware, adminController.refresh)


module.exports = router