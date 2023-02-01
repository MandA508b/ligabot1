const Router = require('express')
const router = new Router()
const channelController = require('../controllers/channel.controller')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create',authMiddleware, channelController.create)
router.delete('/delete', authMiddleware, channelController.delete)
router.put('/redact', authMiddleware, channelController.redact)
router.put('/getByLeagueId', authMiddleware, channelController.getByLeagueId)
router.get('/findAll', authMiddleware, channelController.findAll)
module.exports = router