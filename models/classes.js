var mongoose = require("mongoose")
  const classesSchema = mongoose.Schema({
    class_code: {
        type: String,  
        // class_user: [{
        //     type: mongoose.SchemaTypes.ObjectId,
        //     required: false,
        //     ref: "chats"
        // }]
    },
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
     teachers: [{
        type: String,
        required: false,
        ref: "userSchema"
    }],
    students: [{
        type: String,
        required: false,
        ref: "userSchema"
    }],
    chats: [{

        type: mongoose.SchemaTypes.ObjectId,
        required: false,
        ref: "chats"
    }]
},{
    timestamps: true
})
module.exports = mongoose.model("classes", classesSchema)