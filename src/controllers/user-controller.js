let { StatusCodes } = require('http-status-codes')
let { UserService } = require('../services')
let { ErrorResponse, SuccessResponse } = require('../utils/common')
let AppError = require('../utils/errors/app-error')

async function createUser(req, res) {
    try {
        let user = await UserService.createUser({
            email: req.body.email,
            password: req.body.password
        })
        SuccessResponse.data = user
        return res.status(StatusCodes.CREATED).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.stautsCode).json(ErrorResponse)
    }
}


async function signin(req, res) {
    try {
        let user = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        })
        SuccessResponse.data = user
        return res.status(StatusCodes.CREATED).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.stautsCode).json(ErrorResponse)
    }
}


async function addRoleToUser(req, res) {
    try {
        let user = await UserService.addRoletoUser({
            role: req.body.role,
            id: req.body.id
        })
        SuccessResponse.data = user
        return res.status(StatusCodes.CREATED).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.stautsCode).json(ErrorResponse)
    }
}



module.exports = {
    createUser,
    signin,
    addRoleToUser
}