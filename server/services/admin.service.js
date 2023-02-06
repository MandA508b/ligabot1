const Admin = require('../../models/admin.models')
const bcrypt = require('bcrypt')
const tokenService = require('../services/token.service')
const AdminDto = require('../dtos/admin.dto')
const ApiError = require(`../errors/api.error`)

class adminService{
    async registration(login, password){
        try{
            const candidate = await Admin.findOne({login})
            if(candidate){
                throw ApiError.preconditionFailed('candidate')
            }
            const hashPassword = await bcrypt.hash(password, 3)

            const admin = await Admin.create({login: login, password: hashPassword})

            const adminDto = new AdminDto(admin)
            const tokens = tokenService.generateTokens({...adminDto})
            await tokenService.saveToken(adminDto.id, tokens.refreshToken)

            return ({...tokens, admin: adminDto})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async login(login, password){
        try{
            const admin = await Admin.findOne({login})
            if(!admin){
                throw ApiError.notFound('!admin')
            }
            let comparePassword = await bcrypt.compare(password, admin.password)
            if(!comparePassword){
                throw ApiError.badRequest('!comparePassword')
            }
            const adminDto = new AdminDto(admin)
            const tokens = tokenService.generateTokens({...adminDto})
            await tokenService.saveToken(adminDto.id, tokens.refreshToken)

            return ({...tokens, admin: adminDto})
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async refresh(refreshToken){
        try{
            const adminData = tokenService.validateRefreshToken(refreshToken)
            const tokenFromDb = await tokenService.findToken(refreshToken)
            if(!tokenFromDb || !adminData){
                throw ApiError.badRequest('!tokenFromDb || !adminData')
            }
            const id = adminData.id
            const admin = await Admin.findOne({id})
            const adminDto = new AdminDto(admin)
            const tokens = tokenService.generateTokens({...adminDto})
            await tokenService.saveToken(adminDto.id, tokens.refreshToken)
            return ({accessToken: tokens.accessToken, admin: adminDto})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async logout(refreshToken){
        try{
            const token = await tokenService.removeToken(refreshToken)
            return token
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new adminService()