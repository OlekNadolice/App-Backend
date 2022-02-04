const mongoose = require("mongoose");
const db = process.env.DATABASE_LINK;

mongoose.connect(db, error => {
  if (error) {
    console.log(error);
  } else {
    console.log("Connection completed");
  }
});

module.exports.db;
