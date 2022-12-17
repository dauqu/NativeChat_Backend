const express = require("express")
const router = express.Router()
const comments = require("../models/comments")
const mongoose= require("mongoose")


//jwt
const jwt = require("jsonwebtoken") 
require("dotenv").config();

//do comment here
router.post("/:id", async (req, res) => { 

    const post_id = req.params.id;
    //get token
    const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

    //fetch user  from token
    const user = jwt.verify(token, process.env.JWT_SECRET, {  
        algorithm: "HS256",
    });
    
    //get user id 
    if (!user) {
        return res.json(false);
    }
    console.log(user)//console information stored in the token

    //comment here
    const comment = new comments({
        userid: user.userid,
        postid: post_id,
        comments: req.body.comments
    }) 
    await comment.save((err, result) => {
        if (err) {
            res.status(200).send(err)
            console.log(err)
        } else {
            res.status(200).send({
                message: "comment posted",
                result
            })
            console.log(result);
            // res.redirect("/")
        }
    })

})

//get all comments
router.get("/:id", async (req, res) => { 
    const post_id = req.params.id;
    await comments
        .find({
            postid: post_id
        })
        .populate("userid")
        .exec((err, result) => {
            if (err) {
                res.status(200).send 
                console.log(err)
            } else {
                res.status(200).send({  
                    message: "comments",
                    result
                })
                console.log(result);
            }
        })  
})

//update comment
router.put("/:id", async (req, res) => {
    const comment_id = req.params.id;
    const comment_update= await comments.findById(comment_id);

    //get token
    const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

    //fetch user  from token
    const user = jwt.verify(token, process.env.JWT_SECRET, {
        algorithm: "HS256",
    });

    //get user id
    if (!user) {
        return res.json(false);
    }

    //check user is owner of comment
    if (user.id == comment_update.userid) {
        const comment_update= await comments.findByIdAndUpdate(comment_id);

        if(!comment_update){
            res.status(200).send({
                message: "comment not found",
            })
        }else{
            comment_update.comments= req.body.comments;
            await comment_update.save();
              res.status(200).send({
                message: "comment updated",
                status:"success"
            })
         }       
    }else{
      if(err){
        res.status(500).json({message:error.message});
      }
    }


    
})

//delete comment
router.delete("/:id", async (req, res) => {
    const comment_id = req.params.id;
    if(mongoose.Types.ObjectId.isValid(comment_id)){
    const comments_delete= await comments.findByIdAndDelete(comment_id)

    if (!comments_delete) {
        return res.status(404).send({
            message: "comment not found", 
            status:"error"
        })
    }
    await comments_delete.remove(); 
    res.status(200).send({   
        message: "comment deleted",
        status:"success"
    })
    console.log(comments_delete);
  
   }
});

//replies on comments ===============>nested comments=====================================================
router.post("/reply/:comment_id/:user_id", async (req, res) => {
    // const user_id = req.params.user_id;

    try {

       //get token
    const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

    //fetch user  from token
    const user = jwt.verify(token, process.env.JWT_SECRET, { 
        algorithm: "HS256",
    });

    //get user id
    if (!user) {
        return res.json({message:"You are not logged in", status:false});
    }

    if(user.id != req.params.user_id) 
        return res.status(404).send({message:"please login to reply", status: false})

        let data= {
            comment_id: req.params.comment_id,
            userid: req.params.user_id,
            realuser: req.body.realuser,
            comments: req.body.comments,
            Date: new Date()
        };
        const pushReplies = await comments.updateOne( 
            { _id: req.params.comment_id },
            { $push: { nestedcomments: data } },   
            { new: true }
          )
            .lean()
            .exec();
            console.log(pushReplies)
          return res.status(200).send({ message: "Success", status: true });
        
     
   }catch (error) {
    return res.status(500).send({message:error.message, status: false}) 
  }
})

//deleting replies
router.delete("/reply/:comment_id/:nestedcomment_id", async (req, res) => {
    try {
        //get token
        const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

        //fetch user  from token
        const user = jwt.verify(token, process.env.JWT_SECRET, {  
            algorithm: "HS256",
        });

        //get user id
        if (!user) {
            return res.json({message:"You are not logged in", status:false});
        }

        const comment = await comments.findById(req.params.comment_id);
        if (!comment) {
            return res.status(404).send({message:"comment not found", status: false})
        }
        const nestedcomment = comment.nestedcomments.find(
            (nestedcomment) => nestedcomment._id == req.params.nestedcomment_id
        );
        if (!nestedcomment) {
            return res.status(404).send({message:"reply not found", status: false})
        }
        // console.log(nestedcomment.userid)
        // console.log(user.id)

        if (nestedcomment.userid != user.id) {
            return res.status(404).send({message:"you are not allowed to delete this reply", status: false})
        }
        const removeNestedcomment = await comments.updateOne(
            { _id: req.params.comment_id },
            { $pull: { nestedcomments: { _id: req.params.nestedcomment_id } } }, 
            { new: true }
        ) 
            .lean()
            .exec();
        return res.status(200).send({ message: "Success", status: true });
    } catch (error) {
        return res.status(500).send({message:error.message, status: false})
    }
})

//edit replies
router.put("/reply/:comment_id/:nestedcomment_id", async (req, res) => {
    try {
        //get token
        const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

        //fetch user  from token
        const user = jwt.verify(token, process.env.JWT_SECRET, {
            algorithm: "HS256",
        });

        //get user id
        if (!user) { 
            return res.json({message:"You are not logged in", status:false});
        }

        const comment = await comments.findById(req.params.comment_id);
        if (!comment) {
            return res.status(404).send({message:"comment not found", status: false})
        }   
        const nestedcomment = comment.nestedcomments.find(
            (nestedcomment) => nestedcomment._id == req.params.nestedcomment_id
        );
        if (!nestedcomment) {
            return res.status(404).send({message:"reply not found", status: false})
        }
        if (nestedcomment.userid != user.id) {
            return res.status(404).send({message:"you are not allowed to edit this reply", status: false})
        }
        const updateNestedcomment = await comments.updateOne(
            { _id: req.params.comment_id, "nestedcomments._id": req.params.nestedcomment_id },
            { $set: { "nestedcomments.$.comments": req.body.comments } },
            { new: true }
        )
            .lean()
            .exec();
        return res.status(200).send({ message: "Success", status: true });
    } catch (error) {
        return res.status(500).send({message:error.message, status: false})
    }
})


  


module.exports = router