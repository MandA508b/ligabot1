const RequestRate = require('../../models/requestRate.model')
const advertisementService = require('./advertisement.service')

class requestRateService{

   async create(chatId, advertisementId, rate){
      const requestsRate = await RequestRate.find().sort({number: 1})
      let number = 1
      if(requestsRate[0]){
         number =  (Number(requestsRate[0].number) + Number(1))
      }



      const requestRate = await RequestRate.create({chatId, number, advertisementId, rate})

      return requestRate

   }

   async findByNumber(number, advertisementId){
      const requestRate = await RequestRate.findOne({number, advertisementId})

      return requestRate
   }

   async deleteByNumber(number, advertisementId){
      await RequestRate.deleteOne({number, advertisementId})
   }

   async getByAdvertisementId(advertisementId){
      const requestsRate = await RequestRate.find({advertisementId})

      return requestsRate
   }

}

module.exports = new requestRateService()