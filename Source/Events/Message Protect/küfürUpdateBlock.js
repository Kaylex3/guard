const { prefixs } = require("../../Configs/botConfig");
const config = require("../../Configs/serverConfig");
const bot = global.client;

module.exports = async (oldMessage, newMessage) => {
  if (newMessage.author.bot || !newMessage.guild || !newMessage.content) return;
  
  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(newMessage.author.id)) return;
  // Dokunulmaz - Bitiş
  
  let messageSplit = newMessage.content.toLowerCase().split(" ")
  let ads = config.küfürler 
  let shortAds = config.kısaltmaKüfürler 

 if (ads.some(word => newMessage.content.toLowerCase().includes(word))) {
   newMessage.channel.send({ content: `> ⚠️ **Dur!** Düzenlediğin yeni mesajında küfür tespit ettim! Lütfen sözlerine dikkat et! **Kullanıcı:** ${newMessage.author}` }).then(x => {
     newMessage.delete().catch(e => {})
      setTimeout(() => { 
       x.delete() .catch(e => {})
      }, 5000)
   }).catch(e => {})
  }

 if (shortAds.some(word => messageSplit.includes(word))) {
   newMessage.channel.send({ content: `> ⚠️ **Dur!** Düzenlediğin yeni mesajında küfür tespit ettim! Lütfen sözlerine dikkat et! **Kullanıcı:** ${newMessage.author}` }).then(x => {
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
