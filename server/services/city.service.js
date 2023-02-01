const City = require('../../models/city.model')

class cityController{

    async create(name){
        const city = await City.create({name})

        return city
    }

    async delete(cityId){
        const city = await City.findByIdAndDelete(cityId)

        return city
    }

    async redact(cityId, data){
        const city = await City.findByIdAndUpdate(cityId, data)
        console.log(cityId, data)
        return city
    }

    async findAll(){
        const cities = await City.find()

        return cities
    }

    async findById(cityId){
        const city = await City.findById(cityId)

        return city
    }

}

module.exports = new cityController()