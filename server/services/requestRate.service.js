const RequestRate = require('../../models/requestRate.model')
const advertisementService = require('./advertisement.service')

class requestRateService{

   async create(chatId, advertisementId){
      const requestsRate = await RequestRate.find().sort({number: 1})
      const number =  (Number(requestsRate[0].number) + Number(1)) || Number(1)

      const requestRate = await RequestRate.create({chatId, number, advertisementId})

      return requestRate

   }

   async findByNumber(number, advertisementId){
      const requestRate = await RequestRate.findOne({number, advertisementId})

      return requestRate
   }

   async deleteByNumber(number, advertisementId){
      await RequestRate.deleteOne({number, advertisementId})
   }

}

module.exports = new requestRateService()