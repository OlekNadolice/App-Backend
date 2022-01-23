const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  members: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
  },
  messages: {
    type: [
      {
        author: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
        text: String,
        created: { type: Date, default: Date.now() },
      },
    ],
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
