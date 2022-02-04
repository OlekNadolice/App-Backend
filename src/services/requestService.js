const User = require("../models/User");
module.exports.sendRequestToFriend = async req => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.body.targetID },
      { $push: { friendsRequests: req.id } }
    );
    return { data: "succes", status: 201 };
  } catch (err) {
    return { data: "Ups something went wrong" };
  }
};

module.exports.acceptFriendRequest = async req => {
  try {
    const firstUser = await User.findOneAndUpdate(
      { _id: req.id },
      {
        $push: { friends: req.body.targetID },
        $pull: { friendsRequests: req.body.targetID },
      }
    );
    const secondUser = await User.findOneAndUpdate(
      { _id: req.body.targetID },
      { $push: { friends: req.id } }
    );

    return { status: 201, data: "Request accepted" };
  } catch (err) {
    return { data: "Ups Something went wrong", status: 500 };
  }
};

module.exports.declineFriendRequest = async req => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.id },
      {
        $pull: { friendsRequests: req.body.targetID },
      }
    );

    return { status: 201, data: "Request accepted" };
  } catch (err) {
    return { data: "Ups Something went wrong", status: 500 };
  }
};

module.exports.deleteFriend = async req => {
  try {
    const firstUser = await User.findOneAndUpdate(
      { _id: req.id },
      { $pull: { friends: req.body.targetID } }
    );
    const secondUser = await User.findOneAndUpdate(
      { _id: req.body.targetID },
      { $pull: { friends: req.id } }
    );

    return { message: "Delete succesfully", status: 204 };
  } catch (err) {
    return { message: err, status: 500 };
  }
};
