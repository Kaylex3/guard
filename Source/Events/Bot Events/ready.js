const { playing } = require("../../Configs/botConfig");
const config = require("../../Configs/serverConfig");
const roleModel = require("../../Models/roleData");
const roleMemberModel = require("../../Models/roleMemberData");
const bot = global.client;

module.exports = async () => {
  bot.user.setPresence({
    activities: [{ name: playing }],
    status: "Online",
  });

  bot.emit("serverBackup");

  setInterval(async () => {
    bot.emit("serverBackup");
  }, 1800000);
};
module.exports.conf = {
  name: "ready",
};
