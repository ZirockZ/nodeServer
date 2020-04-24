const http = require('http');
var socket = require('socket.io');
const app = require('./app.js');

const port = process.env.PORT || 4000;

const server = http.createServer(app);
server.listen(port);

const io = socket(server);

io.on('connection', function(socket){
    console.log('Socket connected successfully')

    socket.on('new message', (action) => {
        io.sockets.emit('new message', action)
    })
});