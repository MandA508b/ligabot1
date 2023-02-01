const Router = require('express')
const router = new Router()
const cityController = require('../controllers/city.controller')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create',authMiddleware, cityController.create)
router.delete('/delete', authMiddleware, cityController.delete)
router.put('/redact', authMiddleware, cityController.redact)
router.get('/findAll', cityController.findAll)
module.exports = router