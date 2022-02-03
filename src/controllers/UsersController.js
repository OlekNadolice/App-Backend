const usersService = require("../services/usersService");

module.exports.findSingleUser = async (req, res) => {
  const data = await usersService.findSingleUser(req);
  res.json(data);
};

module.exports.getAllUsers = async (req, res) => {
  const data = await usersService.getAllUsers(req);
  res.json(data);
};
