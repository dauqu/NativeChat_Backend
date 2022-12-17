const express = require("express");
const router = express.Router();
const userSchema = require("../models/users");
const bcrypt= require("bcrypt")
const jwt = require("jsonwebtoken")


//login user
router.post("/", async (req,res) => {
   try{  
    const { email, password}= req.body;
    const check_user= await userSchema.findOne({email}).lean();
    if (!check_user) return res.status(400).json({message: "Please enter correct email", status:"warning"});

    //compare hashed password
    const hashed_password=check_user.password;
    if(!bcrypt.compareSync(password,hashed_password)) return res.status(400).json({message:"Please enter your correct password", status:"warning"})


    //creating jwt token
    const token =jwt.sign(  
        {
            _id:check_user._id,
            name: check_user.name,
            email: check_user.email
        },
        process.env.JWT_SECRET,
        {
            algorithm:"HS256"
        }
    )

    //SET COOKIES
    res.cookie("auth_token", token,{
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 300, 
        sameSite: "none",
        secure: true,
    });

    res.setHeader("x-auth-token",token);
    // res.cookie("auth_token",token)
    res.status(200).json({message: "Login successful", status: "success", token: token})
} catch (error) { 
    res.status(500).json({ message: error.message, status: "error"})
}
})

//Check User is login or not
router.get("/isLoggedIn", async (req, res) => {
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
  
    const id_from_token = have_valid_tokem.id;
  
    //Check Same id have database
    const user = await userSchema.findOne({ id_from_token }).lean();
  
    if (user == undefined || user == null || user == "") {
      res.json(false);
    } else {
      res.json(true);
    }
  });

  async function validation(req,res,next){

    const email= req.body.email;
    const password = req.body.password;

    //check all fields are filled or not
    if(
        email == ""||
        password== ""||
        email == undefined||
        password== undefined||
        email == null||
        password== null

    ) { return res.status(400).json({message:"Please fill all fields", status:"warning"})}

     //Check email is valid or not
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email", status: "warning" });
  }

  //Check password is valid or not
  if (req.body.password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
      status: "warning", 
    });
  }

  next();
}


module.exports= router;