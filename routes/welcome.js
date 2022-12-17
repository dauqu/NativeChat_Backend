// const express = require("express");
// const router = express.Router();
// const college_selection= require("../models/welcome")


// router.post("/", async (req,res) => {

//     //create slug with remove spaces and make it lowercase
//     const slug = Slugify(req.body.title, {
//         lower: true,
//         remove: /[*+~.()'"!:@]/g,
//     });

//     const welcome = new college_selection({
//         title: req.body.title,
//         slug: slug,
//         description: req.body.description,
//     })
// })