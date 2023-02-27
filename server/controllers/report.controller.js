const reportService  = require('../services/report.service')
const ApiError = require(`../errors/api.error`)

class reportController{

    async getReport(req, res, next){
        try{
            const {chatId, advertisementId, userRole} = req.body

            if(!chatId || !advertisementId || !userRole){
                return next(ApiError.badRequest('!chatId || !advertisementId || !userRole'))
            }

            const report = await reportService.getReport(chatId, advertisementId, userRole)

            return res.json({report})
        }catch (e) {
            return next(e)
        }
    }

    async addNumberOfRequest(req, res, next){
        try{
            const {reportId} = req.body

            if(!reportId){
                return next(ApiError.badRequest('!reportId'))
            }

            const report = await reportService.addNumberOfRequest(reportId)

            return res.json({report})

        }catch (e) {
            return next(e)
        }
    }

    async getAll(req, res, next){
        try{
            const reports = await reportService.findAll()

            return res.json({reports})
        }catch (e) {
            return next(e)
        }
    }

}

module.exports = new reportController()