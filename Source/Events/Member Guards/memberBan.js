const {
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  Permissions,
  WebhookClient
} = require("discord.js");
const config = require("../../Configs/serverConfig");
const emojiConfig = require("../../Configs/emojiConfig");
const userModel = require("../../Models/userData");
var moment = require("moment");
const bot = global.client;

module.exports = async (member) => {

  let guild = member.guild
  let entry = await member.guild.fetchAuditLogs({ type: 22, limit: 1 }).then(logs => logs.entries.first());
  if (!entry || entry.createdTimestamp <= Date.now() - 1500) return;

  const userData = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })
  
  // Veriler - Başlangıç
  let banLimit = config.banLimit;
  let kullanıcılimit = userData ? userData.banLimit || 0 : 0;
  const log = new WebhookClient({ url: config.banWebURL });
  // Veriler - Bitiş

  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(entry.executor.id)) return;
  // Dokunulmaz - Bitiş

    await userModel
     .findOneAndUpdate(
       { guildID: guild.id, userID: entry.executor.id },
       { $inc: { banLimit: 1 } },
       { upsert: true }
     )
 
  await member.guild.bans.remove(member.user.id).catch(() => false);
  
   // Uyarı - Başlangıç
   await userModel.findOne(
     {  guildID: guild.id, userID: entry.executor.id },
   async (err, numberData) => {

  let limit = numberData ? numberData.banLimit || 0 : 0
 
  try {
    const embed = new MessageEmbed()
      .setTitle(emojiConfig.uyarı + " Uyarı!")
      .setColor("RED")
      .setFooter(entry.executor.tag, entry.executor.avatarURL({ dynamic: true }))
      .setDescription(`> ${entry.executor} -> Bir kullanıcıyı banladı ve gerekli işlemler uygulandı!!`)
      .addField("Yetkili ↷", "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```")
      .addField("Kullanıcı ↷", "```" + `${member.user.tag} | ${member.user.id}` + "```")    
      .addField("İşlem Zamanı ↷", "```" + moment.utc(Date.now()).format("D") + ` ${bot.moons[moment.utc(Date.now()).format("MM")]} ` + moment.utc(Date.now() + 10800000).format("YYYY | HH:mm:ss")  + "```", true)   
      .addField("Yetkili Limiti ↷", "```" + limit +  "```", true);

    log.send({ username: `${entry.executor.username} | Ban Koruması`, avatarURL: `${entry.executor.avatarURL() || bot.user.avatarURL()}`, embeds: [embed] });
  } catch (err) {}

  // Uyarı - Bitiş

  // limit - Başlangıç
  if (limit >= banLimit) {
    try {
      log.send(`Sunucundan bir yetkili rol limitine ulaştı ve sunucudan atıldı ! İşte bilgileri => \n\n\`Kullanıcı:\`  ${
          entry.executor
        } | ${entry.executor.id} \n• **Discord:** ${moment(
          entry.executor.createdAt
        ).format("DD/MM/YYYY | HH:mm:ss")} \n• **Sunucu:** ${moment(
          guild.members.cache.get(entry.executor.id).joinedAt
        ).format("DD/MM/YYYY | HH:mm:ss")}`
      );
    } catch (err) {}
    
    bot.jail(guild.members.cache.get(entry.executor.id))

    await userModel
     .findOneAndUpdate(
       { guildID: guild.id, userID: entry.executor.id },
       { $set: { banLimit: 0 } },
       { upsert: true }
     )
   }
 })
  // Limit - Bitiş  
  
};
module.exports.conf = {
  name: "guildBanAdd",
};