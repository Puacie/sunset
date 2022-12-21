const { EmbedBuilder } = require("discord.js");

module.exports = async (bot, oldPresence, newPresence, member) => {

    if (!oldPresence) return;
    if (newPresence.activities[0] && newPresence.activities[0].state == "discord.gg/fw5uABVpj4") {
        if (!newPresence.member.roles.cache.some(r => r.id === "1054790407139111013")) {
            newPresence.member.roles.add("1054790407139111013")
        }
    } else {
        if (newPresence.member.roles.cache.some(r => r.id === "1054790407139111013")) {
            newPresence.member.roles.remove("1054790407139111013")
        }
    }
}