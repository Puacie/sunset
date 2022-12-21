const Discord = require("discord.js");
const { PermissionsBitField } = require("discord.js")

module.exports = async (bot, message) => {

    let db = bot.db;
    if(message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

    
    db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req) => {

        if(req.length < 1) {
            
            db.query(`INSERT INTO server (guild, captcha, antiraid, antispam, reactionrole) VALUES (${message.guild.id}, 'false', 'false', 'false', '')`)
        }

        if(req[0].antispam === "true") await bot.function.searchSpam(message)
    })

    db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`, async (err, req) => { 

        if(req.length < 1) {

            db.query(`INSERT INTO xp (guild, user, xp, level) VALUES (${message.guildId}, '${message.author.id}', '0', '0')`)
        } else {

            let level = parseInt(req[0].level)
            let xp = parseInt(req[0].xp)

            if((level + 1) * 1000 <= xp) {

                db.query(`UPDATE xp SET xp = '${xp - ((level + 1) * 1000)}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`)
                db.query(`UPDATE xp SET level = '${level + 1}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`)
 
            } else {

                let xptogive = Math.floor(Math.random() * 25) + 1;

                db.query(`UPDATE xp SET xp = '${xp + xptogive}' WHERE guild = '${message.guildId}' AND user = '${message.author.id}'`)

            }
        }
    })

    if (message.author.bot) return;
 
    if (message.content.includes("https://") || message.content.includes("discord.gg") || message.content.includes("http://")) {
 
        if (message.member.permissions.has(PermissionsBitField.resolve("ManageChannels"))) {
            return
        } else {
            await message.delete();
            try { await message.member.send({ content: `Le lien/mot ${message.content} est interdits dans le serveur ${message.guild.name}, sauf si tu as la permissions ManageChannels` }) } catch (err) { }
            return await message.channel.send({ content: `${message.author}, Vous n'avez pas le droit de posté ce genre de lien !! Sauf si vous avez la permission MenageChannels` }).then((msg) => {
                setTimeout(() => msg.delete(), 10000)
            })
        }
    } else if ((!message.content.includes("https://") || !message.content.includes("discord.gg") || !message.content.includes("http://"))) {
        return
    }
}