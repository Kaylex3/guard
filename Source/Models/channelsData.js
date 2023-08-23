const { Schema, model } = require("mongoose");

const data = Schema({
  guildID: String,
  channelID: String,
  categoryParents: { type: Array, default: [] },
});

module.exports = model("channelData", data);
