const Discord = require("discord.js")
const Canvas = require("discord-canvas-easy")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "rank",
    description: "Donne l'xp d'un membre",
    utilisation: "/rank",
    permission: "Aucune",
    dm: false,
    category: "Experience",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'xp du membre a regarder",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args, db) {

        let user;
        if(args.getUser("utilisateur")) {
            user = args.getUser("utilisateur")
            const tr = new EmbedBuilder()
            .setDescription(`Aucune Membre Spécifié !`)
            .setColor(bot.color)
            .setTimestamp()
            if (!user || !message.guild.members.cache.get(user?.id)) return message.reply({embeds: [tr], ephemeral: true})


        } else user = message.user;

        db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async (err, req) => {

            db.query(`SELECT * FROM xp WHERE guild = '${message.guildId}'`, async (err, all) => {
                
                const aeee = new EmbedBuilder()
                .setDescription(`Ce membre n'a pas d'xp !`)
                .setColor(bot.color)
                .setTimestamp()
            if(req.length < 1) return message.reply({embeds: [aeee], ephemeral: true})

            await message.deferReply()

            const calculXp = (xp, level) => {
                let xptotal = 0;
                for(let i = 0; i < level; i++) xptotal += parseInt((level + 1) * 1000)
                xptotal += xp;
                return xptotal
            }

            let leaderboard = await all.sort(async (a, b) => (await bot.function.calculXp(parseInt(a.xp), parseInt(a.level))))
            let xp =  parseInt(req[0].xp)
            let level = parseInt(req[0].level)
            let rank = leaderboard.findIndex(r => r.user === message.user.id) + 1
            let need = (level + 1) * 1000;
            
              let Card = await new Canvas.Card()
              .setBackground("https://cdn.discordapp.com/attachments/1054519221444419646/1054756730975817769/sunset-background-with-coconut-tree-vector1.jpg")
            .setBot(bot)
            .setColorFont(bot.color)
            .setRank(rank)
            .setUser(user)
            .setColorProgressBar("#ff00e9")
            .setGuild(message.guild)
            .setXp(xp)
            .setLevel(level)
            .setXpNeed(need)
            .toCard()

            await message.followUp({files: [new Discord.AttachmentBuilder(Card.toBuffer(), {name: "rank.png"})]})
          })
        })
    }
}