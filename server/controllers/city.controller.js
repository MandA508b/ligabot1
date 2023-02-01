const cityService  = require('../services/city.service')
const ApiError = require('../errors/api.error')

class cityController{
    async create(req, res, next){
        try{
            const {name} = req.body
            if(!name){
                return next(ApiError.badRequest('!name'))
            }
            const city = await cityService.create(name)

            return res.json({city})
        }catch (e) {
            next(e)
        }
    }

    async delete(req, res, next){
        try{
            const {cityId} = req.body
            if(!cityId){
                return next(ApiError.badRequest('!cityId'))
            }
            const city = await cityService.delete(cityId)

            return res.json({city})
        }catch (e) {
            next(e)
        }
    }

    async redact(req, res, next){
        try{
            const {cityId, data} = req.body
            console.log(cityId, data)
            if(!cityId || !data){
                return next(ApiError.badRequest('!cityId  !data'))
            }
            const city = await cityService.redact(cityId, data)

            return res.json({city})
        }catch (e) {
            next(e)
        }
    }

    async findAll(req, res, next){
        try{
            const cities = await cityService.findAll()

            return res.json({cities})
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new cityController()