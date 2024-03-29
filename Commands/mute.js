const Discord = require("discord.js");
const ms = require("ms")
module.exports = {

    name: "mute",
    description: "Permet de mute un membre du serveur.",
    utilisation: "/mute (membre) et (raison)",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre a mute du serveur.",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "temps",
            description: "Le temps du mute",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du mute du serveur.",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

       

            let user = await bot.users.fetch(args._hoistedOptions[0].value)
            if(!user) return message.reply("Pas de membre à mute.")

            let member = message.guild.members.cache.get(user.id)
            if(!member) return message.reply("Pas de membre à mute.")

            let time = args.getString("temps")
            if(!time) return message.reply("Pas de temps préciser.")
            if(isNaN(ms(time))) return message.reply("Pas le bon format.")
            if(ms(time) > 2419200000) return message.reply("Le mute ne peut pas durer plus de 28 jours")


            let reason = args.get("raison");
            if(!reason) reason = "Pas de raison fournie."

            if(message.user.id === user.id) return message.reply("Ne te mute pas.")
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Tu ne peux pas mute le propriétaire du serveur.")

            if(!member.moderatable) return message.reply("Je ne peux pas mute ce membre.")
            if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas mute ce membre.")
            if(member.isCommunicationDisabled()) return message.reply("Ce membre est déjà mute.")

            try {await user.send(`Tu as été mute du serveur : ${message.guild.name} par ${message.user.tag} pendant ${time} pour la raison : \`${reason}\``)} catch (err) {}

            await message.reply(`${message.user} a mute ${user.tag} pendant ${time} pour la raison : \`${reason}\``)

            await member.timeout(ms(time), reason)

            let ID = await bot.function.createId("MUTE")

db.query(`INSERT INTO mutes (guild, user, author, mute, time, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${time}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
    }
}