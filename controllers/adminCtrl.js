const users = require("../models/Admin.model")
const bcrypt =  require('bcrypt')
const jwt = require('jsonwebtoken')



const adminCtrl ={
register : async (req , res)=>{
  try {
    const {name  ,lastName ,  email , password} = req.body;
    const user = await  users.findOne({email})
    if(user) 
      return res.status(400).json({msg:'the email already exists.'})
    
    if(password.length < 6 ) 
      return res.status(400).json({msg:'password is at least 6 characters long .'})
    //password encryption
     const passwordHash = await bcrypt.hash(password , 10)
     const newUser=new users ({
        name, lastName , email , password :passwordHash 
     })
     await newUser.save()

     // create jsonwebtoken to authentication
     const accesstoken = createAccessToken({id : newUser._id})
     const refreshtoken = createRefreshToken({id : newUser._id})
     res.cookie('refreshtoken' ,  refreshtoken, {
        httpOnly : true , 
        path :'https://cubexback.online/user/refresh_token',
        maxAge: 7*24*60*60*1000
     })
     res.json({accesstoken})
    
    //  res.json({msg : 'Register Success'})
  } catch (error) {
    return res.status(500).json({msg : error.message})
  }
        
},
login : async (req , res) =>{
    try {
        const {email , password} = req.body;

        const user = await users.findOne({email})
        if(!user) return res.status(400).json({msg :'user does not exist.'})

        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch) return  res.status(400).json({msg :'Incorrect password'})

        // if login success , create access token and refresh token 
        const accesstoken = createAccessToken({id : user._id})
        const refreshtoken = createRefreshToken({id : user._id})
        res.json({accesstoken})
        
    } catch (error) {
        return res.status(500).json({msg : error.message}) 
    }
},
UpdateUser : async(req,res) =>{
    try {
        const passhash = null;
        const {name ,lastName, email , password} = req.body;
        if(password){
             passhash = await bcrypt.hash(password , 10 );
        }
        await users.findOneAndUpdate(({_id : req.params.id},{name, lastName , email , passhash}))
        res.json({msg : "updated user"}) 
        
    } catch (error) {
        return res.status(500).json({message : error.message}) 
    }
}
}
const createAccessToken= (user) => {
    return jwt.sign(user ,"metrobus1234", {expiresIn : '11m'})
}
const  createRefreshToken= (user) => {
    return jwt.sign(user ,"metrobus1234", {expiresIn : '7d'})
}


module.exports = adminCtrl