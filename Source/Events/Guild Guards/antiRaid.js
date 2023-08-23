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
const guildModel = require("../../Models/guildData");
var moment = require("moment");
const bot = global.client;

module.exports = async (member) => {
  if (!member.user.bot) return;

  let guild = member.guild;
  let entry = await member.guild
    .fetchAuditLogs({ type: 28, limit: 1 })
    .then((logs) => logs.entries.first());
  if (!entry || entry.createdTimestamp <= Date.now() - 1500) return;

  const userData = await userModel.findOne({
    guildID: guild.id,
    userID: entry.executor.id,
  });
  const guildData = await guildModel.findOne({ guildID: guild.id });

  let allowBots = guildData
    ? guildData.allowBots.map((x) => x.botID) || []
    : [];
  if (![allowBots].join("") || allowBots.includes(member.user.id)) return;

  // Veriler - Başlangıç
  let botLimit = config.botLimit;
  let kullanıcılimit = userData ? userData.botLimit || 0 : 0;
  const log = new WebhookClient({ url: config.botWebURL });
  // Veriler - Bitiş

  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(entry.executor.id)) return;
  // Dokunulmaz - Bitiş

  member.kick().catch(() => {});

  await userModel.findOneAndUpdate(
    { guildID: guild.id, userID: entry.executor.id },
    { $inc: { botLimit: 1 } },
    { upsert: true }
  );

  // Uyarı - Başlangıç
  await userModel.findOne(
    { guildID: guild.id, userID: entry.executor.id },
    async (err, numberData) => {
      let limit = numberData ? numberData.botLimit || 0 : 0;

      try {
        const embed = new MessageEmbed()
          .setTitle(emojiConfig.uyarı + " Uyarı!")
          .setColor("RED")
          .setFooter(
            entry.executor.tag,
            entry.executor.avatarURL({ dynamic: true })
          )
          .setDescription(
            `> ${entry.executor} -> Bir kullanıcıyı sunucuya bot ekledi ve gerekli işlemler uygulandı!!`
          )
          .addField(
            "Yetkili ↷",
            "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```"
          )
          .addField(
            "Bot ↷",
            "```" + `${member.user.tag} | ${member.user.id}` + "```"
          )
          .addField(
            "İşlem Zamanı ↷",
            "```" +
              moment.utc(Date.now()).format("D") +
              ` ${bot.moons[moment.utc(Date.now()).format("MM")]} ` +
              moment.utc(Date.now() + 10800000).format("YYYY | HH:mm:ss") +
              "```",
            true
          )
          .addField("Yetkili Limiti ↷", "```" + limit + "```", true);

        log.send({
          username: `${entry.executor.username} | Bot Koruması`,
          avatarURL: `${entry.executor.avatarURL() || bot.user.avatarURL()}`,
          embeds: [embed],
        });
      } catch (err) {}

      // Uyarı - Bitiş

      // limit - Başlangıç
      if (limit >= botLimit) {
        try {
          log.send(
            `Bir Yetkili AntiRaid Limitine Ulaştı, Bilgileri => \n\n\`Kullanıcı:\`  ${
              entry.executor
            } | ${entry.executor.id} \n• **Discord:** ${moment(
              entry.executor.createdAt
            ).format("DD/MM/YYYY | HH:mm:ss")} \n• **Sunucu:** ${moment(
              guild.members.cache.get(entry.executor.id).joinedAt
            ).format("DD/MM/YYYY | HH:mm:ss")}`
          );
        } catch (err) {}

        bot.jail(guild.members.cache.get(entry.executor.id));

        await userModel.findOneAndUpdate(
          { guildID: guild.id, userID: entry.executor.id },
          { $set: { botLimit: 0 } },
          { upsert: true }
        );
      }
    }
  );
  // Limit - Bitiş
};
module.exports.conf = {
  name: "guildMemberAdd",
};
