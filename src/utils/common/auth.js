let bcrypt=require('bcrypt')
let jwt=require('jsonwebtoken')
let {ServerConfig}=require('../../config')


function checkPassword(plainPassword,encryptPassword){
    try{
        return bcrypt.compareSync(plainPassword,encryptPassword)
    }catch(error){
        throw error
    }
}
function createToken(input){
    try{
        return jwt.sign(input,ServerConfig.JWT_SECRET,{expiresIn:ServerConfig.JWT_EXPIRY})
    }catch(error){
        throw error
    }
}
function verifyToken(token){
    try{
        return jwt.verify(token,ServerConfig.JWT_SECRET);
    }catch(error){
        throw error
    }
}
module.exports={
    checkPassword,
    createToken,
    verifyToken
}