const mongoose = require('mongoose');

const connection = mongoose.connect(process.env.MONGO_DB_URL,{
    dbName:"dtaabse_node_js"
}).then(()=>{
    console.log('databse is connetd')
}).catch((err)=>{
    console.log(err)
})

module.exports = connection;