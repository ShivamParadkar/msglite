// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').parse();
//   }

// Node server which will handle socket io connections
const express = require('express');
const app = express();
const path = require('path');
const io = require('socket.io')(8000);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res)=>{
    res.render('index.html');
})

const users = {};

io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})

app.listen(process.env.PORT,()=>{
    console.log('server is running on port 3003');
})