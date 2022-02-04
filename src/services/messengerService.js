const User = require("../models/User");
module.exports.getFriends = async req => {
  try {
    const users = await User.findOne({ _id: req.id })
      .select("friends")
      .populate("friends", "name profileImage");

    return { data: users, status: 200 };
  } catch (err) {
    return { err };
  }
};
