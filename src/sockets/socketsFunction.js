const Conversation = require("../models/Conversation");
const User = require("../models/User");

let onlineUsers = [];

module.exports.joinUserToServer = async (user, socket) => {
  !onlineUsers.find(e => e.id === user) &&
    onlineUsers.push({ id: user, socketId: socket.id });
};

module.exports.sendMessageToUser = async (message, io) => {
  const { target, id } = message;
  const conversation = await Conversation.findOneAndUpdate(
    { members: { $all: [id, target] } },
    {
      $push: { messages: { author: id, text: message.message, created: Date.now() } },
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

  const user = onlineUsers.find(e => e.id === target);
  // let secondUser = onlineUsers.find(e => e.id === id);
  const sender = await User.findOne({ _id: id });

  user &&
    io.to(user.socketId).emit("message", {
      message: message.message,
      author: id,
      created: message.created,
      senderName: sender.name,
    });
};

module.exports.disconnectUser = async socket => {
  const user = onlineUsers.find(e => e.socketId === socket.id);
  user && (onlineUsers = onlineUsers.filter(e => e.id !== user.id));
};

module.exports.findActiveFriends = async (data, io) => {
  const user = await User.findOne({ _id: data.id });
  const friends = await user.friends;
  const active = onlineUsers.filter(e => friends.includes(e.id));
  const sendTo = onlineUsers.find(e => e.id === data.id);

  sendTo && io.to(sendTo.socketId).emit("active", active);
};

module.exports.sendFriendRequest = async (data, io) => {
  const { id, targetID } = data;

  const requestReciver = onlineUsers.find(e => e.id === targetID);
  const sender = await User.findOne({ _id: id });

  requestReciver && io.to(requestReciver.socketId).emit("friendsRequest", sender.name);
};

module.exports.findConversation = async (data, io) => {
  const conversation = await Conversation.findOne({
    members: { $all: [data.id, data.secondUserId] },
  });

  let user = onlineUsers.find(e => e.id === data.id);

  if (!conversation) {
    io.to(user.socketId).emit("findChat");
  }

  conversation && io.to(user.socketId).emit("findChat", conversation.messages);
};
