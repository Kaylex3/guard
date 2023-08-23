const { Client, Collection } = require("discord.js");
const bot = (global.client = new Client({
  fetchAllMembers: true,
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: true,
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: 32767,
}));
const Guards = (global.Guards = [])
const { token, developersID, playing, tokens } = require("./Source/Configs/botConfig");
const config = require("./Source/Configs/serverConfig");

bot.default_Cmd = new Collection();
bot.aliases = new Collection();
require("./Source/Handlers/command-Handler");
require("./Source/Handlers/event-Handler");
require("./Source/Handlers/mongo-Handler");

bot
  .login(token)
  .then((x) => console.log(`[MAIN GUARD] Successfully ${bot.user.tag} activated.`))
  .catch((err) => console.log("[MAIN GUARD] Failed to login:\n" + err));

for (const token of tokens) {
  const Bot = new Client({ fetchAllMembers: true,  allowedMentions: { parse: ["roles", "users", "everyone"], repliedUser: true, }, partials: ["MESSAGE", "CHANNEL", "REACTION"], intents: 32767, });

 Bot.once("ready", () => {
    Guards.push(Bot);
    Bot.user.setPresence({ activities: [{ name: playing }], status: "idle" });
 });  

  Bot.login(token) 
  .then((x) => console.log(`[GUARD] Successfully ${Bot.user.tag} activated.`))
  .catch((err) => console.log("[GUARD] Failed to login:\n" + err));
};

bot.moons = {
    "01": "Ocak",
    "02": "Şubat",
    "03": "Mart",
    "04": "Nisan",
    "05": "Mayıs",
    "06": "Haziran",
    "07": "Temmuz",
    "08": "Ağustos",
    "09": "Eylül",
    "10": "Ekim",
    "11": "Kasım",
    "12": "Aralık",
}

bot.safeMembers = function safeMembers(type) {
  if (type === bot.user.id || config.safeMembers.includes(type) || config.safeRoles.some((x) => bot.guilds.cache.get(config.serverID).members.cache.get(type).roles.cache.has(x))) return true;
  return false;
}

bot.jail = async function jail(type) {

 await type.roles.cache.map(x => type.roles.remove(x.id).catch(e => {})) 
 await type.roles.add(config.jailRoleID).catch(e => {}) 

 return false;
}