const {
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  Permissions,
  WebhookClient,
} = require("discord.js");
const config = require("../../Configs/serverConfig");
const emojiConfig = require("../../Configs/emojiConfig");
const roleModel = require("../../Models/roleData");
const channelModel = require("../../Models/channelsData");
const userModel = require("../../Models/userData");
var moment = require("moment");
const bot = global.client;

module.exports = async (oldChannel, newChannel) => {
  const guild = oldChannel.guild;
  const entry = await guild
    .fetchAuditLogs({ type: 11, limit: 1 })
    .then((x) => x.entries.first());

  if (!entry || entry.createdTimestamp <= Date.now() - 1500) return;

  const userData = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })

  // Veriler - Başlangıç
  let kanallimit = config.kanalLimit;
  let kullanıcılimit = userData ? userData.kanalLimit || 0 : 0;
  const log = new WebhookClient({ url: config.kanalWebURL });
  // Veriler - Bitiş

  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(entry.executor.id)) return;
  // Dokunulmaz - Bitiş

  // Kanal Oluşturma - Başlangıç
   oldChannel.edit({ 
     name: oldChannel.name, 
     type: oldChannel.type, 
     topic: oldChannel.topic, 
     nsfw: oldChannel.nsfw, 
     bitrate: oldChannel.bitrate, 
     userLimit: oldChannel.userLimit, 
     parent: oldChannel.parentId, 
     permissionOverwrites: oldChannel.permissionOverwrites.cache.map(x => x),
     rateLimitPerUser: oldChannel.rateLimitPerUser, 
     defaultAutoArchiveDuration: oldChannel.defaultAutoArchiveDuration, 
     rtcRegion: oldChannel.rtcRegion 
   });

     await userModel
     .findOneAndUpdate(
       { guildID: guild.id, userID: entry.executor.id },
       { $inc: { kanalLimit: 1 } },
       { upsert: true }
     )
  
  // Kanal Oluşturma - Bitiş

  // Uyarı - Başlangıç
   await userModel.findOne(
     {  guildID: guild.id, userID: entry.executor.id },
   async (err, numberData) => {

  let limit = numberData ? numberData.kanalLimit || 0 : 0
 
  try {
    let tür;
    if (oldChannel.type === "GUILD_TEXT") {
      tür = "Yazı Kanalı";
    }
    if (oldChannel.type === "GUILD_VOICE") {
      tür = "Ses Kanalı";
    }
    if (oldChannel.type === "GUILD_CATEGORY") {
      tür = "Kategori";
    }

    const embed = new MessageEmbed()
      .setTitle(emojiConfig.uyarı + " Uyarı!")
      .setColor("RED")
      .setFooter(entry.executor.tag, entry.executor.avatarURL({ dynamic: true }))
      .setDescription(`> ${entry.executor} -> Bir kanal düzenlendi ve gerekli işlemler uygulandı!!`)
      .addField("Yetkili ↷", "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```")
      .addField("Kanal ↷", "```" + `${oldChannel.name} | ${oldChannel.id}` + "```")
      .addField("Kanal Türü ↷", "```" + tür +  "```", true)
      .addField("İşlem Zamanı ↷", "```" + moment.utc(Date.now()).format("D") + ` ${bot.moons[moment.utc(Date.now()).format("MM")]} ` + moment.utc(Date.now() + 10800000).format("YYYY | HH:mm:ss")  + "```", true)    
      .addField("Yetkili Limiti ↷", "```" + limit +  "```", true);

    log.send({ username: `${entry.executor.username} | Kanal Düzenleme Koruması`, avatarURL: `${entry.executor.avatarURL() || bot.user.avatarURL()}`, embeds: [embed] });
  } catch (err) {}

  // Uyarı - Bitiş

  // limit - Başlangıç
  if (limit >= kanallimit) {
    try {
      log.send(`Yetkili Kanal Limitine Ulaştı, Bilgileri => \n\n\`Kullanıcı:\`  ${
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
       { $set: { kanalLimit: 0 } },
       { upsert: true }
     )
   }
 })
  // Limit - Bitiş
};
module.exports.conf = {
  name: "channelUpdate",
};
  