var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors')

app.use(express.static('public'))



app.use(cors())




var meshArray = []

app.get('/', (req, res) => {
  // CORS POLICY
  
  
  res.sendFile(__dirname + "/index.html")
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('put mesh', meshInfo => {
    meshArray.push(meshInfo)
    socket.broadcast.emit('put mesh', meshInfo)
  })
  socket.on('delete mesh', index => {
    meshArray.splice(index,1);
    socket.broadcast.emit('delete mesh', index)
  })
});

app.get('/meshes', (req, res) => {
  res.json({meshArray})
})



http.listen(3000, () => {
  console.log('listening on *:3000');
});