const express = require("express");
const router = express.Router();
require("dotenv").config();






  //upload file
  router.post('/upload', (req, res) => {  
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
  avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
            });
        }
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
});

//Delete files
router.post("/delete", delete_file, (req, res) => {
  try {
    const name = req.body.name;
    const directoryPath = path.join(__dirname, "../uploads");
    fs.unlink(`${directoryPath}/${name}`, (error) => {
      if (error) {
        res.status(500).json({ message: error.message, status: "error" }); 
      }
    });
    res.send({
      status: "success",
      message: "File successfully deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});


//Middleware for upload files
async function upload_file(req, res, next) {
  try {
    const decoded = JWT.verify(req.cookies.token, process.env.JWT_SECRET);
    const user = await User_Model.findById(decoded.id);
    //Check if user is logged in
    if (req.cookies.token === undefined) {
      return res.status(401).json({
        message: "You are not logged in",
        status: "warning",
      });
    }

    //CHeck if user is admin
    if (user.role !== "admin") {
      return res.status(401).json({
        message: "You are not authorized to upload files",
        status: "warning",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
}

//Middleware for delete files
async function delete_file(req, res, next) {
  //Check user have token or not
  const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];

  try {
    //Check if user is logged in
    if (token === undefined || token === null || token === "") {
      return res.status(401).json({
        message: "You are not logged in",
        status: "warning",
      });
    }

    //Check if user is admin
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    //Get id from token
    const id = decoded.id;
    //Get user role by id
    const user = await User_Model.findById(id);
    if (user.role !== "admin") {
      return res.status(401).json({
        message: "You are not authorized to delete files",
        status: "warning",
      });
    }

    //Check if file exists
    const name = req.body.name;
    const directoryPath = path.join(__dirname, "../files");

    if (!fs.existsSync(`${directoryPath}/${name}`)) {
      res.status(404).json({ message: "File not found", status: "error" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
}

module.exports= router;