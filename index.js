const { Client } = require("discord.js")
const client = new Client({
    intents: [],
});

const fs = require("fs")
client.interactionManager = {
    buttons: buttons,
    selectMenus: selectMenus,
    modals: modals,
};

module.exports = client;

fs.readdirSync('./handler').forEach((handler) => {
    require(`./handler/${handler}`)(client);
});

client.login(process.env.TOKEN);