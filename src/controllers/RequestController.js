const requestService = require("../services/requestService");

module.exports.sendFriendRequest = async (req, res) => {
  const data = await requestService.sendRequestToFriend(req);
  res.json(data);
};

module.exports.acceptFriendRequest = async (req, res) => {
  const data = await requestService.acceptFriendRequest(req);
  res.json(data);
};

module.exports.declineFriendRequest = async (req, res) => {
  const data = await requestService.declineFriendRequest(req);
  res.json(data);
};

module.exports.deleteFriend = async (req, res) => {
  const data = requestService.deleteFriend(req);
  res.json(data);
};
