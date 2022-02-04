const User = require("../models/User");
const Conversation = require("../models/Conversation");

module.exports.updateImage = async req => {
  if (req.files) {
    let profileImage = req.files.profileImage;
    profileImage.mv("../uploads/" + profileImage.name);
    await User.findByIdAndUpdate({ _id: req.id }, { profileImage: profileImage.name });
    return {
      status: true,
      message: "File is uploaded",
    };
  } else {
    return { message: "Photo not found" };
  }
};

module.exports.updateUserInfo = async req => {
  const { name, bio, city } = req.body;
  const obj = {};
  name && (obj.name = name);
  bio && (obj.description = bio);
  city && (obj.city = city);
  const user = await User.findByIdAndUpdate({ _id: req.id }, obj);
  return { status: 204, message: "Updated sucesfully" };
};

module.exports.deleteAccount = async req => {
  const user = await User.findOne({ _id: req.id });
  user.friends.forEach(element => {
    const deleteFromFriendList = async () => {
      await User.findOneAndUpdate({ _id: element }, { $pull: { friends: req.id } });
    };
    deleteFromFriendList();
  });

  await Conversation.deleteMany({ members: { $in: req.id } });
  await User.findByIdAndDelete({ _id: req.id });

  return { status: 204, data: "Account has been deleted" };
};
