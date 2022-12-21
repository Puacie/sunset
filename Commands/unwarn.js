const Discord = require("discord.js");

module.exports = {
    name: "unwarn",
    description: "Unwarn un membre",
    utilisation: "/unwarn",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: `Modération`,
    options: [ {type: "user", name: "membre", description: "Le membre à warn", required: true, autocomplete: true }, ],
async run(bot, message, args, db) {
        let user = args.getUser("membre")
        if(!user) return message.reply("Pas de membre !")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Pas de membre !")

        db.query(`SELECT * FROM warns WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {

            await req.sort((a, b) => parseInt(a.date) - parseInt(b.date))
            if(req.length < 1) return message.reply("Ce membre n'a pas de warn !")
            
            await message.reply(`Le dernier warn (\`${req[0].warn}\`) de \`${user.tag}\` à été supprimer avec succès !`)
            try {
                user.send(`Votre dernier warn (\`${req[0].warn}\`)\n> Date: <t:${Math.floor(parseInt(req[0].date / 1000))}:F>`)
            } catch(err) {

            }
            db.query(`DELETE FROM warns WHERE guild = '${message.guildId}'`)
        })      
    }
}