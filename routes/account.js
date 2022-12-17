const express= require("express")
const router= express.Router()
const account_schema= require("../models/account")
const userSchema = require("../models/users");

//add details to account
router.post("/", async (req, res) => {
    const account= new account_schema({
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        display_name: req.body.display_name,
        language: "english" 
    })
    try {
        await account.save()
        res.status(200).send({
            message: "Account details added successfully"
        })
    } catch (error) {
        res.status(400).json({message: error.message, status: "error"})
    }
})

//update account details
router.put("/:id", async (req, res) => {
    const account= await account_schema.findOne({id: req.params.id})
    if (account) {
        account.f_name= req.body.f_name
        account.l_name= req.body.l_name
        account.display_name= req.body.display_name
        account.language= req.body.language
        try {
            await account.save()
            res.status(200).send({
                message: "Account details updated successfully"
            })
        } catch (error) {
            res.status(400).json({message: error.message, status: "error"})
        }
    } else {
        res.status(400).json({message: "Account not found", status: "error"})
    }
})

//delete account details
router.delete("/:id", async (req, res) => {
    const account= await account_schema.findOne({id: req.params.id})
    if (account) {
        try {
            await account.remove()
            res.status(200).send({
                message: "Account details deleted successfully" })
        } catch (error) {
            res.status(400).json({message: error.message, status: "error"})
        }
    } else {
        res.status(400).json({message: "Account not found", status: "error"})
    }
})

//delete user from "users" schema
router.delete("/:id", async (req, res) => {
    const user = await userSchema.findOne({ userid: req.params.id });
    if (user) {
      await user.remove();
      res.status(200).send({ message: "User deleted successfully" });
    } else {
      res.status(400).send({ message: "User not found", status: "error" });
    }
  });

module.exports= router;