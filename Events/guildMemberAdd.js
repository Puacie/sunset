const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js")

module.exports = async (bot, member, client) => {

    const EmbedMessage  = new EmbedBuilder()
        .setTitle(`Nom de ton Serveur`)
        .setColor(bot.color)
        .setDescription(`Le membre : <@${member.user.id}>.\n \u200B \nViens de rejoindre la Team.`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()

    bot.channels.cache.get('1054816694620655646').send({ embeds: [EmbedMessage]})

    let db = bot.db;

    db.query(`SELECT * FROM server WHERE guild = '${member.guild.id}'`, async (err, req) => {


        if(req[0].captcha === "false") return;
            
            let channel = member.guild.channels.cache.get(req[0].captcha)
            if(!channel) return;

            await channel.permissionOverwrites.create(member.user, {
                SendMessages: true,
                ViewChannel: true,
                ReadMessageHistory: true
            })

            let captcha = await bot.function.generateCaptcha()

            let msg = await channel.send({content: `${member}, vous avez 2 minutes pour compléter le captcha. Si vous ne le réussisez pas, vous serez exclu du serveur.`, files: [new Discord.AttachmentBuilder((await captcha.canvas).toBuffer(), {name: "captcha.png"})]})
        

            try {
                let filter = m => m.author.id === member.user.id;
                let response = (await channel.awaitMessages({filter, max: 1, time: 120000, errors: ["time"]})).first()


                if(response.content === captcha.text) {

                    await msg.delete()
                    await response.delete()
                    try {await member.user.send("Vous avez réussi le captcha.")} catch (err) {}
                    member.roles.add(["1054790408011526215", "1053301538065498133", "1053301943872794654"])

                    await channel.permissionOverwrites.delete(member.user.id)

                } else {

                    await msg.delete()
                    await response.delete()
                    try {await member.user.send("Vous avez échoué le captcha.")} catch (err) {}
                    await channel.permissionOverwrites.delete(member.user.id)
                    await member.kick("A raté le captcha.")
                }

            } catch (err) {
                await msg.delete()
                try {await member.user.send("Vous avez mis trop de temps pour compléter le captcha.")} catch (err) {}
                await channel.permissionOverwrites.delete(member.user.id)
                await member.kick("Pas fait le captcha")
            }

            if(req.length < 1) return;

            if(req[0].antiraid === "true") {

                try {await member.user.send("Vous ne pouvez pas rejoindre ce serveur car il est en mode antiraid.")} catch(err) {}
    
                await member.kick("Antiraid actif")
            }
 
    })

}