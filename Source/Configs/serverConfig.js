module.exports = {

kanalWebURL: "https://discord.com/api/webhooks/1142585898597355652/-4VcfV7h4uYAvdxCSurfwYWNs-Y4jstKk1T1rhPdYclL8Zs_8XeI7E27-DkUjN4x09mt", // LOG MESAJI İÇİN WEBHOOK URL
rolWebURL: "https://discord.com/api/webhooks/1142585898597355652/-4VcfV7h4uYAvdxCSurfwYWNs-Y4jstKk1T1rhPdYclL8Zs_8XeI7E27-DkUjN4x09mt", // LOG MESAJI İÇİN WEBHOOK URL
banWebURL: "https://discord.com/api/webhooks/1142585898597355652/-4VcfV7h4uYAvdxCSurfwYWNs-Y4jstKk1T1rhPdYclL8Zs_8XeI7E27-DkUjN4x09mt", // LOG MESAJI İÇİN WEBHOOK URL
kickWebURL: "https://discord.com/api/webhooks/1142585898597355652/-4VcfV7h4uYAvdxCSurfwYWNs-Y4jstKk1T1rhPdYclL8Zs_8XeI7E27-DkUjN4x09mt", // LOG MESAJI İÇİN WEBHOOK URL
emojiWebURL: "https://discord.com/api/webhooks/1142585898597355652/-4VcfV7h4uYAvdxCSurfwYWNs-Y4jstKk1T1rhPdYclL8Zs_8XeI7E27-DkUjN4x09mt", // LOG MESAJI İÇİN WEBHOOK URL
botWebURL: "https://discord.com/api/webhooks/1142585898597355652/-4VcfV7h4uYAvdxCSurfwYWNs-Y4jstKk1T1rhPdYclL8Zs_8XeI7E27-DkUjN4x09mt", // LOG MESAJI İÇİN WEBHOOK URL
tokenWebURL: "https://discord.com/api/webhooks/1142585898597355652/-4VcfV7h4uYAvdxCSurfwYWNs-Y4jstKk1T1rhPdYclL8Zs_8XeI7E27-DkUjN4x09mt", // LOG MESAJI İÇİN WEBHOOK URL
serverWebURL: "https://discord.com/api/webhooks/1142585898597355652/-4VcfV7h4uYAvdxCSurfwYWNs-Y4jstKk1T1rhPdYclL8Zs_8XeI7E27-DkUjN4x09mt", // LOG MESAJI İÇİN WEBHOOK URL
webhookWebURL: "https://discord.com/api/webhooks/1142585898597355652/-4VcfV7h4uYAvdxCSurfwYWNs-Y4jstKk1T1rhPdYclL8Zs_8XeI7E27-DkUjN4x09mt", // LOG MESAJI İÇİN WEBHOOK URL
  
safeMembers: ["339496321889075200","930182562721194056",""], // KORUMALARDAN ETKILENMIYECEK ÜYELER
safeRoles: ["1109198224209743902","1142554502570975312"], // KORUMADAN ETKILENMIYECEK ROLLER

jailRoleID: "1142965578450088057", // KULLANICI LIMITI AŞTIĞINDA VERILECEK CEZA ROLÜNÜN ID

vaintyURL: "trickers", // SUNUCUNUN ÖZEL URL'si
serverID: "1109188981788254330", // KORUMA YAPILACAK SUNUCUNUN ID

spamMessageSize: 7, // KULLANICI XX SANİYEDE XX MESAJ ATARSA SPAM ENGEL MESAJ SAYISI
spamTime: 3000, // KULLANICI XX SANİYEDE XX MESAJ ATARSA SPAM ENGEL SÜRESİ ( 1000 ms => 1 saniye )

capsLockSınır: 60, // MESAJDA KAÇ % BÜYÜK HARF VARSA CAPSLOCK ENGEL BAŞLAT

tokenTime: 300000, // XX SANIYEDE XX KULLANICI GIRERSE TOKEN ENGEL SÜRESİ ( 1000 ms => 1 saniye )
tokenSize: 50, // XX SANIYEDE XX KULLANICI GIRERSE TOKEN ENGEL ÜYE SAYISI
tokenRaidRol: "1142965578450088057", // XX SANIYEDE XX KULLANICI GIRERSE TOKEN ENGEL CEZA ROLÜNÜN ID

kanalLimit: 5, // KORUMA LIMITIDIR ( SADECE SAYI DEĞERI KULLANIN )
rolLimit: 5, // KORUMA LIMITIDIR ( SADECE SAYI DEĞERI KULLANIN )
banLimit: 5, // KORUMA LIMITIDIR ( SADECE SAYI DEĞERI KULLANIN )
kickLimit: 5, // KORUMA LIMITIDIR ( SADECE SAYI DEĞERI KULLANIN )
emojiLimit: 5, // KORUMA LIMITIDIR ( SADECE SAYI DEĞERI KULLANIN )
botLimit: 5, // KORUMA LIMITIDIR ( SADECE SAYI DEĞERI KULLANIN )
serverLimit: 5, // KORUMA LIMITIDIR ( SADECE SAYI DEĞERI KULLANIN )

küfürler: ["fuck", "nigg", "fuk", "cunt", "cnut", "bitch", "dick", "d1ck", "pussy", "asshole", "b1tch", "b!tch", "blowjob", "cock", "c0ck", "orspu", "amk çocu",  "skiyim", "sikim ", "skim", "orospu ", "orospu çocuğu", "orspu çocu", "salak", "slak", "slk", "grzkalı", "grzkali ", "aptl", "aptal", "malmısn", "malmısın", "kaşar", "kaşr", "gtnde", "göt", "g.t", "kaşmer", "zenci", "avrad ", "avrat ", "döl", "köpek", "köpk",  "oevladı", "o.evladı", "Sikiş", "sikis", "sikş",  "seks", "sex", "yarrak",  "skerim", "skerm", "sīkerim",  "síkerm", "síkerim", "sįkerim", "sįkerįm", "sīkerīm", "skerīm", "síkerím", "sík", "sįk ", "sīk", "sïk", "sîk", "o.ç", "mall", "amcık", "amcik", "aptl", "aminakoyim", "amınakoyim", "amnakoyim", "aminakoyım", "salak"],
kısaltmaKüfürler: ["amk", "awq", "aq", "slkmsn", "slk", "mq", "mal", "oç", "sik", "am","fdp","nigger","oc",""],
reklamlar: ["discord.app", "discord.gg", "discordapp", "discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https://", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", "discord.gift", "discord.com/invite"]
};
  