const City = require('../../models/city.model')

class cityController{

    async create(name){
        try{
            const city = await City.create({name})

            return city
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async delete(cityId){
        try{
            const city = await City.findByIdAndDelete(cityId)

            return city
        }catch (e) {
            console.log("error: ", e )
        }
    }

    async redact(cityId, data){
        try{
            const city = await City.findByIdAndUpdate(cityId, data)
            console.log(cityId, data)
            return city
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAll(){
        try{
            const cities = await City.find()

            return cities
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async findById(cityId){
        try{
            const city = await City.findById(cityId)

            return city
        }catch (e) {
            console.log("error: ", e)
        }
    }

}

module.exports = new cityController()