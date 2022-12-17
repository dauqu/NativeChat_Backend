const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
require("dotenv").config();
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const WebSocket = require("ws");

//cookies
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);

//Allow static files
app.use(express.static(__dirname + "/files"));

// Enable file upload using express-fileupload
app.use(fileupload({ createParentPath: true }));

//Connect to database
const connectDB = require("./config/connection");
connectDB();

app.use(express.json()); //to solve Cannot destructure property 'email' of 'req.body' as it is undefined.

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/register", require("./routes/register"));
app.use("/api/login", require("./routes/login"));
app.use("/api/college", require("./routes/college_selection"));
app.use("/api/files", require("./routes/files"));
app.use("/api/comments", require("./routes/comments"));
// app.use("/api/comment1", require("./routes/comment1"))
app.use("/api/comment2", require("./routes/comment2"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/account", require("./routes/account"));
app.use("/api/setting", require("./routes/setting"));
app.use("/api/classes", require("./routes/classes"));
app.use("/api/chat", require("./routes/chat"));

const server = app.listen(PORT, () => {
  console.log(`server is running on the ${PORT}`);
});

const wss = new WebSocket.Server({ port: 8082 });

wss.getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
};
wss.on("connection", (ws) => {
  ws.id = wss.getUniqueID();
  console.log(`New client connected with id: ${ws.id}`);
  // app.post("/", (req, res) => {
 
  ws.onmessage = ({data} ) => {
    console.log(`Client ${ws.id}`);
    console.log(data.message)

    //Save data to database
    // const newMessage = new Message({
    //   client_id: ws.id,
    //   data: data,
    // });
    // newMessage.save();

    //get data from database
    // Message.find({}, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(data);
    //   }
    // });

    //send message to specific client
    // wss.clients.forEach(function each(client) {
    //   if (client.id === "c1") {
    //     client.send(`${data}`);
    //   }
    // });

    // wss.clients.forEach(function each(client) {
    //   if (client !== ws && client.readyState === WebSocket.OPEN) {
    //     client.send(`${data}`);
    //   }
    // });
  };

  ws.onclose = function () {
    console.log(`Client ${ws.id} has disconnected!`);
  };
});
// });
module.exports = {
  wss,
};
