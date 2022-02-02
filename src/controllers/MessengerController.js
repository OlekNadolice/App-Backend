const User = require("../models/User");
const Conversation = require("../models/Conversation");

module.exports.getFriends = async (req, res) => {
  try {
    const users = await User.findOne({ _id: req.id })
      .select("friends")
      .populate("friends", "name profileImage");

    res.json({ data: users, status: 200 });
  } catch (err) {
    res.send(err);
  }
};
