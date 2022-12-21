const Discord = require("discord.js");

module.exports = {

    name: "unban",
    description: "Permet de débannir un membre du serveur.",
    utilisation: "/unban",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre a débannir du serveur.",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du débannissement du membre.",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        try {

            let user = await bot.users.fetch(args._hoistedOptions[0].value)
            if(!user) return message.reply("Pas de membre à bannir.")

            let reason = args.get("raison").value;
            if(!reason) reason = "Pas de raison fournie."

            if(!(await message.guild.bans.fetch()).get(user.id)) return message.reply("Cet utilisateur n'est pas banni.")
        
            try {await user.send(`Tu as été débannis du serveur : ${message.guild.name} pour la raison : \`${reason}\``)} catch (err) {}

            await message.reply(`${message.user} a débannis ${user.tag} pour la raison : \`${reason}\``)

            await message.guild.members.unban(user, reason)
            
        } catch(err) {
            return message.reply("Pas de membre à débannir.")
        }
    }
}