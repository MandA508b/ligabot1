const Router = require('express')
const router = new Router()
const leagueController = require('../controllers/league.controller')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, leagueController.create)
router.delete('/delete', authMiddleware, leagueController.delete)
router.put('/redact', authMiddleware, leagueController.redact)
router.get('/findAll', authMiddleware, leagueController.findAll)
router.get('/findAllStatusTrue', authMiddleware, leagueController.findAllStatusTrue)
router.post('/getLeagueById', authMiddleware, leagueController.getLeagueById)
module.exports = router