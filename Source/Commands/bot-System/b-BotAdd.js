const {
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  Permissions,
} = require("discord.js");
const guildModel = require("../../Models/guildData");
const emojiConfig = require("../../Configs/emojiConfig");
const { developersID, prefixs } = require("../../Configs/botConfig");

module.exports.run = async (bot, message, args) => {
  if (!developersID.includes(message.author.id)) return;

  let prefix = prefixs[0];

  let guildData = await guildModel.findOne({ guildID: message.guild.id });
  let data = guildData ? guildData.allowBots.map((x) => x) || [] : [];
  let botID = args[1];
  let argüman = args[0] ? args[0].toLowerCase() : args[0];

  if (
    argüman === "sil" ||
    argüman === "kaldır" ||
    argüman === "remove" ||
    argüman === "reset"
  ) {
    if (data.join("")) {
      if (!botID)
        return message.channel.send(
          "> ❌ **Başarasız!** Lütfen bir bot ID'si belirtin."
        );
      if (!data.map((cs) => cs.botID).includes(botID))
        return message.channel.send(
          `> ❌ **Başarısız!** Belirttiğiniz bot ID'si sistemde yok!`
        );

      await guildModel.findOneAndUpdate(
        { guildID: message.guild.id },
        {
          $pull: {
            allowBots: { botID: botID },
          },
        },
        { upsert: true }
      );

      return message.channel.send(
        `> ✅ **Başarılı!** Bot ID'si başarıylı sistemden silindi! **Bot ID:** \`${botID}\``
      );
    } else {
      return message.channel.send(
        `> ❌ **Başarısız!** Sistemde ekli bot bulunmuyor.`
      );
    }
  }

  if (argüman === "ekle" || argüman === "add" || argüman === "set") {
    if (!botID)
      return message.channel.send(
        `> ❌ **Başarısız!** Lütfen eklemek istediğiniz bot'un ID'sini belirtin.`
      );

    if (data.join("")) {
      if (data.map((cs) => cs.botID).includes(botID)) {
        return message.channel.send(
          `> ❌ **Başarısız!** Belirttiğiniz bot zaten sistemde bulunuyor.`
        );
      }
    }

    await guildModel.findOneAndUpdate(
      { guildID: message.guild.id },
      {
        $push: {
          allowBots: { botID: botID, mod: message.author.id },
        },
      },
      { upsert: true }
    );

    return message.channel.send(
      `> ✅ **Başarılı!** Bot sisteme eklendi AntiRaid'den etkilenmiyecek. **Bot:** \`${botID}\`.`
    );
  }

  if (argüman === "top" || argüman === "liste" || argüman === "listele") {
    if (data.join("")) {
      let sayı = 1;
      let ranks = [];

      data.map((x) => {
        ranks.push(`\`${sayı++}-\` Bot: <@!${x.botID}> Admin: <@!${x.mod}>`);
      });

      message.channel.send(`Kanal Listesi\n\n${ranks.join("\n")}`);

      return;
    } else {
      message.channel.send(
        `> ❌ **Başarısız!** Sistemde gösterilecek bot bulunmuyor.`
      );

      return;
    }
  }

  if (argüman !== "sil" || argüman !== "ekle") {
    return message.channel.send(
      `> Lütfen ne yapmak istediğnizi belirtin. Örnekler;\n\nBot Ekle/Kaldır ↷\n\`\`\`${prefix}bot ekle <bot ID>\n${prefix}bot kaldır <bot ID>\`\`\`\nBot Liste ↷\n\`\`\`${prefix}bot liste\`\`\``
    );
  }
};
module.exports.conf = {
  name: "bot",
  aliases: [],
};
