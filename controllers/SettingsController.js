const User = require("../models/User");
const Conversation = require("../models/Conversation");
const { $where } = require("../models/User");

// ** Controller responsible for updating user's picture.
module.exports.UpdateImage = async (req, res) => {
  if (req.files) {
    let profileImage = req.files.profileImage;
    profileImage.mv("./uploads/" + profileImage.name);
    await User.findByIdAndUpdate({ _id: req.id }, { profileImage: profileImage.name });

    res.json({
      status: true,
      message: "File is uploaded",
    });
  } else {
    res.send("Nie ma foty");
  }
};

module.exports.UpdateUserInfo = async (req, res) => {
  const { name, bio, city } = req.body;
  const obj = {};
  name && (obj.name = name);
  bio && (obj.description = bio);
  city && (obj.city = city);
  const user = await User.findByIdAndUpdate({ _id: req.id }, obj);
  res.json({ status: 204, message: "Updated sucesfully" });
};

module.exports.deleteAccount = async (req, res) => {
  const user = await User.findOne({ _id: req.id });
  user.friends.forEach(element => {
    const deleteFromFriendList = async () => {
      await User.findOneAndUpdate({ _id: element }, { $pull: { friends: req.id } });
    };
    deleteFromFriendList();
  });

  await Conversation.deleteMany({ members: { $in: req.id } });
  await User.findByIdAndDelete({ _id: req.id });

  res.json({ status: 204, data: "Account has been deleted" });
};
