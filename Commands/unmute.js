const Discord = require("discord.js");
const ms = require("ms")
module.exports = {

    name: "unmute",
    description: "Permet de démute un membre du serveur.",
    utilisation: "/unmute",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre a démute du serveur.",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du démute du serveur.",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

       

            let user = await bot.users.fetch(args._hoistedOptions[0].value)
            if(!user) return message.reply("Pas de membre à démute.")

            let member = message.guild.members.cache.get(user.id)
            if(!member) return message.reply("Pas de membre à démute.")

            let reason = args.get("raison");
            if(!reason) reason = "Pas de raison fournie."

            if(!member.moderatable) return message.reply("Je ne peux pas démute ce membre.")
            if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas démute ce membre.")

            try {await user.send(`Tu as été démute du serveur : ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)} catch (err) {}

            await message.reply(`${message.user} a démute ${user.tag} pour la raison : \`${reason}\``)

            await member.timeout(null, reason)
    }
}