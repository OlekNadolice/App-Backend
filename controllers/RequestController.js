const User = require("../models/User");

module.exports.sendFriendRequest = async (req, res) => {
  try {
    console.log(req.id);
    console.log(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.targetID },
      { $push: { friendsRequests: req.id } }
    );

    res.json({ data: "succes" }).status(201);
  } catch (err) {
    console.log(err);
    res.json({ data: "Ups something went wrong" });
  }
};

module.exports.acceptFriendRequest = async (req, res) => {
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
    res.json({ status: 201, data: "Request accepted" });
  } catch (err) {
    res.json({ data: "Ups Something went wrong", status: 500 });
  }
};

module.exports.declineFriendRequest = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.id },
      {
        $pull: { friendsRequests: req.body.targetID },
      }
    );

    res.json({ status: 201, data: "Request accepted" });
  } catch (err) {
    res.json({ data: "Ups Something went wrong", status: 500 });
  }
};

module.exports.deleteFriend = async (req, res) => {
  try {
    const firstUser = await User.findOneAndUpdate(
      { _id: req.id },
      { $pull: { friends: req.body.targetID } }
    );
    const secondUser = await User.findOneAndUpdate(
      { _id: req.body.targetID },
      { $pull: { friends: req.id } }
    );

    res.json({ message: "Delete succesfully", status: 204 });
  } catch (err) {
    res.json({ message: err, status: 500 });
  }
};
