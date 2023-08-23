const { prefixs } = require("../../Configs/botConfig");
const config = require("../../Configs/serverConfig");
const bot = global.client;

module.exports = async (message) => {
  if (message.author.bot || !message.guild || !message.content) return;
  
  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(message.author.id)) return;
  // Dokunulmaz - Bitiş
  
  let messageSplit = message.content.split("")
  let ads = config.reklamlar 

 if (ads.some(word => message.content.toLowerCase().includes(word))) {
   message.channel.send({ content: `> ⚠️ **Dur!** Mesajında reklam tespit ettim devam edersen ban yiyebilirsin! **Kullanıcı:** ${message.author}` }).then(x => {
     message.delete().catch(e => {})
      setTimeout(() => { 
       x.delete() .catch(e => {})
      }, 5000)
   }).catch(e => {})
  }


  if (ads.some(word => message.content.toLowerCase().includes(word))) {
    message.channel.send({ content: `> ⚠️ J'ai détecté une publicité dans votre message **Stop !**, si vous continuez, vous pouvez être banni ! **Utilisateur:** ${message.author}` }).then(x => {
      message.delete().catch(e => {})
       setTimeout(() => { 
        x.delete() .catch(e => {})
       }, 5000)
    }).catch(e => {})
   }



};
module.exports.conf = {
  name: "messageCreate",
};
