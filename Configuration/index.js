const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({intents});
const loadCommands = require("../Handler/loadCommands");
const loadEvents = require("../Handler/loadEvents");
const loadDatabase = require("../Handler/loadDatabase");
const config = require("./config");

bot.commands = new Discord.Collection();
bot.color = "#ffc75d";
bot.function = {
    createId: require("../Functions/createId"),
    calculXp: require("../Functions/calculXp"),
    generateCaptcha: require("../Functions/generateCaptcha"),
    searchSpam: require("../Functions/searchSpam")
};

bot.login(config.token);
loadCommands(bot);
loadEvents(bot);