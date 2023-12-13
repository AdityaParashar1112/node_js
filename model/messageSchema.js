const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  
     name:{
        type:String,
     },
     email:{
        type:String
     },
     password:{
        type:String
     }
})


module.exports = mongoose.model("messages",messageSchema);