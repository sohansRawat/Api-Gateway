let AppError = require('../utils/errors/app-error')
const { StatusCodes } = require('http-status-codes')

let {UserRepository,RoleRepository}=require('../repositories')

let userRepository=new UserRepository()
let roleRepository=new RoleRepository()

let {Auth}=require('../utils/common')
let Enums=require('../utils/common')

async function createUser(data){
    try {
        let user= await userRepository.create(data);
        let role= await roleRepository.getRoleByName(Enums.ENUM.USER_ROLES_ENUMS.CUSTOMER)
        user.addRole(role)
        return user;
    } catch (error) {
        if (error.name == 'SequelizeValidationError') {
            let explanation = []
            error.errors.forEach(errElement => {
                explanation.push(errElement.message)
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST)
        }
        throw new AppError('cannot create a new user', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function signin(data){
    try{
        const user = await userRepository.getUserByEmail(data.email)
        if(!user){
            throw new AppError('No user found for the given email',StatusCodes.NOT_FOUND)
        }
        const passwordMatch=Auth.checkPassword(data.password,user.password)
        if(!passwordMatch){
            throw new AppError('Invalid password',StatusCodes.BAD_REQUEST)
        }
        const jwt = Auth.createToken({id:user.id,email:user.email})
        return jwt
    }catch(error){
        if(error instanceof AppError){
            throw error
        }
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function isAuthenticated(token){
    try{
        if(!token){
            throw new AppError('Missing JWT token',StatusCodes.BAD_REQUEST)
        }
        const response = Auth.verifyToken(token);
        const user = await userRepository.get(response.id)
        if(!user){
            throw new AppError('No user found',StatusCodes.NOT_FOUND)
        }
        return user.id
    }catch(error){
        if(error instanceof AppError) throw error
        if(error.name == 'JsonWebTokenError'){
            throw new AppError('Invalid JWT token',StatusCodes.BAD_REQUEST)
        }
        if(error.name == 'TokenExpiredError'){
            throw new AppError('JWT token Expired',StatusCodes.BAD_REQUEST)
        }
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function addRoletoUser(data){
    try{
        const user = await userRepository.get(data.id)
        if(!user){
            throw new AppError('No user found for the given id',StatusCodes.NOT_FOUND)
        }
        let role= await roleRepository.getRoleByName(data.role)
        if(!role){
            throw new AppError('No Role found ',StatusCodes.NOT_FOUND)
        }
        user.addRole(role)
        return user
    }catch(error){
        if(error instanceof AppError){
            throw error
        }
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function isAdmin(id){
    try{
        const user = await userRepository.get(id)
        if(!user){
            throw new AppError('No user found for the given id',StatusCodes.NOT_FOUND)
        }
        let adminRole= await roleRepository.getRoleByName(Enums.ENUM.USER_ROLES_ENUMS.ADMIN)
        if(!adminRole){
            throw new AppError('No Role found ',StatusCodes.NOT_FOUND)
        }
        return user.hasRole(adminRole)
    }catch(error){
        if(error instanceof AppError){
            throw error
        }
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function isFlightCompany(id){
    try{
        const user = await userRepository.get(id)
        if(!user){
            throw new AppError('No user found for the given id',StatusCodes.NOT_FOUND)
        }
        let flightCompanyRole= await roleRepository.getRoleByName(Enums.ENUM.USER_ROLES_ENUMS.FLIGHT_COMPANY)
        if(!flightCompanyRole){
            throw new AppError('No Role found ',StatusCodes.NOT_FOUND)
        }
        return user.hasRole(flightCompanyRole)
    }catch(error){
        if(error instanceof AppError){
            throw error
        }
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports={
    createUser,
    signin,
    isAuthenticated,
    addRoletoUser,
    isAdmin,
    isFlightCompany
}