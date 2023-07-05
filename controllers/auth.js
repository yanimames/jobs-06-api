const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')


const register = async(req,res)=>{
    console.log('estoy en register');
    console.log(req.body)

    const user = await User.create({...req.body})
    console.log('despues del await') 
    console.log(user)
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user:{name: user.name}, token } )
    //res.status(StatusCodes.CREATED).json({user} )
    
    
    
}
const login = async(req,res)=>{
    const{email,password} = req.body

    if(!email || !password){
      throw new BadRequestError('Pleasse provide email and password')
    }
    const user = await User.findOne({email})
    //compare password
    if(!user){
        throw new UnauthenticatedError('invalid credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('invalid credentials')
    }


    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: {name:user.name}, token})
}

module.exports={
    register,
    login
}