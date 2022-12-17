// const router = require("express").Router();
// // const authenticate = require("../middlewares/authenticate");
// const comment = require("../models/comment1");
// // const  nanoid  = require("nanoid");
// //jwt
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// //make a new comment;

// router.post("/newcomment", authenticate, async (req, res) => {
//   //Check user have token or not
//   const token =
//     req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

//   if (token == undefined || token == null || token == "") {
//     return res.json(false);
//   }

//   const have_valid_tokem = jwt.verify(token, process.env.JWT_SECRET, {
//     algorithm: "HS256",
//   });

//   if (!have_valid_tokem) {
//     return res.json(false);
//   }

//   //Check Same id have database
//   const user = await comment.findOne({ id_from_token }).lean();

//   if (user == undefined || user == null || user == "") {
//     res.json(false);
//   } else {
//     res.json(true);
//   }

//   // if (req.user._id == req.body.user) {
//   //   try {
//   //     //if(!req.body.comment) return res.status(400).send({message:"You can't make an empty comment"});
//   //     if(req.user.accountStatus.active === false) return res.status(400).send({message:"You are not allowed"})
//   //     let comment = await Comment.create(req.body);
//   //     return res
//   //       .status(200)
//   //       .send({ message: "Commented Successfully", status: true });
//   //   } catch (err) {
//   //     return res.status(500).send({ err: err.message, status: false });
//   //   }
//   // } else {
//   //   return res
//   //     .status(400)
//   //     .send({ message: "You can't comment without login", status: false });
//   // }
// });

// //get all comments of a specific post;

// router.get("/allcomments/:postId", async (req, res) => {
//   try {
//     let comments = await Comment.find({ post: req.params.postId })
//       .populate("user", { password: 0, email: 0, _id: 0 })
//       .populate({
//         path: "nestedcomments",
//         populate: [{ path: "realuser", select: { profilePic: 1 } }],
//       })
//       .lean()
//       .exec();

//     return res.status(200).send({ comments: comments, count: comments.length });
//   } catch (err) {
//     return res.status(500).send({ err: err.message, status: false });
//   }
// });

// router.delete("/singlecomment/delete", authenticate, async (req, res) => {
//   try {
//     let comment = await Comment.findById(req.body.id).lean().exec();
//     if (comment.user != req.user._id && !req.user.admin)
//       return res.status(400).send({
//         message: "You are not authorized to delete the comment",
//         status: false,
//       });

//     comment = await Comment.findByIdAndDelete(req.body.id);

//     return res
//       .status(200)
//       .send({ message: "Comment deleted successfully", status: true });
//   } catch (err) {
//     return res.status(500).send({ message: "Comment not available" });
//   }
// });

// router.patch(
//   "/singlecomment/update/:commentId",
//   authenticate,
//   async (req, res) => {
//     try {
//       const comment = await Comment.findById(req.params.commentId)
//         .lean()
//         .exec();

//       if (req.user._id != comment.user)
//         return res.status(400).send({
//           message: "You are not authorised to edit this comment",
//           status: false,
//         });
//       // console.log(req.body, comment);
//       const commentupdate = await Comment.findByIdAndUpdate(
//         req.params.commentId,
//         { comment: req.body.editedcomment },
//         { new: true }
//       )
//         .lean()
//         .exec();

//       return res.status(200).send({
//         message: "Updated Successfully",
//         status: true,
//         comment: commentupdate,
//       });
//     } catch (err) {
//       return res.status(500).send({
//         message: "Not authorized or comment not available",
//         status: false,
//       });
//     }
//   }
// );

// ////////////////---------Replies on commnets -------------------Nested Comments--------------------------------
// router.post(
//   "/singlecomment/nestedcomment/:commentId/:userId",
//   authenticate,
//   async (req, res) => {
//     try {
//       if (req.user.username != req.params.userId)
//         return res
//           // .status(404)
//           .send({ message: "Please login before comment", status: false });
//       if (req.user.accountStatus.active === false)
//         return res.status(400).send({ message: "You are not allowed" });
//       let deta = {
//         // uniqueId: nanoid(10),
//         realuser: req.body.realuser,
//         user: req.params.userId,
//         comment: req.body.comment,
//         date: new Date(),
//       };
//       let pushReplies = await Comment.updateOne(
//         { _id: req.params.commentId },
//         { $push: { nestedcomments: deta } },
//         { new: true }
//       )
//         .lean()
//         .exec();
//       return res.status(200).send({ message: "Success", status: true });
//     } catch (err) {
//       return res.status(500).send(err);
//     }
//   }
// );
// //deleting the single replies of specific user after authentication
// router.delete(
//   "/singlecomment/nestedcomment/delete/:commentId/:nestedcommentId",
//   authenticate,
//   async (req, res) => {
//     try {
//       const repliedComment = await Comment.findOne(
//         { _id: req.params.commentId },
//         {
//           nestedcomments: {
//             $elemMatch: { uniqueId: req.params.nestedcommentId },
//           },
//         }
//       )
//         .lean()
//         .exec();
//       //   console.log(req.user.username,repliedComment.nestedcomments[0].user)//extracted the userName from db to check the authentication
//       if (
//         req.user.username != repliedComment.nestedcomments[0].user &&
//         !req.user.admin
//       )
//         return res
//           .status(401)
//           .send("You are not authorised to delete this comment");
//       const deletedComment = await Comment.updateOne(
//         { _id: req.params.commentId },
//         { $pull: { nestedcomments: { uniqueId: req.params.nestedcommentId } } }
//       )
//         .lean()
//         .exec();
//       return res.status(200).send(deletedComment);
//     } catch (err) {
//       return res.status(500).send(err);
//     }
//   }
// );

// //editing the single replies of specific user after authentication
// router.patch(
//   "/singlecomment/nestedcomment/edit/:commentId/:nestedcommentId",
//   authenticate,
//   async (req, res) => {
//     try {
//       const repliedComment = await Comment.findOne(
//         { _id: req.params.commentId },
//         {
//           nestedcomments: {
//             $elemMatch: { uniqueId: req.params.nestedcommentId },
//           },
//         }
//       )
//         .lean()
//         .exec();
//       //   console.log(req.user.username,repliedComment.nestedcomments[0].user)//extracted the userName from db to check the authentication
//       if (req.user.username != repliedComment.nestedcomments[0].user)
//         return res
//           .status(401)
//           .send("You are not authorised to edit this comment");
//       //finding the replied comment that need to be edited and then using position operator to set it;
//       const editedcomments = await Comment.updateOne(
//         {
//           _id: req.params.commentId,
//           "nestedcomments.uniqueId": req.params.nestedcommentId,
//         },
//         { $set: { "nestedcomments.$.comment": req.body.editedcomment } }
//       );

//       return res.status(200).send(editedcomments);
//     } catch (err) {
//       return res.status(500).send(err.message);
//     }
//   }
// );

// //middleware to authenticate the user

// async function authenticate(req, res, next) {
//   //If we have received the bearer token in the header;

//   try {
//     // console.log(req.headers.authorization)
//     //getting the bearer token from the response cookies
//     const bearerToken = req.headers.authorization;
//     //If not we will throw an error
//     if (!bearerToken || !bearerToken.startsWith("Bearer "))
//       return res.status(400).send("Please provide a bearer token");

//     //else we will extract the user from the token

//     const token = bearerToken.split(" ")[1];
//     const { user } = await verifyToken(token);

//     //checking that user is banned or not
//     if (user.accountStatus.active === false)
//       return res.status(400).send("Banned user");
//     req.user = user;

//     //console.log(user);

//     return next();
//   } catch (err) {
//     //If not user thrpow error
//     return res.status(400).send("Please provide a valid bearer token");
//   }
// }

// module.exports = router;
