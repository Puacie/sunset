const Discord = require("discord.js");

module.exports = {

    name: "clear",
    description: "Permet de supprimer un nombre de message entre (0 et 100)",
    utilisation: "/clear (nombre)",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "number",
            name: "nombre",
            description: "Le nombre de message(s) à supprimer.",
            required: true,
            autocomplete: false
        },
        {
            type: "channel",
            name: "salon",
            description: "Le salon où effacer les messages.",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {
        let channel = args.getChannel("salon")
        if(!channel) channel = message.channel;
        if(channel.id != message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply("Pas de salon !");

        let number = args.getNumber("nombre");
        if(parseInt(number) <= 0 || parseInt(number) > 100) return message.reply("Il me faut un nombre entre `0` et `100`.")


        try {
            let messages = await channel.bulkDelete(parseInt(number))

            await message.reply({content: `J'ai supprimé \`${messages.size}\` message(s)`, ephemeral: true})
        } catch (err) {
            let messages = [...(await channel.messages.fecth()).values()].filter(async m => m.createdAt <= 1209600000)
            if(message.length <= 0) return message.reply("Aucun message à supprimer car ils dataient tous de plus de 14 jours .");
            await channel.bulkDelete(messages);

            await message.reply({ content: `J'ai pu supprimé uniquement \`${message.size}\` message(s) car les autres dataient de plus de 14 jours.`, ephemeral: true})
        }
    }
}