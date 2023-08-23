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

module.exports = async (channel) => {
  const guild = channel.guild;
  const entry = await guild
    .fetchAuditLogs({ type: 12, limit: 1 })
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
  channel
    .clone({
      name: channel.name,
      permissions: channel.withPermissions,
      topic: channel.topic,
      bitrate: this.bitrate,
    })
  .then(async (newChannel) => {
      if (newChannel.type === "GUILD_TEXT") {
        newChannel.send("Bu Kanal Silindi Kanal Koruma Sebebiyle Tekrar Açıldı!");
      }
     
    if (newChannel.type === "GUILD_CATEGORY") {
    let channelsData = await channelModel.findOne({ guildID: guild.id, channelID: channel.id })

    var check = await (channelsData && channelsData.categoryParents.map(x => x));
    if(!channelsData || !check.join(" ")) return;
  
    channelsData && channelsData.categoryParents.map(async (x) => {
 
     let kanal = await guild.channels.cache.get(x)
       kanal ? await kanal.setParent(newChannel.id) : "";
           
    })

    }
    
    setTimeout(() => bot.emit("serverBackup"), 1000)
      
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
    if (channel.type === "GUILD_TEXT") {
      tür = "Yazı Kanalı";
    }
    if (channel.type === "GUILD_VOICE") {
      tür = "Ses Kanalı";
    }
    if (channel.type === "GUILD_CATEGORY") {
      tür = "Kategori";
    }

    const embed = new MessageEmbed()
      .setTitle(emojiConfig.uyarı + " Uyarı!")
      .setColor("RED")
      .setFooter(entry.executor.tag, entry.executor.avatarURL({ dynamic: true }))
      .setDescription(`> ${entry.executor} -> Bir kanal sildi ve gerekli işlemler uygulandı!!`)
      .addField("Yetkili ↷", "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```")
      .addField("Kanal ↷", "```" + `${channel.name} | ${channel.id}` + "```")
      .addField("Kanal Türü ↷", "```" + tür +  "```", true)
      .addField("İşlem Zamanı ↷", "```" + moment.utc(Date.now()).format("D") + ` ${bot.moons[moment.utc(Date.now()).format("MM")]} ` + moment.utc(Date.now() + 10800000).format("YYYY | HH:mm:ss")  + "```", true)    
      .addField("Yetkili Limiti ↷", "```" + limit +  "```", true);

    log.send({ username: `${entry.executor.username} | Kanal Silme Koruması`, avatarURL: `${entry.executor.avatarURL() || bot.user.avatarURL()}`, embeds: [embed] });
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
  name: "channelDelete",
};
  