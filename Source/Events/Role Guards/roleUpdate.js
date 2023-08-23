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
const roleMemberModel = require("../../Models/roleMemberData");
const roleModel = require("../../Models/roleData");
const userModel = require("../../Models/userData");
var moment = require("moment");
const bot = global.client;

module.exports = async (oldRole, newRole) => {
  const guild = newRole.guild;

  const entry = await guild
    .fetchAuditLogs({ type: 31, limit: 1 })
    .then((x) => x.entries.first());
  if (!entry || entry.createdTimestamp <= Date.now() - 1500) return;

  const userData = await userModel.findOne({
    guildID: guild.id,
    userID: entry.executor.id,
  });

  // Veriler - Başlangıç
  let rolLimit = config.rolLimit;
  let kullanıcılimit = userData ? userData.rolLimit || 0 : 0;
  const log = new WebhookClient({ url: config.rolWebURL });
  // Veriler - Bitiş

  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(entry.executor.id)) return;
  // Dokunulmaz - Bitiş

  // Rol Oluşturma - Başlangıç

  await newRole.edit({
    name: oldRole.name,
    color: oldRole.color,
    hoist: oldRole.hoist,
    permissions: oldRole.permissions,
    mentionable: oldRole.mentionable,
    icon: oldRole.icon,
    unicodeEmoji: oldRole.unicodeEmoji,
  });

  await userModel.findOneAndUpdate(
    { guildID: guild.id, userID: entry.executor.id },
    { $inc: { rolLimit: 1 } },
    { upsert: true }
  );

  // rol Oluşturma - Bitiş

  // Uyarı - Başlangıç
  await userModel.findOne(
    { guildID: guild.id, userID: entry.executor.id },
    async (err, numberData) => {
      let limit = numberData ? numberData.rolLimit || 0 : 0;

      try {
        const embed = new MessageEmbed()
          .setTitle(emojiConfig.uyarı + " Uyarı!")
          .setColor("RED")
          .setFooter(entry.executor.tag, entry.executor.avatarURL({ dynamic: true }))
          .setDescription(`> ${entry.executor} -> Bir rol düzenledi ve gerekli işlemler uygulandı!!`)
          .addField("Yetkili ↷", "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```")
          .addField("Rol ↷", "```" + `${oldRole.name} | ${oldRole.id}` + "```")
          .addField("İşlem Zamanı ↷", "```" + moment.utc(Date.now()).format("D") + ` ${bot.moons[moment.utc(Date.now()).format("MM")]} ` + moment.utc(Date.now() + 10800000).format("YYYY | HH:mm:ss") + "```", true)
          .addField("Yetkili Limiti ↷", "```" + limit + "```", true);

        log.send({ username: `${entry.executor.username} | Rol Düzenleme Koruması`, avatarURL: `${entry.executor.avatarURL() || bot.user.avatarURL()}`, embeds: [embed] });
      } catch (err) {}

      // Uyarı - Bitiş

      // limit - Başlangıç
      if (limit >= rolLimit) {
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

        await userModel.findOneAndUpdate(
          { guildID: guild.id, userID: entry.executor.id },
          { $set: { rolLimit: 0 } },
          { upsert: true }
        );
      }
    }
  );
  // Limit - Bitiş
};
module.exports.conf = {
  name: "roleUpdate",
};
