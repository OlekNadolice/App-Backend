const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "This field is required"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "This field is required"],
    unique: [true, "This email is already used"],
  },
  password: {
    type: String,
    required: [true, "This field is required"],
    min: 6,
  },
  city: {
    type: String,
    default: "Not Entered",
  },
  phone: {
    type: Number,
    default: 0,
  },

  born: {
    type: Date,
  },

  height: {
    type: Number,
    default: 0,
  },

  description: {
    type: String,
    default: "Jestem sobie ziomek",
  },
  profileImage: {
    type: String,
    default: "defaultImage.jpg",
  },
  hobbies: {
    type: [String],
  },

  friends: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
    default: [],
  },

  friendsRequests: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
