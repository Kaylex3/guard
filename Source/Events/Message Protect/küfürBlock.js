const { prefixs } = require("../../Configs/botConfig");
const config = require("../../Configs/serverConfig");
const bot = global.client;

module.exports = async (message) => {
  if (message.author.bot || !message.guild || !message.content) return;
  
  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(message.author.id)) return;
  // Dokunulmaz - Bitiş
  
  let messageSplit = message.content.toLowerCase().split(" ")
  let ads = config.küfürler 
  let shortAds = config.kısaltmaKüfürler 

 if (ads.some(word => message.content.toLowerCase().includes(word))) {
   message.channel.send({ content: `> ⚠️ **Arrêt!** Malédictions détectées dans votre message ! Merci de faire attention à vos propos ! **Utilisateur:** ${message.author}` }).then(x => {
     message.delete().catch(e => {})
      setTimeout(() => { 
       x.delete() .catch(e => {})
      }, 5000)
   }).catch(e => {})
  }

 if (shortAds.some(word => messageSplit.includes(word))) {
   message.channel.send({ content: `> ⚠️ **Arrêt!** Malédictions détectées dans votre message ! Merci de faire attention à vos propos ! **Utilisateur:** ${message.author}` }).then(x => {
     message.delete().catch(e => {})
      setTimeout(() => { 
       x.delete() .catch(e => {})
      }, 5000)
   }).catch(e => {})
  }



  if (ads.some(word => message.content.toLowerCase().includes(word))) {
    message.channel.send({ content: `> ⚠️ **Dur!** Mesajınızda küfür tespit edildi! Lütfen ne söylediğinize dikkat edin! **Kullanıcı:** ${message.author}` }).then(x => {
      message.delete().catch(e => {})
       setTimeout(() => { 
        x.delete() .catch(e => {})
       }, 5000)
    }).catch(e => {})
   }
 
  if (shortAds.some(word => messageSplit.includes(word))) {
    message.channel.send({ content: `> ⚠️ **Dur!** Mesajınızda küfür tespit edildi! Lütfen ne söylediğinize dikkat edin! **Kullanıcı:** ${message.author}` }).then(x => {
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
