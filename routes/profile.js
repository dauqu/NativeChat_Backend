const express = require("express");
const router = express.Router();
const userSchema = require("../models/users");
const jwt = require("jsonwebtoken");
const { update } = require("../models/users");
require("dotenv").config();

//get profile
router.get("/", async (req, res) => {
  // res.send(req.headers["x-auth-token"]);
  //get token
  const token =
    req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

  if (token === undefined || token === null || token === "") {
    return res.status(200).send({
      message: "token is not defined",
    });
  }
  //fetch user  from token
  const user = jwt.verify(token, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });

  //get user id
  if (!user) {
    return res.json(false);
  }
  //console information stored in the token
  // console.log(user)

  //search user in database
  const check_user = await userSchema.findOne({ _id: user._id }).populate({
    path: "classes",
    options: { sort: { createdAt: -1 } },
  })
  if (check_user) {
    res.status(200).send({
      message: "user found",
      check_user,
    });
  } else {
    res.status(200).send({
      message: "user not found",
    });
  }
});

//edit profile
router.put("/:id", async (req, res) => {
  //get token
  const token =
    req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

  //fetch user  from token
  const user = jwt.verify(token, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });

  //get user id
  if (!user) {
    return res.json(false);
  }

  //search user in database
  // const check_user = await userSchema.find({id: user.userid});
  // console.log(check_user);
  // if (check_user) {
  //update user
  try {
    const updated_profile = await userSchema.findById(req.params.id);
    console.log(updated_profile);

    if (!updated_profile) {
      return res
        .status(400)
        .json({ message: "User profile not found", status: "error" });
    }
    updated_profile.name = req.body.name;
    updated_profile.email = req.body.email;
    updated_profile.phone = req.body.phone;
    updated_profile.password = req.body.password;

    await updated_profile.save();
    res
      .status(200)
      .json({ message: "Profile updated successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete profile
router.delete("/:userid", async (req, res) => {
  //get token
  const token =
    req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

  //fetch user  from token
  const user = jwt.verify(token, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });

  //get user id
  if (!user) {
    return res.json(false);
  }

  const check_user = await userSchema.findOne({ id: user.userid });
  if (check_user) {
    await userSchema.deleteOne({ id: user.userid });
    res.status(200).send({
      message: "user deleted",
      status: "success",
    });
  } else {
    res.status(200).send({
      message: "user not found",
    });
  }

  //     const user_id = req.params.id;
  //   console.log(user_id)
  //     const user_delete= await userSchema.findByIdAndDelete(user_id) .then((user_delete) => {
  //         if (user_delete) {
  //             return res.status(200).json({success: true, message: "User deleted successfully", status:"success"})
  //         } else {
  //             return res.status(404).json({success: false, message: "User not found", status:"error"})
  //         }
  //     })
  //     .catch((err) => {
  //         return res.status(500).json({success: false, message: err, status:"error"})
  //     })
});

// //authentication for profile
// async function authentication(req, res, next) {

// }

module.exports = router;
