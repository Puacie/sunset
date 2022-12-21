const Discord = require("discord.js");

module.exports = {

    name: "kick",
    description: "Permet de kick un membre du serveur.",
    utilisation: "?kick ou /kick (membre et la raison)",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre a bannir du serveur.",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du bannissement du membre.",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

            let user = await bot.users.fetch(args._hoistedOptions[0].value)
            if(!user) return message.reply("Pas de membre à kick.")
            let member = message.guild.members.cache.get(user.id)

            let reason = args.get("raison");
            if(!reason) reason = "Pas de raison fournie."

            if(message.user.id === user.id) return message.reply("N'essaye pas de te kick.")
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas kick le propriétaire du serveur.")

            if(member && !member?.kickable) return message.reply("Je ne peux pas kick ce membre.")
            if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas kick ce membre.")

            try {await user.send(`Tu as été kick du serveur : ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)} catch (err) {}

            await message.reply(`${message.user} a kick ${message.guild.name} par ${message.user.tag} pour la raison : \`${reason}\``)

            await member.kick(reason)
    }
}