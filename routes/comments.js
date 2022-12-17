const express = require("express")
const router = express.Router()
const comments = require("../models/comments")
// const users = require("../models/users")
//jwt
const jwt = require("jsonwebtoken")
require("dotenv").config();
 
router.post("/:id",isLoggedIn, async(req,res) => {
    const post_id = req.params.id;
     //Check user have token or not
  const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

  if (token == undefined || token == null || token == "") {
    return res.json(false);
  }

  const have_valid_tokem = jwt.verify(token, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });

  if (!have_valid_tokem) {
    return res.json(false);
  }
  console.log(have_valid_tokem)//console information stored in the token

  //comment here
     const comment = new comments({
        userid: have_valid_tokem.id,
        postid: post_id,
        comments: req.body.comments
     })
     await comment.save((err,result) => {
        if(err){
            res.status(200).send(err)
            console.log(err)
        }else{
           res.status(200).send({message:"comment posted",result})
            console.log(result);
            // res.redirect("/")
        }
     })
})

//comment here
router.get("/",isLoggedIn, async(req,res) => {
    //Check user have token or not
    const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

    if (token == undefined || token == null || token == "") {
        return res.json(false);
    }

    const have_valid_tokem = jwt.verify(token, process.env.JWT_SECRET, {
        algorithm: "HS256",
    });

    if (!have_valid_tokem) {
        return res.json(false);
    }
    console.log(have_valid_tokem)//console information stored in the token

    //comment here
    await comments
    .find()
    .then((result) => {
        res.status(200).send({message:"comment posted",result})
        console.log(result);
    })
    .catch((err) => {
        res
        .status(500)
        .send({ message: err.message || "Some error occurred while retrieving tutorials." });
    });
})





//midddleware to check authentication
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    }else {
        res.redirect("/login") //if user is not logged in, redirect to login page
    }
}

module.exports= router;