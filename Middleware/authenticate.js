const jwt  = require('jsonwebtoken')
const messageUser = require('../model/messageSchema')

const isauthenticate = async(req,res,next)=>{
    //console.log(req.cookies);
   const {tokken} = req.cookies;
   
   if(tokken){

     const decode = jwt.verify(tokken,process.env.SECRET_KEY);
     console.log(decode);
     req.user = await messageUser.findById(decode.userid);
     next();
   }else{
    res.render("login.ejs")
   }
}

module.exports = isauthenticate;