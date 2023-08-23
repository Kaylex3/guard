const { Schema, model } = require("mongoose");

const data = Schema({
  guildID: String,
  roleID: String,
  roleMembers: { type: Array, default: [] },
});

module.exports = model("roleMemberData", data);
