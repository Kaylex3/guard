const { Schema, model } = require("mongoose");

const data = Schema({
  _id: String,
  guildID: String,
  userID: String,
  kanalLimit: { type: Number, default: 0 },
  rolLimit: { type: Number, default: 0 },
  banLimit: { type: Number, default: 0 },
  kickLimit: { type: Number, default: 0 },
  serverLimit: { type: Number, default: 0 },
  emojiLimit: { type: Number, default: 0 },
  botLimit: { type: Number, default: 0 },
  webLimit: { type: Number, default: 0 },
});

module.exports = model("userData", data);
