const Discord = require("discord.js")
const { EmbedBuilder } = require("discord.js")

module.exports = {

  name: "restartxp",
  description: "Réinitialiser le système d'expérience",
  utilisation: "/restartxp",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "Expérience",

  async run(bot, message, args, db) {

        db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}'`, async (err, req) => {

          db.query(`UPDATE xp SET level = '0' WHERE guild = '${message.guildId}'`)
          db.query(`UPDATE xp SET xp = '0' WHERE guild = '${message.guildId}'`)

          const EmbedSuccessRestart = new EmbedBuilder()
          .setColor(bot.color)
          .setDescription(`✅ ${message.user} a réinitialisé le système d'expérience avec succès !`)

          await message.reply({embeds: [EmbedSuccessRestart]})
        })
  }
}