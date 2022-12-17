var mongoose= require("mongoose")

const setting_details = mongoose.Schema({
    class_id:{
        type:"String",
        unique:true,
    },
    icon:{
        type :"String"
    },
    class_name:{
        type:"String",
        required:true,
    },
    class_owners : [{
        type: String,
        required:false   
    }]
})
module.exports= mongoose.model("setting",setting_details) 