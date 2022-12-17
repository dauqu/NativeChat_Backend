const mongoose = require("mongoose")
const account_schema =  mongoose.Schema({
 f_name :{
        type: String,
    },
    l_name : {
        type: String,
    },
    display_name : {
        type: String,
    },
    language : {
        type: String,
    },
})
module.exports= mongoose.model("account",account_schema)