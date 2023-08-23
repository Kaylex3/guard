const roleMemberModel = require("../../Models/roleMemberData");

module.exports = async (oldMember, newMember) => {
  
  const guild = oldMember.guild;
  const entry = await guild
    .fetchAuditLogs({ type: 32, limit: 1 })
    .then((x) => x.entries.first());
  if (entry.createdTimestamp >= Date.now() - 10000) return;
   
 setTimeout(() => {
  let oldRoles = oldMember.roles.cache;
  let newRoles = newMember.roles.cache;

  oldRoles
    .filter((x) => !newMember.roles.cache.get(x.id))
    .map(async (x) => {
      await roleMemberModel.findOneAndUpdate(
        { guildID: x.guild.id, roleID: x.id },
        { $pull: { roleMembers: oldMember.user.id } },
        { upsert: true }
      );
    });

  newRoles
    .filter((x) => !oldMember.roles.cache.get(x.id))
    .map(async (x) => {
      await roleMemberModel.findOneAndUpdate(
        { guildID: x.guild.id, roleID: x.id },
        { $push: { roleMembers: oldMember.user.id } },
        { upsert: true }
      );
    });
 },  5000)
};
module.exports.conf = {
  name: "guildMemberUpdate",
};
