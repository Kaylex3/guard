const { prefixs } = require("../../Configs/botConfig");
const config = require("../../Configs/serverConfig");
const bot = global.client;

module.exports = async (message) => {
  if (message.author.bot || !message.guild || !message.content || message.content.length <= 5) return;
  
  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(message.author.id)) return;
  // Dokunulmaz - Bitiş
  
    const leax = (A, B) => { return Math.floor((A * 100) / B) };

  let messageSplit = message.content.replace(/ /g, "").split("")
  let argüman = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "?", "!", "*", ";", ":", "(", ")", "[", "]", "{", "}", "-", "_", ":", "#", "@", "/", "&", "+", "*"]
  let total = 0 

  messageSplit.map(x => { 
    if(messageSplit.filter(data => !argüman.includes(data)).filter(data => data.toUpperCase() === x).join("")) { total++ } 
  })

  if(leax(total, message.content.length) >= config.capsLockSınır) {
   message.channel.send({ content: `> ⚠️ **Dur!** Mesajında çok fazla büyük harf kullanıyorsun! **Kullanıcı:** ${message.author}` }).then(x => {
     message.delete().catch(e => {})
      setTimeout(() => { 
       x.delete() .catch(e => {})
      }, 5000)
   }).catch(e => {})
  }



  if(leax(total, message.content.length) >= config.capsLockSınır) {
    message.channel.send({ content: `> ⚠️ **Stop !** Vous utilisez trop de majuscules dans votre message ! **Utilisateur:** ${message.author}` }).then(x => {
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
