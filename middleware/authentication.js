const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = (req,res,next) =>{
    //checkheader
    const authHeader = req.headers.authorization
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError ('Authentication invalid 1')

    }
    const token = authHeader.split(' ')[1]
 

    try { 
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //atach the user to the job routes
        req.user = {userId: payload.userId, name:payload.name}
        next()
    } catch (error) {
        console.log(error)
        throw new UnauthenticatedError('Authetication invalid 2')
    }
}

module.exports = auth