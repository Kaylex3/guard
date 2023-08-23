const { prefixs } = require("../../Configs/botConfig");
const config = require("../../Configs/serverConfig");
const bot = global.client;

module.exports = async (oldnewMessage, newMessage) => {
  if (newMessage.author.bot || !newMessage.guild || !newMessage.content) return;
  
  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(newMessage.author.id)) return;
  // Dokunulmaz - Bitiş
  
  let newMessageSplit = newMessage.content.split("")
  let ads = config.reklamlar 

 if (ads.some(word => newMessage.content.toLowerCase().includes(word))) {
   newMessage.channel.send({ content: `> ⚠️ **Dur!** Düzenlediğin yeni mesajında reklam tespit ettim devam edersen ban yiyebilirsin! **Kullanıcı:** ${newMessage.author}` }).then(x => {
     newMessage.delete().catch(e => {})
      setTimeout(() => { 
       x.delete() .catch(e => {})
      }, 5000)
   }).catch(e => {})
  }

};
module.exports.conf = {
  name: "messageUpdate",
};