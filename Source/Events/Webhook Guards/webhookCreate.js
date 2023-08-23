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
const userModel = require("../../Models/userData");
var moment = require("moment");
const bot = global.client;

module.exports = async (web) => {
  const guild = web.guild;
  const entry = await guild
    .fetchAuditLogs({ type: 50, limit: 1 })
    .then((x) => x.entries.first());
  if (!entry || entry.createdTimestamp <= Date.now() - 1500) return;

  const userData = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })

  // Veriler - Başlangıç
  let weblimit = config.webLimit;
  let kullanıcılimit = userData ? userData.webLimit || 0 : 0;
  const log = new WebhookClient({ url: config.webhookWebURL });
  // Veriler - Bitiş

  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(entry.executor.id)) return;
  // Dokunulmaz - Bitiş

  // web Oluşturma - Başlangıç
   web.fetchWebhooks().then((x) => x.filter(x => entry.target.id === x.id).map((e) => e.delete())).catch(() => { });

     await userModel
     .findOneAndUpdate(
       { guildID: guild.id, userID: entry.executor.id },
       { $inc: { webLimit: 1 } },
       { upsert: true }
     )
  
  // web Oluşturma - Bitiş

  // Uyarı - Başlangıç
   await userModel.findOne(
     {  guildID: guild.id, userID: entry.executor.id },
   async (err, numberData) => {

  let limit = numberData ? numberData.webLimit || 0 : 0
 
  try {
    const embed = new MessageEmbed()
      .setTitle(emojiConfig.uyarı + " Uyarı!")
      .setColor("RED")
      .setFooter(entry.executor.tag, entry.executor.avatarURL({ dynamic: true }))
      .setDescription(`> ${entry.executor} -> Bir webhook açıldı ve gerekli işlemler uygulandı!!`)
      .addField("Yetkili ↷", "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```")
      .addField("Webhook ↷", "```" + `${entry.target.name} | ${entry.target.id}` + "```")
      .addField("Webhook URL ↷", "```" + entry.target.url + "```")
      .addField("İşlem Zamanı ↷", "```" + moment.utc(Date.now()).format("D") + ` ${bot.moons[moment.utc(Date.now()).format("MM")]} ` + moment.utc(Date.now() + 10800000).format("YYYY | HH:mm:ss")  + "```", true)    
      .addField("Yetkili Limiti ↷", "```" + limit +  "```", true);

    log.send({ username: `${entry.executor.username} | web Oluşturma Koruması`, avatarURL: `${entry.executor.avatarURL() || bot.user.avatarURL()}`, embeds: [embed] });
  } catch (err) {}

  // Uyarı - Bitiş

  // limit - Başlangıç
  if (limit >= weblimit) {
    try {
      log.send(`Sunucundan bir yetkili web limitine ulaştı ve sunucudan atıldı ! İşte bilgileri => \n\n\`Kullanıcı:\`  ${
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
       { $set: { webLimit: 0 } },
       { upsert: true }
     )
   }
 })
  // Limit - Bitiş
};
module.exports.conf = {
  name: "webhookUpdate",
};
  