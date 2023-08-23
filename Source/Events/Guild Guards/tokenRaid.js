const { prefixs } = require("../../Configs/botConfig");
const config = require("../../Configs/serverConfig");
const { WebhookClient, MessageEmbed } = require("discord.js");
var moment = require("moment");
const bot = global.client;
moment.locale("tr")

module.exports = async (member) => {
 
  let üye = [];
  const log = new WebhookClient({ url: config.tokenWebURL });

  if(member.guild.members.cache.filter(m => (new Date().getTime() - m.joinedTimestamp) < config.tokenTime).size >= config.tokenSize) {

      member.guild.members.cache
      .filter(m => (Date.now() - m.joinedTimestamp) < config.tokenTime)
      .map(m => { 
  
      üye.push(m.user.tag +" ("+ m.user.id + ")")
      m.roles.set(config.tokenRaidRol).catch(err => {})

      })

                let embed = new MessageEmbed()
                    .setTitle("⚠️ Token Saldırısı!")
                    .setDescription("Sunucuya token saldırısı yapıldığı tespit edildi. Koruma amaçlı hepsi mutelendi.")
                    .addField("Tespit Zamanı ↷", "```" + moment.utc(Date.now()).format("D") + ` ${bot.moons[moment.utc(Date.now()).format("MM")]} ` + moment.utc(Date.now() + 10800000).format("YYYY | HH:mm:ss")  + "```") 
                    .addField("Üyeler ↷",  "```" + üye.map(x => x).join("\n") + "```")  
                    .setColor("RED")
            
  log.send({ username: `${member.guild.name} | Token Saldırısı`, avatarURL: `${member.guild.iconURL() || bot.user.avatarURL()}`, embeds: [embed]})

}

};
module.exports.conf = {
  name: "guildMemberAdd",
};
