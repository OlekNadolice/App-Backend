const messengerService = require("../services/messengerService");

module.exports.getFriends = async (req, res) => {
  const data = await messengerService.getFriends(req);
  res.json(data);
};
