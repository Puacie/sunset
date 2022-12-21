const Discord = require('discord.js')
const config = require('../Configuration/config')

module.exports = {

    name: "mutelist",
    description: "Obtenir la liste des mutes d'un membre",
    utilisation: "/mutelist (membre)",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    usage: "/mutelist [user]",
    category: "Administration",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre dont vous voulez récupérer l'historique des mutes",
            required: true,
            autocomplete: false
        },
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("membre")
        if(!user) return message.reply({content: `Je ne parviens pas à trouver un membre correspondant à l'ID \`${user.id}\` !`, ephemeral: true})
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply({content: `Je ne parviens pas à trouver un membre correspondant à l'ID \`${user.id}\` !`, ephemeral: true})

        db.query(`SELECT * FROM mutes WHERE guild = '${message.guild.id}' AND user = '${user.id}'`, async (err, req) => {

            if(req.length < 1) return message.reply({content: `${user.username} n'a jamais été mute !`, ephemeral: true})
            await req.sort((a, b) => parseInt(b.date) - (a.date))

            let EmbedMuteList = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Mutes de ${user.tag}`)
                .setThumbnail(user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                .setFooter({text: `Mutes de ${user.username}`, iconURL: bot.user.displayAvatarURL({dynamic: true})})

            for(let i = 0; i < req.length; i++) {

                EmbedMuteList.addFields([{name: `Mute n°${i + 1}`, value: `> **Auteur** : <@${(await bot.users.fetch(req[i].author)).id}>\n> **ID** : \`${req[i].mute}\`\n> **Temps du mute** : \`${req[i].time}\`\n> **Raison** : \`${req[i].reason}\`\n> **Date** : <t:${Math.floor(parseInt(req[i].date) / 1000)}:F>`}])
            }

            await message.reply({embeds: [EmbedMuteList]})
        })
    }
}