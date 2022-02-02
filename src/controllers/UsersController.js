const User = require("../models/User");

module.exports.findSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const targetUser = await User.findOne({ _id: id });
    const { name, city, profileImage, friends, friendsRequests, _id } = targetUser;
    const user = { name, city, profileImage, friends, friendsRequests, _id };
    res.json({ user });
  } catch (err) {
    res.send(err);
  }
};

module.exports.getAllUsers = async (req, res) => {
  let users = await User.find({});
  const count = await User.countDocuments();

  if (req.query.name) {
    const { name } = req.query;
    const queryString = name.replace(",", " ");
    users = await User.findOne({ name: queryString });
  }

  if (req.query.type && req.query.id) {
    const { id, type } = req.query;
    users = await User.findOne({ _id: id }).select(type);

    if (Array.isArray(users[type]) && users[type].length > 0) {
      users = await User.findOne({ _id: id })
        .select(type)
        .populate(type, "name profileImage _id");
    }
  }

  if (req.query.page) {
    const page = req.query.page || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    users = await User.find({})
      .select("name")
      .select("profileImage")
      .select("city")
      .limit(limit)
      .skip(skip);
  }

  res.json({ data: users, count: count });
};
