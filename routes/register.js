const express = require("express");
const router = express.Router();
const userSchema = require("../models/users");
const bcrypt= require("bcrypt")


//register user
router.post("/", validation, async (req, res) => {

  // //generate random userid
  const userid = 
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  //hashed password
  const hashed_password = await bcrypt.hash(req.body.password, 10);

  //add user
  const user = new userSchema({
    userid:userid,
    email: req.body.email,
    password: hashed_password
  });
  try {
    await user.save();
    res.status(200).send({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message, status: "error" });
  }
});

//middleware for register validation
async function validation(req, res, next) {
  const {  email, password, name, phone } = req.body; 

  //check if all fields are filled or not
  if ( 
    email == "" ||
    name == "" ||
    password == "" ||
    email == undefined ||
    name == undefined ||
    password == undefined ||
    email == null ||
    name == null ||
    password == null
  )
    return res.status(400).json({
      message: "All fields are required",
      status: "error",
    });
  //check password length
  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be of more than 6 digits" });

  //check if email exist or not
  const email_exists = await userSchema.findOne({ email: req.body.email }); 
  console.log(email_exists);
  if (email_exists != null && email_exists.length > 0 )
    return res.status(400).json({
      message: "Email already exist, try with another one",
      status: "error", 
    });

  //check if email is valid
  const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email_regex.test(email))
    return res.status(400).json({
      message: "Email is not valid",
      status: "error",
    });

  //Check MobilePhone is valid
  // const MobilePhone_regex = /^[0-9]{10}$/;
  // if (!MobilePhone_regex.test(phone))
  //   return res.status(400).json({
  //     message: "Invalid Phone number",
  //     status: "error",
  //   });

  next();
}

//delete user
router.delete("/:id", async (req, res) => {
  const user = await userSchema.findOne({ userid: req.params.id });
  if (user) {
    await user.remove();
    res.status(200).send({ message: "User deleted successfully" });
  } else {
    res.status(400).send({ message: "User not found", status: "error" });
  }
});


module.exports = router;
