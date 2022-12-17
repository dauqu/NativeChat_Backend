const mongoose = require("mongoose")

const commentsSchema= mongoose.Schema({
    userid :{
        type: String,
    },
    postid : {
        type : Number,
    },
    comments : {
        type : String, 
    },
    nestedcomments : [
        {
            userid:{type:String,required:true},
            realuser:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
            comments:{type:String,required:true},
            date:{type:Date,required:true},
            uniqueId:{type:String,required:true},   
        }
    ]
})

module.exports= mongoose.model("comments", commentsSchema) 