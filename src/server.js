const express = require("express");

const dotenv = require("dotenv");

const authRouter = require("./routes/Auth");
const messengerRouter = require("./routes/Messenger");
const userRouter = require("./routes/Users");
const cors = require("cors");
const app = express();
const http = require("http");
const db = require("./db/dbConfig");
const server = http.createServer(app);
const Conversation = require("./models/Conversation");
dotenv.config({ path: "../.env" });
const User = require("./models/User");
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: "*",
  },
});

const fileUpload = require("express-fileupload");

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    allowedHeaders: "* ",
    methods: "*",
    credentials: true,
  })
);

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

app.use(fileUpload({ createParentPath: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/messenger", messengerRouter);
app.use("/users", userRouter);
app.use(express.static("src/uploads"));
app.use("/images", express.static("src/uploads"));

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});

module.exports.server;
module.exports.app;

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
