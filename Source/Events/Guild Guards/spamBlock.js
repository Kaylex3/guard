const { prefixs } = require("../../Configs/botConfig");
const config = require("../../Configs/serverConfig");
let cooldownBot = new Map()
const bot = global.client;

module.exports = async (message) => {
  if (message.author.bot || !message.guild) return;

  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(message.author.id)) return;
  // Dokunulmaz - Bitiş
  
 let messages = await message.channel.messages.cache
 let raidStart = await messages.filter(x => x.author.id === message.author.id).filter(x => x.createdTimestamp >= (Date.now() - config.spamTime))

 if(raidStart.size > config.spamMessageSize) {
  messages.filter(x => x.author.id === message.author.id).sort((a, b) => b.createdTimestamp - a.createdTimestamp).map(x => x.delete().catch(e => { })).slice(0, 10)

 if(!cooldownBot.get(message.author.id)) {
   message.channel.send({ content: `> ⚠️ **Dur!** Spam yaptığını tespit ettim devam edersen mute atıcağım. **Kullanıcı:** ${message.author}` }).then(x => {
    cooldownBot.set(message.author.id, true)
     setTimeout(() => { 
      x.delete() 
      cooldownBot.delete(message.author.id)
     }, 5000)
  })
 } 
}

};
module.exports.conf = {
  name: "messageCreate",
};
