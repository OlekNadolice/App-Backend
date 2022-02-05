const dotenv = require("dotenv");
const app = require("./appConfig");
const cors = require("cors");
const http = require("http");
const db = require("./db/dbConfig");
const server = http.createServer(app);
const Conversation = require("./models/Conversation");
const User = require("./models/User");
dotenv.config({ path: "../.env" });

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: "*",
  },
});

let arr = [];
io.on("connection", socket => {
  let { user } = socket.handshake.query;

  joinUserToServer(user, socket);

  socket.on("friendsRequest", data => {
    sendFriendRequest(data);
  });

  socket.on("active", data => {
    findActiveFriends(data);
  });

  socket.on("disconnect", () => {
    disconnectUser(socket);
  });

  socket.on("findChat", data => {
    findConversation(data);
  });

  socket.on("message", message => {
    sendMessageToUser(message);
  });
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});

module.exports.server;
// module.exports.app;
module.exports.io;

// ** Functions for SOCKET IO

const joinUserToServer = async (user, socket) => {
  !arr.find(e => e.id === user) && arr.push({ id: user, socketId: socket.id });
};

const sendMessageToUser = async message => {
  const { target, id } = message;
  const conversation = await Conversation.findOneAndUpdate(
    { members: { $all: [id, target] } },
    {
      $push: { messages: { author: id, text: message.message } },
    }
  );

  if (!conversation) {
    const createConversation = async () => {
      const conversation = await Conversation.create({
        members: [target, id],
        messages: { author: id, text: message.message },
      });
    };
    createConversation();
  }

  const user = arr.find(e => e.id === target);
  let secondUser = arr.find(e => e.id === id);

  user &&
    io.to(user.socketId).emit("message", {
      message: message.message,
      author: id,
    });
};

const disconnectUser = async socket => {
  const user = arr.find(e => e.socketId === socket.id);

  user && (arr = arr.filter(e => e.id !== user.id));
};

const findActiveFriends = async data => {
  const user = await User.findOne({ _id: data.id });
  const friends = await user.friends;
  const active = arr.filter(e => friends.includes(e.id));
  const sendTo = arr.find(e => e.id === data.id);

  io.to(sendTo.socketId).emit("active", active);
};

const sendFriendRequest = async data => {
  const { id, targetID } = data;
  await User.findOneAndUpdate({ _id: targetID }, { $push: { friendsRequests: id } });
  const requestReciver = arr.find(e => e.id === targetID);
  const sender = await User.findOne({ _id: id });
  requestReciver && io.to(requestReciver).emit("friendRequest", sender._id);
};

const findConversation = async data => {
  const conversation = await Conversation.findOne({
    members: { $all: [data.id, data.secondUserId] },
  });

  let user = arr.find(e => e.id === data.id);

  if (!conversation) {
    io.to(user.socketId).emit("findChat");
  }

  conversation && io.to(user.socketId).emit("findChat", conversation.messages);
};
