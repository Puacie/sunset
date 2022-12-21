const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = async (bot, interaction) => {

    if(interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
        
        let entry = interaction.options.getFocused()



        if(interaction.commandName === "help") {
            let choices = bot.commands.filter(cmd => cmd.name.includes(entry))
            await interaction.respond(entry === "" ? bot.commands.map(cmd => ({name: cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice.name, value: choice.name})))
        }

        if(interaction.commandName === "setcaptcha") {
            let choices = ["on", "off"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "setantiraid" || interaction.commandName === "setantiraid" || interaction.commandName === "setantispam") {
            let choices = ["on", "off"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

        if(interaction.commandName === "roles") {
            let choices = ["add", "remove"]
            let sortie = choices.filter(c => c.includes(entry))
            await interaction.respond(entry === "" ? sortie.map(c => ({name: c, value: c})) : sortie.map(c => ({name: c, value: c})))
        }

    }

    if(interaction.type === Discord.InteractionType.ApplicationCommand) {

        let command = require(`../Commands/${interaction.commandName}`)
        command.run(bot, interaction, interaction.options, bot.db);
    }


    if(interaction.isButton()) {

        if(interaction.customId === "ticket") {

            let channel = await interaction.guild.channels.create({
                name: `Ticket-${interaction.user.username}`,
                type: Discord.ChannelType.GuildText,
            })

            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                ViewChannel: false
            })
            await channel.permissionOverwrites.create(interaction.user, {
                ViewChannel: false,
                EmbedLinks: true,
                SendMessages: true,
                AttachFiles: true,
                ReadMessageHistory: true
            })
            await channel.permissionOverwrites.create("1053296892919955497", {
                ViewChannel: false,
                EmbedLinks: true,
                SendMessages: true,
                AttachFiles: true,
                ReadMessageHistory: true
            })

            await channel.setParent(interaction.channel.parent.id)
            await channel.setTopic(interaction.user.id)
            await interaction.reply({content: `Votre ticket a correctement été créé : ${channel}`, ephemeral: true})

            let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle("Création d'un ticket")
            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
            .setDescription("Ticket Créé")
            .setTimestamp()
            .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL({dynamic: true})})


            const btn = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
            .setCustomId("close")
            .setLabel("Fermeture du ticket")
            .setStyle(Discord.ButtonStyle.Danger)
            .setEmoji("🗑️"))

            await channel.send({embeds: [Embed], components: [btn]})
        }

        if(interaction.customId === "close") {

            let user = bot.guilds.cache.get(interaction.channel.topic)
            try {await user.send("Votre ticket a été fermé")} catch(err) {}

            await interaction.channel.delete()
        }
    }
}