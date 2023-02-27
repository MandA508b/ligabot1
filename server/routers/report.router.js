const Router = require('express')
const router = new Router()
const reportController = require('../controllers/report.controller')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/getReport', authMiddleware, reportController.getReport)
router.post('/addNumberOfRequest', authMiddleware, reportController.addNumberOfRequest)
router.get('/getAll', authMiddleware, reportController.getAll)



module.exports = router