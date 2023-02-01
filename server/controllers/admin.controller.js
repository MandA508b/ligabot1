const adminService  = require('../services/admin.service')
const ApiError = require(`../errors/api.error`)

class adminController{
    async registration(req, res, next){
        try{
            const {login, password} = req.body
            console.log(login, ' ', password)
            if(!login || !password){
                return next(ApiError.badRequest('!login || !password'))
            }
            const adminData = await adminService.registration(login, password)
            res.cookie('refreshToken', adminData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json({accessToken: adminData.accessToken, admin: adminData.admin})
        }catch (e) {
            next(e)
        }
    }
    async login(req, res, next){
        try {
            const {login, password} = req.body
            if(!login || !password){
                return next(ApiError.badRequest('!login || !password'))
            }
            const adminData = await adminService.login(login, password)
            res.cookie('refreshToken', adminData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json({accessToken: adminData.accessToken, admin: adminData.admin})
        }catch (e){
            next(e)
        }
    }

    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies
            if(!refreshToken){
                return next(ApiError.badRequest('!refreshToken'))
            }
            const adminData = await adminService.refresh(refreshToken)
            res.cookie('refreshToken', adminData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json({accessToken: adminData.accessToken, admin: adminData.admin})
        }catch (e) {
            next(e)
        }
    }

    async logout(req, res, next){
        try{
            const {refreshToken} = req.cookies
            const token = adminService.logout(refreshToken)
            res.clearCookie('refreshToken')

            return res.json(token)
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new adminController()