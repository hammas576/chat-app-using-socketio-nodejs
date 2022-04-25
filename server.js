const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { instrument } = require("@socket.io/admin-ui");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected with id " + socket.id);

  socket.on("chat message", (msg, roomid) => {
    //  console.log("message: " + msg + "  room id is " + roomid);

    if (roomid === "") {
      io.emit("chat message", msg);

      //socket.broadcast.emit("chat message", msg);
    } else {
      socket.join(roomid);
      socket.to(roomid).emit("chat message", msg);
      //socket.broadcast.emit("chat message", msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

instrument(io, { auth: false });

server.listen(3000, () => {
  console.log("server has started");
});
