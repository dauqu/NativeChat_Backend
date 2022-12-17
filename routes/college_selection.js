const express = require("express");
const router = express.Router();
require("dotenv").config();
// const image_upload = require('../models/image_upload');
const college_selection= require("../models/image_upload");



// //Static file
// router.use("/", express.static("files"));


router.post("/", async (req,res) => { 
    

    // generate userid
     const userid=
      Math.random().toString(36).substring(2,15)+
      Math.random().toString(36).substring(2,15);

      //add college
      const college= new college_selection ({
        userid: userid,
        cllg_name: req.body.cllg_name,
        cllg_loc:req.body.cllg_loc,
        phone: req.body.phone
      })
      try {
        await college.save();
        res.status(200).send({message: "College added"})
      } catch (error) {
        res.status(400).json({message: error.message, status:"error"})
      }

})

//Get one college_detail
router.get("/:id", async (req, res) => {
    try {
      const get_one_college = await college_selection.findById(req.params.id).lean();
      if (!get_one_college) {
        return res
          .status(404)
          .json({ message: "Product not found", status: "error" });
      }
      res.status(200).json(get_one_college);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  //Get all college_detail
  router.get("/", async (req, res) => {
    try {
        const get_all_college = await college_selection.find().lean();
        res.status(200).json(get_all_college);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //Update One college_detail
 router.patch("/:id", async (req, res) => {
    try {
      const update_college = await college_selection.findById(req.params.id);
  
      if (!update_college) {
        return res.status(404).json({ message: "College not found", status: "error" });
      }
      update_college.cllg_name = req.body.cllg_name;
      update_college.cllg_loc = req.body.cllg_loc;
      update_college.phone = req.body.phone;
     
  
      
      await update_college.save();
      res.status(200).json({ message: "College updated successfully", status: "success" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //Delete One college_detail
router.delete("/:id",async (req, res) => {
    try {
      const delete_college = await college_selection.findById(req.params.id);
      if (!delete_college) {
        return res.status(404).json({ message: "College not found", status: "error" });
      }
      await delete_college.remove();
      res.status(200).json({ message: "College has been deleted successfully", status: "success" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



  module.exports= router;