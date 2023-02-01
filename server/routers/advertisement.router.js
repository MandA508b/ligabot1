const Router = require('express')
const router = new Router()
const advertisementController = require('../controllers/advertisement.controller')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', advertisementController.create)
router.post('/findById', advertisementController.findById)
router.delete('/delete', authMiddleware, advertisementController.delete)
router.put('/redact', advertisementController.redact)
router.get('/findAll', authMiddleware, advertisementController.findAll)
module.exports = router