const { Schema, model } = require("mongoose");

const data = Schema({
  guildID: String,
  Id: String,
  Permissions: { type: Array, default: [] },
});

module.exports = model("roleData", data);
