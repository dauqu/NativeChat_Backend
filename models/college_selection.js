const mongoose = require("mongoose")
const college =  mongoose.Schema({
    userid : {
        type : String,
        require: true,
        unique: true
    },
    cllg_name: {
        type:String,
    },
    cllg_loc :{
        type: String,
    },
    phone : {
        type: Number,
    }
})
module.exports= mongoose.model("college", college)