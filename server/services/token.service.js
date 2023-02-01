const jwt = require('jsonwebtoken')
const Token = require('../../models/token.model')

class tokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_KEY, {expiresIn: '600m'})
        const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, {expiresIn: '7d'})

        return{
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.SECRET_ACCESS_KEY)

            return userData
        }catch (e) {
            return null
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.SECRET_REFRESH_KEY)

            return userData
        }catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await Token.findOne({userId})
        if(tokenData){
            tokenData.refreshToken = refreshToken
            await tokenData.save()

            return tokenData
        }
        const token = await Token.create({userId, refreshToken})

        return token
    }

    async removeToken(refreshToken){
        const tokenData = await Token.findOneAndDelete({refreshToken})

        return tokenData
    }

    async findToken(refreshToken){
        const tokenData = await Token.findOne({refreshToken})

        return tokenData
    }

}
module.exports = new tokenService()