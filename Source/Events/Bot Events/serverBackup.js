const { playing } = require("../../Configs/botConfig");
const config = require("../../Configs/serverConfig");
const roleModel = require("../../Models/roleData");
const roleMemberModel = require("../../Models/roleMemberData");
const channelModel = require("../../Models/channelsData");
const bot = global.client;

module.exports = async () => {
  let server = bot.guilds.cache.get(config.serverID);

  await roleModel.deleteMany({});
  await roleModel.deleteMany({});
  await channelModel.deleteMany({});
  await roleMemberModel.deleteMany({});
  
 server.channels.cache.filter((x) => !x.isThread()).map(async (x) => {
     new roleModel({
      Id: x.id,
      Permissions: x.permissionOverwrites.cache.map((permission) => {
        return {
          id: permission.id,
          type: permission.type,
          allow: permission.allow.toArray(),
          deny: permission.deny.toArray()
        }
      }),
    }).save();
    
   if(x.parentId) {  
       await channelModel.findOneAndUpdate(
         { guildID: server.id, channelID: x.parentId },
         {
           $push: { categoryParents: x.id }
         },
         { upsert: true }
       );
   } 
  });
      
  server.roles.cache
    .filter((x) => x.name !== "@everyone")
    .map(async (a) => {
      a.members.map(async (x) => {
        await roleMemberModel.findOneAndUpdate(
          { guildID: server.id, roleID: a.id },
          { $push: { roleMembers: x.id } },
          { upsert: true }
        );
      });
    });
};
module.exports.conf = {
  name: "serverBackup",
};
