const express= require("express")
const router= express.Router();
const setting_details= require("../models/setting")

//add user details
router.post("/", async(req,res) => {

    //generate random class_id
    const class_id= 
    Math.random().toString(36).substring(2,8)
   


    //add details
    const details= new setting_details({
        class_id: class_id,
        icon : "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png",
        class_name:req.body.class_name,
        class_owners : [
            {
                userid: req.body.userid
            }
        ] 
    })
    try {
        await details.save();
        res.status(200).send({ message: "Class details added successfully"})
    } catch (error) {
        res.status(400).send({ message: error.message, status:"error"})
    }
}) 

  //get class details
router.get("/:id", async(req,res) => { 
     const details= await setting_details.findOne({class_id: req.params.id})
    if (details) {
        res.status(200).send(details)
    } else {
        res.status(400).send({message: "Class not found", status: "error"})}
})

//get all class details
router.get("/", async(req,res) => {
    const details= await setting_details.find()
    if (details) {
        res.status(200).send(details)
    } else {
        res.status(400).send({message: "Class not found",
        status: "error"})
    }
})

//update class details
router.put("/:id", async(req,res) => {
    const details= await setting_details
    .findOne({class_id: req.params.id})
    if (details) {
        details.icon= req.body.icon
        details.class_name= req.body.class_name
        class_owners : [
            {
                userid: req.body.userid
            }
        ]
        try {
            await details.save()
            res.status(200).send({message: "Class details updated successfully"})
        } catch (error) {
            res.status(400).send({message: error.message, status: "error"})
        }
    } else {
        res.status(400).send({message: "Class not found",
        status: "error"})
    }
})





module.exports= router