const Report = require('../../models/report.model')

const ApiError = require('../errors/api.error')

class teamController{

    async getReport(chatId, advertisementId, userRole){
        try{

            const candidat = await Report.find({chatId})

            if(candidat){
                return candidat
            }

            const report = await Report.create({chatId, advertisementId, userRole})

            return report

        }catch (e) {
            console.log("error: ", e)
        }
    }

    async addNumberOfRequest(reportId){
        try{
            const report = await Report.findById(reportId)

            if((Number(report.numberOfRequest) + Number(1)) > 3){
                throw ApiError.preconditionFailed('numberOfRequest > 3!')
            }

            report.numberOfRequest = Number(report.numberOfRequest) + Number(1)
            await report.save()

            return report
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async delete(chatId){
        try{
            await Report.deleteOne({chatId})
        }catch (e){
            console.log("error: ", e)
        }
    }

    async findAll(){
        try{
            const reports = await Report.find({})

            return reports
        }catch (e) {
            console.log("error: ", e)
        }
    }

}

module.exports = new teamController()