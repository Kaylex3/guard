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
const moment = require("moment");
const chillout = require("chillout");
const Guards = global.Guards;
const bot = global.client;

module.exports = async (role) => {
  const leax = (A, B) => { return Math.floor((A * 100) / B) };
  const guild = role.guild;
  const entry = await guild
    .fetchAuditLogs({ type: 32, limit: 1 })
    .then((x) => x.entries.first());
  if (!entry || entry.createdTimestamp <= Date.now() - 1500) return;
  
  const userData = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })
  const membersData = await roleMemberModel.findOne({ guildID: guild.id, roleID: role.id })
  let sayı = membersData ? membersData.roleMembers.length || 0 : 0
  
  // Veriler - Başlangıç
  let rolLimit = config.rolLimit;
  let kullanıcılimit = userData ? userData.rolLimit || 0 : 0;
  const log = new WebhookClient({ url: config.rolWebURL });
  // Veriler - Bitiş

  // Dokunulmaz - Başlangıç
  if (bot.safeMembers(entry.executor.id)) return;
  // Dokunulmaz - Bitiş

  // Rol Oluşturma - Başlangıç

  await role.guild.roles.create({
      name: role.name,
      color: role.color,
      permissions: role.permissions,
      position: role.rawPosition,
      hoist: role.hoist,
      mentionable: role.mentionable,
      icon: role.icon,
      unicodeEmoji: role.unicodeEmoji
   }).then(async (newRole) => {
  await roleModel.updateMany({ "Permissions.id": role.id }, { $set: { "Permissions.$.id": newRole.id } })
  const updatedChannels = await roleModel.find({ "Permissions.id": newRole.id })

  if(updatedChannels.length > 0) {
  const channelsCount = Math.ceil(updatedChannels.length / Guards.length);

   await chillout.repeat(Guards.length, async i => {
     let line = i + 1
     const channels = updatedChannels.slice(i * channelsCount, line * channelsCount);
     if (channels.length <= 0) return;
     
     const guild = Guards[i].guilds.cache.get(config.serverID);
     await channels.forEach(async (x) => {
        let channel = guild.channels.cache.get(x.Id)
         channel.edit({ permissionOverwrites: x.Permissions }).catch(() => { });
     })
   })
 }

    const arrayMembers = membersData ? membersData.roleMembers || [] : [] 
    if(arrayMembers.length > 0) {
    const membersCount = Math.ceil(arrayMembers.length / Guards.length);

    await chillout.repeat(Guards.length, async i => {
      let line = i + 1
      const members = arrayMembers.slice(i * membersCount, line * membersCount);
      if (members.length <= 0) return;
      
      const guild = Guards[i].guilds.cache.get(config.serverID);
      await members.forEach(async (x) => {
        const member = await guild.members.cache.get(x);
        await member.roles.add(newRole.id).catch(() => { });
      });
    });
  }

   membersData ? await roleMemberModel.findOneAndUpdate({ guildID: guild.id, roleID: role.id,}, { $set: { roleID: newRole.id } }, { upsert: true }) : ""
 })
   
     await userModel
     .findOneAndUpdate(
       { guildID: guild.id, userID: entry.executor.id },
       { $inc: { rolLimit: 1 } },
       { upsert: true }
     )
  
  // rol Oluşturma - Bitiş

  // Uyarı - Başlangıç
   await userModel.findOne(
     {  guildID: guild.id, userID: entry.executor.id },
   async (err, numberData) => {

  let limit = numberData ? numberData.rolLimit || 0 : 0
 
       try {
         const embed = new MessageEmbed()
           .setTitle(emojiConfig.uyarı + " Uyarı!")
           .setColor("RED")
           .setFooter(entry.executor.tag, entry.executor.avatarURL({ dynamic: true }))
           .setDescription(`> ${entry.executor} -> Bir rol sildi ve gerekli işlemler uygulandı!!`)
           .addField("Yetkili ↷", "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```")
           .addField("Rol ↷", "```" + `${role.name} | ${role.id}` + "```")
           .addField("Role Sahip Üyeler ↷", "```" + sayı + " kişi.```", true)
           .addField("İşlem Zamanı ↷", "```" + moment.utc(Date.now()).format("D") + ` ${bot.moons[moment.utc(Date.now()).format("MM")]} ` + moment.utc(Date.now() + 10800000).format("YYYY | HH:mm:ss") + "```", true)
           .addField("Yetkili Limiti ↷", "```" + limit + "```", true);

         log.send({ username: `${entry.executor.username} | Rol Silme Koruması`, avatarURL: `${entry.executor.avatarURL() || bot.user.avatarURL()}`, embeds: [embed] });
       } catch (err) {}

       // Uyarı - Bitiş

       // limit - Başlangıç
       if (limit >= rolLimit) {
         try {
           log.send(
             `Sunucundan bir yetkili rol limitine ulaştı ve sunucudan atıldı ! İşte bilgileri => \n\n\`Kullanıcı:\`  ${
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
   )
  // Limit - Bitiş
};  
module.exports.conf = {
  name: "roleDelete",
};
  