const Dicord = require("discord.js");

module.exports = {

    name: "ping",
    description: "Permet de connaître la latence du bot.",
    utilisation: "/ping",
    permission: "Aucune",
    dm: true,
    category: "Information",

    async run(bot, message) {
        await message.reply(`Latence du bot : \`${bot.ws.ping}\``)
    }
}