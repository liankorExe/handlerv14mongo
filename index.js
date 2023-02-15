const Discord = require("discord.js")
const client = new Discord.Client()
const fs = require("fs")
client.interactionManager = {
    buttons: buttons,
    selectMenus: selectMenus,
    modals: modals,
}

module.exports = client;

fs.readdirSync('./handler').forEach((handler) => {
    require(`./handler/${handler}`)(client)
});

client.login(process.env.TOKEN)