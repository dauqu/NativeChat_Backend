const express = require("express");
const router = express.Router();
const classSchema = require("../models/classes");
const userSchema = require("../models/users");

//create class
router.post("/:id", async (req, res) => {
  //genetae class code
  const class_code = (
    Math.random().toString(36).substring(2, 5) +
    Math.random().toString(36).substring(2, 5)
  ).toUpperCase();
//   console.log(class_code);
  try {
    const { id } = req.params;

    const classes = new classSchema({
      class_code: class_code,
      name: req.body.name,
      owner: id,
    });

    const teacher = await userSchema.findById(id);
    teacher.classes.push(classes._id);

    await classes.save();
    await teacher.save();

    await classes.save();
    res.status(200).send({
      message: "Class created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message, status: "error" });
  }
});

//get classes by teahcer id
router.get("/:id", async (req, res) => {
  const classes = await userSchema
    .find({ role: "teacher", _id: req.params.id })
    .populate({
      path: "classes",
    });
  if (classes) {
    res.status(200).send({
      message: "Classes found",
      classes,
    });
  } else {
    res.status(200).send({
      message: "Classes not found",
    });
  }
});

//delete class
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted_class = await classSchema.findByIdAndDelete(id);
    if (deleted_class) {
      res
        .status(200)
        .send({ message: "Class deleted successfully", status: "success" });
    } else {
      res.status(200).send({
        message: "Class not found",
        status: "error",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message, status: "error" });
  }
});

//get classes by student id
router.get("/student/:id", async (req, res) => {
  const classes = await userSchema
    .find({ role: "student", _id: req.params.id })
    .populate({
      path: "classes",
    });
  if (classes) {
    res.status(200).send({
      message: "Classes found",
      classes,
    });
  } else {
    res.status(200).send({
      message: "Classes not found",
    });
  }
});

//get all classes by  parent id
router.get("/parent/:id", async (req, res) => {
  const classes = await userSchema
    .find({ role: "parent", _id: req.params.id })
    .populate({
      path: "classes",
    });
  if (classes) {
    res.status(200).send({
      message: "Classes found",
      classes,
    });
  } else {
    res.status(200).send({
      message: "Classes not found",
    });
  }
});

module.exports = router;
