// Setup code to get the server running

// Create an express server
const express = require('express');

// Variable running that express function
const app = express();

// Get a server to be used with socket.io
const server = require('http').Server(app);

const io = require('socket.io')(server);
const { v4: uuidV4} = require('uuid');

// Setup express server
app.set('view engine', 'ejs');

//Setup static folder. All javascript & css will be put in public.
app.use(express.static('public'));

//This will take a request and a response and create a new room and redirect user to that room
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
});

//Route for room
app.get('/:room', (req, res) => {
   res.render('room', {roomId: req.params.room});
});


// It will run any time someone connects to our webpage. Setup events to listen to.
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
});

server.listen(3000);