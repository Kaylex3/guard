const { Schema, model } = require("mongoose");

const data = Schema({
  _id: String,
  guildID: String,
  allowBots: { type: Array, default: [] }
});

module.exports = model("data", data);
