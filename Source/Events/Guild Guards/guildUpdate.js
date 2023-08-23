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
var axios = require("axios");
const bot = global.client;
moment.locale("tr")

module.exports = async (oldGuild, newGuild) => {
  let entry = await oldGuild.fetchAuditLogs({ type: 1, limit: 1 }).then(logs => logs.entries.first());
  if (!entry || entry.createdTimestamp <= Date.now() - 1500) return;

  const userData = await userModel.findOne({ guildID: oldGuild.id, userID: entry.executor.id })
  
  // Veriler - Başlangıç
  let serverLimit = config.serverLimit;
  let kullanıcılimit = userData ? userData.serverLimit || 0 : 0;
  const log = new WebhookClient({ url: config.serverWebURL });
  // Veriler - Bitiş

  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(entry.executor.id)) return;
  // Dokunulmaz - Bitiş
  
    if(oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
      await axios({ method: "patch", url: `https://discord.com/api/v9/guilds/${oldGuild.id}/vanity-url`, data: { code: config.vaintyURL }, headers: { authorization: `Bot ${bot.token}` } });
    }
  
    await oldGuild.edit({ 
      name: oldGuild.name,
      verificationLevel: oldGuild.verificationLevel,
      explicitContentFilter: oldGuild.explicitContentFilter,
      afkChannel: oldGuild.afkChannel,
      systemChannel: oldGuild.systemChannel,
      afkTimeout: oldGuild.afkTimeout,
      splash: oldGuild.splash,
      discoverySplash: oldGuild.discoverySplash,
      banner: oldGuild.banner,
      systemChannelFlags: oldGuild.systemChannelFlags, 
      rulesChannel: oldGuild.rulesChannel, 
      publicUpdatesChannel: oldGuild.publicUpdatesChannel,
      preferredLocale: oldGuild.preferredLocale,
      description: oldGuild.description,
      features: oldGuild.features
    }).then(x => {
     oldGuild.setIcon(oldGuild.iconURL({ dynamic: true }))   
    });

    await userModel
     .findOneAndUpdate(
       { guildID: oldGuild.id, userID: entry.executor.id },
       { $inc: { serverLimit: 1 } },
       { upsert: true }
     )
    
   // Uyarı - Başlangıç
   await userModel.findOne(
     {  guildID: oldGuild.id, userID: entry.executor.id },
   async (err, numberData) => {

  let limit = numberData ? numberData.serverLimit || 0 : 0
  
  try {
    const embed = new MessageEmbed()
      .setTitle(emojiConfig.uyarı + " Uyarı!")
      .setColor("RED")
      .setFooter(entry.executor.tag, entry.executor.avatarURL({ dynamic: true }))
      .setDescription(`> ${entry.executor} -> Bir kullanıcıyı sunucu üzerinde değişiklik yaptı ve gerekli işlemler uygulandı!!`)
      .addField("Yetkili ↷", "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```")
      .addField("İşlem Zamanı ↷", "```" + moment.utc(Date.now()).format("D") + ` ${bot.moons[moment.utc(Date.now()).format("MM")]} ` + moment.utc(Date.now() + 10800000).format("YYYY | HH:mm:ss")  + "```", true)    
      .addField("Yetkili Limiti ↷", "```" + limit +  "```", true);

    log.send({ username: `${entry.executor.username} | Sunucu Düzenleme`, avatarURL: `${entry.executor.avatarURL() || bot.user.avatarURL()}`, embeds: [embed] });
  } catch (err) {}

  // Uyarı - Bitiş

  // limit - Başlangıç
  if (limit >= serverLimit) {
    try {
      log.send(`Sunucundan bir yetkili rol limitine ulaştı ve sunucudan atıldı ! İşte bilgileri => \n\n\`Kullanıcı:\`  ${
          entry.executor
        } | ${entry.executor.id} \n• **Discord:** ${moment(
          entry.executor.createdAt
        ).format("DD/MM/YYYY | HH:mm:ss")} \n• **Sunucu:** ${moment(
          oldGuild.members.cache.get(entry.executor.id).joinedAt
        ).format("DD/MM/YYYY | HH:mm:ss")}`
      );
    } catch (err) {}
    
    bot.jail(oldGuild.members.cache.get(entry.executor.id))

    await userModel
     .findOneAndUpdate(
       { guildID: oldGuild.id, userID: entry.executor.id },
       { $set: { serverLimit: 0 } },
       { upsert: true }
     )
   }
 })
  // Limit - Bitiş  
  
};
module.exports.conf = {
  name: "guildUpdate",
};