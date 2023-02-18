const Router = require('express')
const router = new Router()
const chatController = require('../controllers/chat.controller')

router.post('/create', chatController.create)
router.delete('/delete', chatController.delete)
router.get('/findAll', chatController.findAll)
router.post('/sendRateRequest', chatController.sendRateRequest)

module.exports = router