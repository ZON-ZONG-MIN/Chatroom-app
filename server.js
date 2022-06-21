const express = require("express");
const Socket = require("socket.io");

const app = express();
const path = require('path');

const server = require("http").createServer(app);
const io = Socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// Templating Engine
app.set('view engine', 'ejs');
//load Static assets
app.use('/static', express.static(path.join(__dirname, 'views')));

let PORT = 3000;

app.get('/', (req, res) => {
  res.render('index');
})

server.listen(PORT, () => {
  console.log("listening on port", PORT);
})

const users = [];

io.on("connection", (socket) => {

  console.log("connection to ", socket.id);

  //接收"adduser"的運行結果
  socket.on("adduser", (username) => {
    socket.user = username;
    users.push(username);
    //對所有線上 socket 傳訊息
    io.sockets.emit("users", users);
  })

  //接收"message"的運行結果
  socket.on("message", (message) => {

    //對所有線上 socket 傳訊息
    io.sockets.emit("message_client", {
      message,
      user: socket.user
    })
  })

  socket.on("disconnect", () => {
    console.log("we are disconnecting", socket.user)
  
    if(socket.user) {
      users.splice(users.indexOf(socket.user), 1)
  
      io.sockets.emit("users", users);
      
      console.log('remaining users: ', users);
    }
  })
  
})

