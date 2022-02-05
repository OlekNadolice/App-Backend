const dotenv = require("dotenv");
const app = require("./appConfig");
// const cors = require("cors");
const http = require("http");
const db = require("./db/dbConfig");
const server = http.createServer(app);

dotenv.config({ path: "../.env" });
const socketsFunctions = require("./sockets/socketsFunction");

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: "*",
  },
});

io.on("connection", socket => {
  let { user } = socket.handshake.query;

  socketsFunctions.joinUserToServer(user, socket);

  socket.on("friendsRequest", data => {
    socketsFunctions.sendFriendRequest(data, io);
  });

  socket.on("active", data => {
    socketsFunctions.findActiveFriends(data, io);
  });

  socket.on("disconnect", () => {
    socketsFunctions.disconnectUser(socket);
  });

  socket.on("findChat", data => {
    socketsFunctions.findConversation(data, io);
  });

  socket.on("message", message => {
    socketsFunctions.sendMessageToUser(message, io);
  });
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});

module.exports.server;
