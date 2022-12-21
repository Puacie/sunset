const Discord = require('discord.js');

module.exports = {
name: "addxp",
description: "ajoute de l'xp a un membre",  
utilisation: "?addxp",
permission: Discord.PermissionFlagsBits.Administrator,
dm: false,
category: "Expérience",
options: [
    {
    type: "number",
    name: "xp",
    description: "le nombre d'xp a ajouter",
    required: true,
    autocomplete: false
    }, {
    type: "user",
    name: "membre",
    description: "le membre a qui doit etre ajouter l'xp",
    required: true,
    autocomplete: false,
    }
  ],

  async run(bot, message, args, db) {
    let xp = db.query(`SELECT xp FROM xp`)
    let xptoadd = args.getNumber("xp")
    if(!xptoadd) return message.reply("le nombre d'xp a ajouter est vide ou invalid")
    let user = args.getUser("membre")

    db.query(`UPDATE xp SET xp = '${xptoadd + xp}' WHERE user = '${user.id}' AND guild = '${message.guildId}'`)

    message.reply(`**le nombre \`${xptoadd}\` a été ajouter a \`${user.username}\`**`)
  }
}