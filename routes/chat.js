
const Message = require('../models/chat_schema');
const app = require('express').Router();
const { wss } = require('../index');
//Import ws package


//Post request
app.post('/', (req, res) => {

    //Here you can save body request to database
    //.......................
    //Add data to database
    const message = new Message({
        name: req.body.name,
        message: req.body.message,
    });

    //Save data to database
    message.save();

    //Send message to all clients when post request is received
    wss.clients.forEach((client) => {
        client.send(req.body.name);
    });

    //Send response to client
    res.json({ message: 'Sent' });
});


//Get request
app.get('/', (req, res) => {

    //Get data from database
    Message.find({}, (err, data) => {
        if (err) {
            res.json({ message: 'Error' });
        } else {
            res.json(data);
        }
    });
});





module.exports = app;