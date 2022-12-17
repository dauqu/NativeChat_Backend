const mongoose = require("mongoose")
const userSchema =  mongoose.Schema({
    userid :{
        type: String,
    },
    email : {
        type : String,  
        require: true,
        unique: true
    },
    password: {
        type:String,
        require: true,
    },
    name :{
        type: String,
        required: false
    },
    phone : {
        type: Number,
        required: false,
    },
    role : {
        type: String,
        required: false,
    },
    classes : [{
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
        ref: "classes"  
    }],


})
module.exports= mongoose.model("userSchema", userSchema)